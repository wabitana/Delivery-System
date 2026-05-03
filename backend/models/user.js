const pool = require("../db");

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = ?",
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

module.exports = { findByEmail, findById, create };
