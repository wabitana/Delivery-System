const pool = require("../db");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const orderModel = require("../models/order");
const paymentModel = require("../models/payment");
const vendorModel = require("../models/vendor");
const deliveryModel = require("../models/delivery");
const notificationModel = require("../models/notification");
const asyncHandler = require("../middlewares/asyncHandler");

async function loadOrderAuth(orderId, user) {
  const order = await orderModel.findById(orderId);
  if (!order) return { error: 404, message: "Order not found" };
  const vendor = await vendorModel.findByUserId(user.id);
  const deliveryPerson = await deliveryModel.findPersonByUserId(user.id);
  const isCustomer = order.user_id === user.id;
  const isVendorOwner = vendor && vendor.id === order.vendor_id;
  const isAssignedRider =
    deliveryPerson && order.delivery_person_id === deliveryPerson.id;
  const isAdmin = user.role === "admin";
  return { order, isCustomer, isVendorOwner, isAssignedRider, isAdmin, deliveryPerson };
}

const checkout = asyncHandler(async (req, res) => {
  const { delivery_address, notes, delivery_fee, tax_rate } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [cartRows] = await conn.query(
      `SELECT ci.quantity, ci.product_id, p.price, p.vendor_id, p.is_available, v.status AS vendor_status
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       JOIN vendors v ON v.id = p.vendor_id
       WHERE ci.user_id = ?
       FOR UPDATE`,
      [req.user.id]
    );
    if (!cartRows.length) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    const vendorIds = new Set(cartRows.map(r => r.vendor_id));
    if (vendorIds.size > 1) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: "Checkout supports one restaurant per order. Split your cart."
      });
    }
    const vendorId = [...vendorIds][0];
    let subtotal = 0;
    for (const row of cartRows) {
      if (!row.is_available || row.vendor_status !== "active") {
        await conn.rollback();
        return res.status(400).json({ success: false, message: "Some items are unavailable" });
      }
      subtotal += Number(row.price) * row.quantity;
    }
    subtotal = Math.round(subtotal * 100) / 100;
    const fee = Number(delivery_fee);
    const tax = Math.round(subtotal * Number(tax_rate) * 100) / 100;
    const total = Math.round((subtotal + fee + tax) * 100) / 100;

    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, vendor_id, status, subtotal, delivery_fee, tax, total, delivery_address, notes)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
      [req.user.id, vendorId, subtotal, fee, tax, total, delivery_address, notes || null]
    );
    const orderId = orderResult.insertId;

    for (const row of cartRows) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, row.product_id, row.quantity, row.price]
      );
    }

    const ref = `mock_${orderId}_${Date.now()}`;
    await conn.query(
      `INSERT INTO payments (order_id, amount, method, status, transaction_ref)
       VALUES (?, ?, 'wallet_mock', 'pending', ?)`,
      [orderId, total, ref]
    );

    await conn.query("DELETE FROM cart_items WHERE user_id = ?", [req.user.id]);

    await conn.query(
      `INSERT INTO delivery_tracking (order_id, delivery_person_id, status_note)
       VALUES (?, NULL, ?)`,
      [orderId, "Order placed — awaiting payment"]
    );

    await conn.commit();

    notificationModel
      .notifyVendorOwner(vendorId, {
        type: "order_new",
        title: "New customer order",
        body: `Order #${orderId} was placed and is awaiting payment.`,
        data: { orderId }
      })
      .catch(() => {});
    notificationModel
      .notifyAvailableCouriers({
        type: "order_created",
        title: "New shipment request",
        body: `Order #${orderId} entered the network (payment pending).`,
        data: { orderId }
      })
      .catch(() => {});

    const order = await orderModel.findById(orderId);
    const items = await orderModel.findItems(orderId);
    const payment = await paymentModel.findByOrderId(orderId);
    res.status(201).json({ success: true, order, items, payment });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

const listMine = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  const deliveryPerson = await deliveryModel.findPersonByUserId(req.user.id);
  if (vendor && (req.query.scope === "vendor" || req.query.as === "vendor")) {
    const orders = await orderModel.listForVendor(vendor.id);
    return res.json({ success: true, orders });
  }
  if (
    deliveryPerson &&
    (req.user.role === "delivery" || req.query.scope === "delivery")
  ) {
    const orders = await orderModel.listForDelivery(deliveryPerson.id);
    return res.json({ success: true, orders });
  }
  const orders = await orderModel.listForUser(req.user.id);
  res.json({ success: true, orders });
});

const getOne = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.id);
  const ctx = await loadOrderAuth(orderId, req.user);
  if (ctx.error) return res.status(ctx.error).json({ success: false, message: ctx.message });
  const { order, isCustomer, isVendorOwner, isAssignedRider, isAdmin } = ctx;
  if (!isCustomer && !isVendorOwner && !isAssignedRider && !isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const items = await orderModel.findItems(orderId);
  const payment = await paymentModel.findByOrderId(orderId);
  const tracking = await deliveryModel.listTracking(orderId);
  res.json({ success: true, order, items, payment, tracking });
});

const updateStatus = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;
  const ctx = await loadOrderAuth(orderId, req.user);
  if (ctx.error) return res.status(ctx.error).json({ success: false, message: ctx.message });
  const { order, isVendorOwner, isAssignedRider, isAdmin } = ctx;

  const vendorAllowed = new Set(["confirmed", "preparing", "ready_for_pickup", "cancelled"]);
  const riderAllowed = new Set(["out_for_delivery", "delivered"]);
  const adminAllowed = new Set([
    "pending",
    "confirmed",
    "preparing",
    "ready_for_pickup",
    "out_for_delivery",
    "delivered",
    "cancelled"
  ]);

  let allowed = false;
  if (isAdmin) allowed = adminAllowed.has(status);
  else if (isVendorOwner && vendorAllowed.has(status)) allowed = true;
  else if (isAssignedRider && riderAllowed.has(status)) allowed = true;

  if (!allowed) {
    return res.status(403).json({ success: false, message: "Cannot set this status" });
  }

  if (status === "cancelled" && order.status === "delivered") {
    return res.status(400).json({ success: false, message: "Cannot cancel delivered order" });
  }

  const prevStatus = order.status;
  await orderModel.updateStatus(orderId, status);
  await deliveryModel.addTracking(orderId, ctx.deliveryPerson?.id || null, {
    status_note: `Status updated to ${status.replace(/_/g, " ")}`
  });

  if (status === "ready_for_pickup" && prevStatus !== "ready_for_pickup") {
    notificationModel
      .notifyAvailableCouriers({
        type: "pickup_ready",
        title: "Pickup ready — claim route",
        body: `Order #${orderId} is staged for courier pickup.`,
        data: { orderId }
      })
      .catch(() => {});
  }

  const updated = await orderModel.findById(orderId);
  res.json({ success: true, order: updated });
});

const simulateStep = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.id);
  const ctx = await loadOrderAuth(orderId, req.user);
  if (ctx.error) return res.status(ctx.error).json({ success: false, message: ctx.message });
  if (!ctx.isCustomer && !ctx.isAdmin) {
    return res.status(403).json({ success: false, message: "Demo simulation for customer only" });
  }
  const order = ctx.order;
  if (order.status === "pending") {
    return res.status(400).json({
      success: false,
      message: "Complete payment first (mock payment) before simulating delivery."
    });
  }
  const next = orderModel.nextSimulatedStatus(order.status);
  if (next === order.status) {
    return res.json({ success: true, order, message: "No further steps" });
  }
  const prevStatus = order.status;
  await orderModel.updateStatus(orderId, next);
  await deliveryModel.addTracking(orderId, null, {
    status_note: `(Simulation) Advanced to ${next.replace(/_/g, " ")}`
  });
  if (next === "ready_for_pickup" && prevStatus !== "ready_for_pickup") {
    notificationModel
      .notifyAvailableCouriers({
        type: "pickup_ready",
        title: "Pickup ready — claim route",
        body: `Order #${orderId} is staged for courier pickup.`,
        data: { orderId }
      })
      .catch(() => {});
  }
  const updated = await orderModel.findById(orderId);
  const tracking = await deliveryModel.listTracking(orderId);
  res.json({ success: true, order: updated, tracking });
});

module.exports = { checkout, listMine, getOne, updateStatus, simulateStep };
