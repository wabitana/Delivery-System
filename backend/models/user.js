const pool = require("../db");

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function findWithHash(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, email, full_name, phone, avatar_url, role, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function create({ email, password_hash, full_name, phone, role }) {
  const [r] = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, phone, role)
     VALUES (?, ?, ?, ?, ?)`,
    [email, password_hash, full_name, phone || null, role]
  );
  return findById(r.insertId);
}

async function updateProfile(id, patch) {
  const allowed = ["full_name", "phone", "avatar_url"];
  const fields = [];
  const vals = [];
  for (const k of allowed) {
    if (patch[k] !== undefined) {
      fields.push(`${k} = ?`);
      vals.push(patch[k]);
    }
  }
  if (!fields.length) return findById(id);
  vals.push(id);
  await pool.query(`UPDATE users SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, vals);
  return findById(id);
}

async function updatePassword(id, password_hash) {
  await pool.query(
    "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [password_hash, id]
  );
}

module.exports = { findByEmail, findWithHash, findById, create, updateProfile, updatePassword };
