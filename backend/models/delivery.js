const pool = require("../db");

async function findPersonByUserId(userId) {
  const [rows] = await pool.query("SELECT * FROM delivery_persons WHERE user_id = ?", [userId]);
  return rows[0] || null;
}

async function ensurePerson(userId) {
  let p = await findPersonByUserId(userId);
  if (!p) {
    const [r] = await pool.query(
      "INSERT INTO delivery_persons (user_id, is_available) VALUES (?, 1)",
      [userId]
    );
    const [rows] = await pool.query("SELECT * FROM delivery_persons WHERE id = ?", [r.insertId]);
    p = rows[0];
  }
  return p;
}

async function updatePerson(userId, patch) {
  const allowed = ["vehicle_type", "license_plate", "is_available", "current_latitude", "current_longitude"];
  const fields = [];
  const vals = [];
  for (const k of allowed) {
    if (patch[k] !== undefined) {
      fields.push(`${k} = ?`);
      vals.push(patch[k]);
    }
  }
  if (!fields.length) return findPersonByUserId(userId);
  vals.push(userId);
  await pool.query(
    `UPDATE delivery_persons SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
    vals
  );
  return findPersonByUserId(userId);
}

async function addTracking(orderId, deliveryPersonId, { status_note, latitude, longitude }) {
  const [r] = await pool.query(
    `INSERT INTO delivery_tracking (order_id, delivery_person_id, status_note, latitude, longitude)
     VALUES (?, ?, ?, ?, ?)`,
    [orderId, deliveryPersonId || null, status_note, latitude ?? null, longitude ?? null]
  );
  const [rows] = await pool.query("SELECT * FROM delivery_tracking WHERE id = ?", [r.insertId]);
  return rows[0];
}

async function listTracking(orderId) {
  const [rows] = await pool.query(
    `SELECT dt.*, dp.user_id AS delivery_user_id
     FROM delivery_tracking dt
     LEFT JOIN delivery_persons dp ON dp.id = dt.delivery_person_id
     WHERE dt.order_id = ?
     ORDER BY dt.created_at ASC`,
    [orderId]
  );
  return rows;
}

module.exports = { findPersonByUserId, ensurePerson, updatePerson, addTracking, listTracking };
