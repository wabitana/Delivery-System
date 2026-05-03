const productModel = require("../models/product");
const vendorModel = require("../models/vendor");
const categoryModel = require("../models/category");
const asyncHandler = require("../middlewares/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const products = await productModel.list({
    vendor_id: req.query.vendor_id ? Number(req.query.vendor_id) : undefined,
    category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
    q: req.query.q,
    available_only: req.query.include_unavailable !== "1"
  });
  res.json({ success: true, products });
});

const getOne = asyncHandler(async (req, res) => {
  const p = await productModel.findById(Number(req.params.id));
  if (!p) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product: p });
});

const create = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor || vendor.status !== "active") {
    return res.status(403).json({ success: false, message: "Active vendor profile required" });
  }
  if (req.body.category_id) {
    const c = await categoryModel.findById(req.body.category_id);
    if (!c) return res.status(400).json({ success: false, message: "Invalid category" });
  }
  const product = await productModel.createForVendor(vendor.id, req.body);
  res.status(201).json({ success: true, product });
});

const update = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor) {
    return res.status(403).json({ success: false, message: "Vendor profile required" });
  }
  if (req.body.category_id) {
    const c = await categoryModel.findById(req.body.category_id);
    if (!c) return res.status(400).json({ success: false, message: "Invalid category" });
  }
  const updated = await productModel.update(Number(req.params.id), vendor.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product: updated });
});

const remove = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor) {
    return res.status(403).json({ success: false, message: "Vendor profile required" });
  }
  const ok = await productModel.remove(Number(req.params.id), vendor.id);
  if (!ok) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, message: "Deleted" });
});

module.exports = { list, getOne, create, update, remove };
