const pool = require("../db");
const vendorModel = require("../models/vendor");
const asyncHandler = require("../middlewares/asyncHandler");

const userDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [[orderStats]] = await pool.query(
    `SELECT
       COUNT(*) AS total_orders,
       SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders
     FROM orders WHERE user_id = ?`,
    [userId]
  );
  const [[spend]] = await pool.query(
    `SELECT COALESCE(SUM(total),0) AS lifetime_spend
     FROM orders WHERE user_id = ? AND status NOT IN ('cancelled')`,
    [userId]
  );
  res.json({
    success: true,
    dashboard: {
      total_orders: orderStats.total_orders,
      delivered_orders: orderStats.delivered_orders,
      lifetime_spend: Number(spend.lifetime_spend)
    }
  });
});

const vendorDashboard = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor profile not found" });
  }
  const [[orderStats]] = await pool.query(
    `SELECT
       COUNT(*) AS total_orders,
       SUM(CASE WHEN status IN ('pending','confirmed','preparing','ready_for_pickup','out_for_delivery') THEN 1 ELSE 0 END) AS open_orders
     FROM orders WHERE vendor_id = ?`,
    [vendor.id]
  );
  const [[rev]] = await pool.query(
    `SELECT COALESCE(SUM(total),0) AS revenue
     FROM orders WHERE vendor_id = ? AND status NOT IN ('cancelled','pending')`,
    [vendor.id]
  );
  const [[products]] = await pool.query(
    "SELECT COUNT(*) AS cnt FROM products WHERE vendor_id = ?",
    [vendor.id]
  );
  res.json({
    success: true,
    dashboard: {
      total_orders: orderStats.total_orders,
      open_orders: orderStats.open_orders,
      revenue: Number(rev.revenue),
      products: products.cnt,
      vendor
    }
  });
});

module.exports = { userDashboard, vendorDashboard };
