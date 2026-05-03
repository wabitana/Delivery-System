const reviewModel = require("../models/review");
const orderModel = require("../models/order");
const paymentModel = require("../models/payment");
const asyncHandler = require("../middlewares/asyncHandler");

const create = asyncHandler(async (req, res) => {
  const { order_id, rating, comment } = req.body;
  const order = await orderModel.findById(order_id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  if (order.user_id !== req.user.id) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  if (order.status !== "delivered") {
    return res.status(400).json({ success: false, message: "Can only review delivered orders" });
  }
  const payment = await paymentModel.findByOrderId(order_id);
  if (!payment || payment.status !== "completed") {
    return res.status(400).json({ success: false, message: "Order must be paid" });
  }
  try {
    const review = await reviewModel.create({
      user_id: req.user.id,
      order_id,
      vendor_id: order.vendor_id,
      rating,
      comment
    });
    res.status(201).json({ success: true, review });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Already reviewed" });
    }
    throw e;
  }
});

const byVendor = asyncHandler(async (req, res) => {
  const vendorId = Number(req.params.vendorId);
  const reviews = await reviewModel.listByVendor(vendorId);
  const agg = await reviewModel.avgForVendor(vendorId);
  res.json({
    success: true,
    reviews,
    summary: {
      avg_rating: agg.avg_rating != null ? Number(agg.avg_rating).toFixed(2) : null,
      count: agg.count
    }
  });
});

module.exports = { create, byVendor };
