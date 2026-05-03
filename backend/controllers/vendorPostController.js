const vendorModel = require("../models/vendor");
const vendorPostModel = require("../models/vendorPost");
const asyncHandler = require("../middlewares/asyncHandler");

const listPublic = asyncHandler(async (req, res) => {
  const posts = await vendorPostModel.listPublic();
  res.json({ success: true, posts });
});

const listMine = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
  const posts = await vendorPostModel.listForVendor(vendor.id);
  res.json({ success: true, posts });
});

const create = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor) return res.status(403).json({ success: false, message: "Vendor profile required" });
  const post = await vendorPostModel.create(vendor.id, req.body);
  res.status(201).json({ success: true, post });
});

const update = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor) return res.status(403).json({ success: false, message: "Vendor profile required" });
  const updated = await vendorPostModel.update(Number(req.params.id), vendor.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: "Post not found" });
  res.json({ success: true, post: updated });
});

const remove = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.id);
  if (!vendor) return res.status(403).json({ success: false, message: "Vendor profile required" });
  const ok = await vendorPostModel.remove(Number(req.params.id), vendor.id);
  if (!ok) return res.status(404).json({ success: false, message: "Post not found" });
  res.json({ success: true, message: "Deleted" });
});

module.exports = { listPublic, listMine, create, update, remove };
