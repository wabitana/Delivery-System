const pool = require("../db");

const STATUS_FLOW = [
  "pending",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "out_for_delivery",
  "delivered",
  "cancelled"
];

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT o.*, v.business_name,
            u.full_name AS customer_name, u.email AS customer_email,
            dp.user_id AS delivery_user_id
     FROM orders o
     JOIN vendors v ON v.id = o.vendor_id
     JOIN users u ON u.id = o.user_id
     LEFT JOIN delivery_persons dp ON dp.id = o.delivery_person_id
     WHERE o.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findItems(orderId) {
  const [rows] = await pool.query(
    `SELECT oi.*, p.name AS product_name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  return rows;
}

async function listForUser(userId) {
  const [rows] = await pool.query(
    `SELECT o.*, v.business_name
     FROM orders o
     JOIN vendors v ON v.id = o.vendor_id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
}

async function listForVendor(vendorId) {
  const [rows] = await pool.query(
    `SELECT o.*, u.full_name AS customer_name
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.vendor_id = ?
     ORDER BY o.created_at DESC`,
    [vendorId]
  );
  return rows;
}

async function listForDelivery(deliveryPersonId) {
  const [rows] = await pool.query(
    `SELECT o.*, v.business_name, u.full_name AS customer_name
     FROM orders o
     JOIN vendors v ON v.id = o.vendor_id
     JOIN users u ON u.id = o.user_id
     WHERE o.delivery_person_id = ?
     ORDER BY o.updated_at DESC`,
    [deliveryPersonId]
  );
  return rows;
}

async function updateStatus(orderId, status) {
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
}

async function assignDelivery(orderId, deliveryPersonId) {
  await pool.query("UPDATE orders SET delivery_person_id = ? WHERE id = ?", [
    deliveryPersonId,
    orderId
  ]);
}

function nextSimulatedStatus(current) {
  if (current === "cancelled" || current === "delivered") return current;
  const i = STATUS_FLOW.indexOf(current);
  if (i === -1 || i >= STATUS_FLOW.length - 2) return current;
  return STATUS_FLOW[i + 1];
}

module.exports = {
  findById,
  findItems,
  listForUser,
  listForVendor,
  listForDelivery,
  updateStatus,
  assignDelivery,
  nextSimulatedStatus,
  STATUS_FLOW
};
