const vendorModel = require("../models/vendor");
const asyncHandler = require("../middlewares/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const vendors = await vendorModel.listActive();
  res.json({ success: true, vendors });
});

const mine = asyncHandler(async (req, res) => {
  const v = await vendorModel.findByUserId(req.user.id);
  res.json({ success: true, vendor: v });
});

const create = asyncHandler(async (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ success: false, message: "Vendor role required" });
  }
  const existing = await vendorModel.findByUserId(req.user.id);
  if (existing) {
    return res.status(409).json({ success: false, message: "Vendor profile already exists" });
  }
  const body = req.body;
  const vendor = await vendorModel.create({
    user_id: req.user.id,
    business_name: body.business_name,
    description: body.description,
    address: body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    status: "active"
  });
  res.status(201).json({ success: true, vendor });
});

const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const v = await vendorModel.findById(id);
  if (!v) return res.status(404).json({ success: false, message: "Vendor not found" });
  const owner = await vendorModel.findByUserId(req.user.id);
  const isOwner = owner && owner.id === id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const patch = { ...req.body };
  if (!isAdmin) delete patch.status;
  const updated = await vendorModel.update(id, patch);
  res.json({ success: true, vendor: updated });
});

const getOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const v = await vendorModel.findById(id);
  if (!v) return res.status(404).json({ success: false, message: "Vendor not found" });
  res.json({ success: true, vendor: v });
});

module.exports = { list, mine, create, update, getOne };
