const pool = require("../db");
const deliveryModel = require("../models/delivery");
const orderModel = require("../models/order");
const vendorModel = require("../models/vendor");
const notificationModel = require("../models/notification");
const asyncHandler = require("../middlewares/asyncHandler");

const listOpenOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== "delivery" && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Delivery role required" });
  }
  const [rows] = await pool.query(
    `SELECT o.*, v.business_name, u.full_name AS customer_name
     FROM orders o
     JOIN vendors v ON v.id = o.vendor_id
     JOIN users u ON u.id = o.user_id
     WHERE o.status = 'ready_for_pickup' AND o.delivery_person_id IS NULL
     ORDER BY o.created_at ASC`
  );
  res.json({ success: true, orders: rows });
});

const profileGet = asyncHandler(async (req, res) => {
  if (req.user.role !== "delivery" && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Delivery role required" });
  }
  const person = await deliveryModel.ensurePerson(req.user.id);
  res.json({ success: true, delivery_person: person });
});

const profilePatch = asyncHandler(async (req, res) => {
  if (req.user.role !== "delivery" && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Delivery role required" });
  }
  await deliveryModel.ensurePerson(req.user.id);
  const patch = { ...req.body };
  if (patch.is_available !== undefined) {
    patch.is_available = patch.is_available ? 1 : 0;
  }
  const person = await deliveryModel.updatePerson(req.user.id, patch);
  res.json({ success: true, delivery_person: person });
});

const addTracking = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderModel.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  const person = await deliveryModel.ensurePerson(req.user.id);
  const vendor = await vendorModel.findByUserId(req.user.id);
  const isVendor = vendor && vendor.id === order.vendor_id;
  const isRider = order.delivery_person_id === person.id;
  const isAdmin = req.user.role === "admin";
  if (!isRider && !isVendor && !isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const row = await deliveryModel.addTracking(orderId, isRider ? person.id : null, req.body);
  if (req.body.latitude != null && req.body.longitude != null && isRider) {
    await deliveryModel.updatePerson(req.user.id, {
      current_latitude: req.body.latitude,
      current_longitude: req.body.longitude
    });
  }
  res.status(201).json({ success: true, tracking: row });
});

const claimOrder = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.orderId);
  if (req.user.role !== "delivery" && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Delivery role required" });
  }
  const person = await deliveryModel.ensurePerson(req.user.id);
  const order = await orderModel.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  if (order.status !== "ready_for_pickup") {
    return res.status(400).json({
      success: false,
      message: "Vendor must mark the order ready for pickup before a courier can claim it."
    });
  }
  if (order.delivery_person_id && order.delivery_person_id !== person.id) {
    return res.status(409).json({ success: false, message: "Already assigned to another rider" });
  }
  await orderModel.assignDelivery(orderId, person.id);
  await orderModel.updateStatus(orderId, "out_for_delivery");
  await deliveryModel.addTracking(orderId, person.id, {
    status_note: "Courier picked up the order"
  });
  notificationModel
    .notifyCustomer(order.user_id, {
      type: "courier_assigned",
      title: "Courier en route",
      body: `Your order #${orderId} is now out for delivery.`,
      data: { orderId }
    })
    .catch(() => {});
  const updated = await orderModel.findById(orderId);
  res.json({ success: true, order: updated });
});

const trackingList = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderModel.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  const vendor = await vendorModel.findByUserId(req.user.id);
  const person = await deliveryModel.findPersonByUserId(req.user.id);
  const ok =
    order.user_id === req.user.id ||
    req.user.role === "admin" ||
    (vendor && vendor.id === order.vendor_id) ||
    (person && order.delivery_person_id === person.id);
  if (!ok) return res.status(403).json({ success: false, message: "Forbidden" });
  const rows = await deliveryModel.listTracking(orderId);
  res.json({ success: true, tracking: rows });
});

module.exports = {
  listOpenOrders,
  profileGet,
  profilePatch,
  addTracking,
  claimOrder,
  trackingList
};
