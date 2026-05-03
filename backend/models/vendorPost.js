const pool = require("../db");

async function listPublic() {
  const [rows] = await pool.query(
    `SELECT vp.*, v.business_name, v.address AS vendor_address, v.latitude AS vendor_latitude,
            v.longitude AS vendor_longitude, v.cover_image_url, v.tagline
     FROM vendor_posts vp
     JOIN vendors v ON v.id = vp.vendor_id
     WHERE vp.is_active = 1 AND v.status = 'active'
     ORDER BY vp.created_at DESC`
  );
  return rows;
}

async function listForVendor(vendorId) {
  const [rows] = await pool.query(
    "SELECT * FROM vendor_posts WHERE vendor_id = ? ORDER BY created_at DESC",
    [vendorId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM vendor_posts WHERE id = ?", [id]);
  return rows[0] || null;
}

async function create(vendorId, data) {
  const [r] = await pool.query(
    `INSERT INTO vendor_posts (vendor_id, title, body, image_url, latitude, longitude, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      vendorId,
      data.title,
      data.body || null,
      data.image_url || null,
      data.latitude ?? null,
      data.longitude ?? null,
      data.is_active !== false ? 1 : 0
    ]
  );
  return findById(r.insertId);
}

async function update(id, vendorId, patch) {
  const allowed = ["title", "body", "image_url", "latitude", "longitude", "is_active"];
  const fields = [];
  const vals = [];
  for (const k of allowed) {
    if (patch[k] !== undefined) {
      fields.push(`${k} = ?`);
      vals.push(k === "is_active" ? (patch[k] ? 1 : 0) : patch[k]);
    }
  }
  if (!fields.length) return findById(id);
  vals.push(id, vendorId);
  const [res] = await pool.query(
    `UPDATE vendor_posts SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND vendor_id = ?`,
    vals
  );
  return res.affectedRows ? findById(id) : null;
}

async function remove(id, vendorId) {
  const [res] = await pool.query("DELETE FROM vendor_posts WHERE id = ? AND vendor_id = ?", [id, vendorId]);
  return res.affectedRows > 0;
}

module.exports = { listPublic, listForVendor, findById, create, update, remove };
