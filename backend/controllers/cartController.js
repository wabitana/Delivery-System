const cartModel = require("../models/cart");
const productModel = require("../models/product");
const asyncHandler = require("../middlewares/asyncHandler");

function summarize(rows) {
  let subtotal = 0;
  const vendorIds = new Set();
  for (const row of rows) {
    subtotal += Number(row.price) * row.quantity;
    vendorIds.add(row.vendor_id);
  }
  return {
    items: rows,
    subtotal: Math.round(subtotal * 100) / 100,
    vendor_count: vendorIds.size,
    single_vendor_id: vendorIds.size === 1 ? [...vendorIds][0] : null
  };
}

const getCart = asyncHandler(async (req, res) => {
  const rows = await cartModel.getCartWithProducts(req.user.id);
  res.json({ success: true, ...summarize(rows) });
});

const addOrUpdate = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;
  const product = await productModel.findById(product_id);
  if (!product || !product.is_available || product.vendor_status !== "active") {
    return res.status(400).json({ success: false, message: "Product unavailable" });
  }
  const existing = await cartModel.getCartWithProducts(req.user.id);
  if (existing.length) {
    const currentVendor = existing[0].vendor_id;
    if (product.vendor_id !== currentVendor) {
      return res.status(400).json({
        success: false,
        message: "Cart contains items from another restaurant. Clear cart or checkout first."
      });
    }
  }
  await cartModel.upsertItem(req.user.id, product_id, quantity);
  const rows = await cartModel.getCartWithProducts(req.user.id);
  res.json({ success: true, ...summarize(rows) });
});

const patchQty = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  const { quantity } = req.body;
  const ok = await cartModel.updateQuantity(req.user.id, productId, quantity);
  if (!ok) return res.status(404).json({ success: false, message: "Cart line not found" });
  const rows = await cartModel.getCartWithProducts(req.user.id);
  res.json({ success: true, ...summarize(rows) });
});

const removeLine = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  await cartModel.removeItem(req.user.id, productId);
  const rows = await cartModel.getCartWithProducts(req.user.id);
  res.json({ success: true, ...summarize(rows) });
});

const clear = asyncHandler(async (req, res) => {
  await cartModel.clear(req.user.id);
  res.json({ success: true, items: [], subtotal: 0, vendor_count: 0, single_vendor_id: null });
});

module.exports = { getCart, addOrUpdate, patchQty, removeLine, clear };
