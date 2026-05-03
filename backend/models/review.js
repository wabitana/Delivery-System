const pool = require("../db");

async function create({ user_id, order_id, vendor_id, rating, comment }) {
  await pool.query(
    `INSERT INTO reviews (user_id, order_id, vendor_id, rating, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, order_id, vendor_id, rating, comment || null]
  );
  const [rows] = await pool.query("SELECT * FROM reviews WHERE order_id = ?", [order_id]);
  return rows[0];
}

async function listByVendor(vendorId) {
  const [rows] = await pool.query(
    `SELECT r.*, u.full_name AS reviewer_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.vendor_id = ?
     ORDER BY r.created_at DESC`,
    [vendorId]
  );
  return rows;
}

async function avgForVendor(vendorId) {
  const [rows] = await pool.query(
    "SELECT AVG(rating) AS avg_rating, COUNT(*) AS count FROM reviews WHERE vendor_id = ?",
    [vendorId]
  );
  return rows[0];
}

module.exports = { create, listByVendor, avgForVendor };
