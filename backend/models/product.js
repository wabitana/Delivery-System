const pool = require("../db");

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, v.business_name AS vendor_name, v.status AS vendor_status,
            c.name AS category_name
     FROM products p
     JOIN vendors v ON v.id = p.vendor_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function list(filters) {
  const { vendor_id, category_id, q, available_only } = filters;
  let sql = `
    SELECT p.*, v.business_name AS vendor_name, c.name AS category_name
    FROM products p
    JOIN vendors v ON v.id = p.vendor_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE v.status = 'active'
  `;
  const params = [];
  if (vendor_id) {
    sql += " AND p.vendor_id = ?";
    params.push(vendor_id);
  }
  if (category_id) {
    sql += " AND p.category_id = ?";
    params.push(category_id);
  }
  if (available_only !== false) {
    sql += " AND p.is_available = 1";
  }
  if (q && String(q).trim()) {
    sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
    const term = `%${String(q).trim()}%`;
    params.push(term, term);
  }
  sql += " ORDER BY p.created_at DESC";
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function createForVendor(vendorId, data) {
  const [r] = await pool.query(
    `INSERT INTO products (vendor_id, category_id, name, description, price, image_url, is_available)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      vendorId,
      data.category_id || null,
      data.name,
      data.description || null,
      data.price,
      data.image_url || null,
      data.is_available !== false ? 1 : 0
    ]
  );
  return findById(r.insertId);
}

async function update(id, vendorId, patch) {
  const allowed = ["category_id", "name", "description", "price", "image_url", "is_available"];
  const fields = [];
  const vals = [];
  for (const k of allowed) {
    if (patch[k] !== undefined) {
      fields.push(`${k} = ?`);
      vals.push(k === "is_available" ? (patch[k] ? 1 : 0) : patch[k]);
    }
  }
  if (!fields.length) return findById(id);
  vals.push(id, vendorId);
  const [res] = await pool.query(
    `UPDATE products SET ${fields.join(", ")} WHERE id = ? AND vendor_id = ?`,
    vals
  );
  if (res.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id, vendorId) {
  const [res] = await pool.query("DELETE FROM products WHERE id = ? AND vendor_id = ?", [
    id,
    vendorId
  ]);
  return res.affectedRows > 0;
}

async function belongsToVendor(productId, vendorId) {
  const [rows] = await pool.query("SELECT id FROM products WHERE id = ? AND vendor_id = ?", [
    productId,
    vendorId
  ]);
  return !!rows[0];
}

module.exports = { findById, list, createForVendor, update, remove, belongsToVendor };
