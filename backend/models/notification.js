const pool = require("../db");

async function create(userId, { type, title, body, data }) {
  const json = data != null ? JSON.stringify(data) : null;
  const [r] = await pool.query(
    `INSERT INTO notifications (user_id, type, title, body, data_json)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, type, title, body || null, json]
  );
  return r.insertId;
}

async function createMany(userIds, payload) {
  for (const id of userIds) {
    await create(id, payload);
  }
}

async function notifyVendorOwner(vendorId, payload) {
  const [rows] = await pool.query("SELECT user_id FROM vendors WHERE id = ?", [vendorId]);
  if (!rows[0]) return;
  await create(rows[0].user_id, payload);
}

async function notifyAvailableCouriers(payload) {
  const [rows] = await pool.query(
    `SELECT dp.user_id FROM delivery_persons dp WHERE dp.is_available = 1`
  );
  await createMany(
    rows.map(r => r.user_id),
    payload
  );
}

async function notifyCustomer(customerUserId, payload) {
  await create(customerUserId, payload);
}

async function listForUser(userId, { unreadOnly } = {}) {
  let sql =
    `SELECT id, type, title, body, data_json, read_at, created_at
     FROM notifications WHERE user_id = ?`;
  const params = [userId];
  if (unreadOnly) sql += " AND read_at IS NULL";
  sql += " ORDER BY created_at DESC LIMIT 100";
  const [rows] = await pool.query(sql, params);
  return rows.map(row => {
    let data = row.data_json;
    if (data != null && typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        data = null;
      }
    }
    const { data_json, ...rest } = row;
    return { ...rest, data };
  });
}

async function unreadCount(userId) {
  const [[row]] = await pool.query(
    "SELECT COUNT(*) AS c FROM notifications WHERE user_id = ? AND read_at IS NULL",
    [userId]
  );
  return row.c;
}

async function markRead(userId, id) {
  const [res] = await pool.query(
    "UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return res.affectedRows > 0;
}

async function markAllRead(userId) {
  await pool.query(
    "UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND read_at IS NULL",
    [userId]
  );
}

module.exports = {
  create,
  notifyVendorOwner,
  notifyAvailableCouriers,
  notifyCustomer,
  listForUser,
  unreadCount,
  markRead,
  markAllRead
};
