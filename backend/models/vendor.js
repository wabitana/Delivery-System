const pool = require("../db");

async function findByUserId(userId) {
  const [rows] = await pool.query("SELECT * FROM vendors WHERE user_id = ?", [userId]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM vendors WHERE id = ?", [id]);
  return rows[0] || null;
}

async function listActive() {
  const [rows] = await pool.query(
    `SELECT v.*, u.full_name AS owner_name
     FROM vendors v
     JOIN users u ON u.id = v.user_id
     WHERE v.status = 'active'
     ORDER BY v.business_name ASC`
  );
  return rows;
}

async function listAll() {
  const [rows] = await pool.query(
    `SELECT v.*, u.email AS owner_email
     FROM vendors v
     JOIN users u ON u.id = v.user_id
     ORDER BY v.created_at DESC`
  );
  return rows;
}

async function create(data) {
  const [r] = await pool.query(
    `INSERT INTO vendors (user_id, business_name, tagline, description, address, latitude, longitude, cover_image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.business_name,
      data.tagline || null,
      data.description || null,
      data.address,
      data.latitude ?? null,
      data.longitude ?? null,
      data.cover_image_url || null,
      data.status || "active"
    ]
  );
  return findById(r.insertId);
}

async function update(id, patch) {
  const fields = [];
  const vals = [];
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) {
      fields.push(`${k} = ?`);
      vals.push(v);
    }
  }
  if (!fields.length) return findById(id);
  vals.push(id);
  await pool.query(`UPDATE vendors SET ${fields.join(", ")} WHERE id = ?`, vals);
  return findById(id);
}

module.exports = { findByUserId, findById, listActive, listAll, create, update };
