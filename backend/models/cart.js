const pool = require("../db");

async function getCartWithProducts(userId) {
  const [rows] = await pool.query(
    `SELECT ci.id AS cart_item_id, ci.quantity, ci.product_id,
            p.name, p.price, p.image_url, p.is_available, p.vendor_id,
            v.business_name
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     JOIN vendors v ON v.id = p.vendor_id
     WHERE ci.user_id = ?
     ORDER BY ci.updated_at DESC`,
    [userId]
  );
  return rows;
}

async function upsertItem(userId, productId, quantity) {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = ?, updated_at = CURRENT_TIMESTAMP`,
    [userId, productId, quantity, quantity]
  );
}

async function updateQuantity(userId, productId, quantity) {
  const [res] = await pool.query(
    "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?",
    [quantity, userId, productId]
  );
  return res.affectedRows > 0;
}

async function removeItem(userId, productId) {
  const [res] = await pool.query(
    "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
  return res.affectedRows > 0;
}

async function clear(userId) {
  await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
}

module.exports = { getCartWithProducts, upsertItem, updateQuantity, removeItem, clear };
