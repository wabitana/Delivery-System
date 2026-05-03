const pool = require("../db");

async function list() {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  return rows;
}

async function create({ name, slug }) {
  const [r] = await pool.query(
    "INSERT INTO categories (name, slug) VALUES (?, ?)",
    [name, slug]
  );
  const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [r.insertId]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
  return rows[0] || null;
}

module.exports = { list, create, findById };
