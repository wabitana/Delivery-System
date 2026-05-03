const pool = require("../db");

async function createPending(orderId, amount, method = "wallet_mock") {
  const ref = `mock_${orderId}_${Date.now()}`;
  const [r] = await pool.query(
    `INSERT INTO payments (order_id, amount, method, status, transaction_ref)
     VALUES (?, ?, ?, 'pending', ?)`,
    [orderId, amount, method, ref]
  );
  return findByOrderId(orderId);
}

async function findByOrderId(orderId) {
  const [rows] = await pool.query("SELECT * FROM payments WHERE order_id = ?", [orderId]);
  return rows[0] || null;
}

async function complete(orderId, method) {
  await pool.query(
    `UPDATE payments SET status = 'completed', method = COALESCE(?, method), updated_at = CURRENT_TIMESTAMP
     WHERE order_id = ?`,
    [method || null, orderId]
  );
  return findByOrderId(orderId);
}

module.exports = { createPending, findByOrderId, complete };
