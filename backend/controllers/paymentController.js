const orderModel = require("../models/order");
const paymentModel = require("../models/payment");
const deliveryModel = require("../models/delivery");
const notificationModel = require("../models/notification");
const asyncHandler = require("../middlewares/asyncHandler");

const completeMock = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderModel.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  if (order.user_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const payment = await paymentModel.findByOrderId(orderId);
  if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
  if (payment.status === "completed") {
    return res.json({ success: true, message: "Already paid", payment, order });
  }
  const method = req.body.method || payment.method || "wallet_mock";
  await paymentModel.complete(orderId, method);
  if (order.status === "pending") {
    await orderModel.updateStatus(orderId, "confirmed");
    await deliveryModel.addTracking(orderId, null, {
      status_note: "Payment received — restaurant notified"
    });
    notificationModel
      .notifyAvailableCouriers({
        type: "order_paid",
        title: "Shipment funded",
        body: `Order #${orderId} payment cleared — monitor pickup board.`,
        data: { orderId }
      })
      .catch(() => {});
  }
  const updatedOrder = await orderModel.findById(orderId);
  const updatedPayment = await paymentModel.findByOrderId(orderId);
  res.json({ success: true, payment: updatedPayment, order: updatedOrder });
});

module.exports = { completeMock };
