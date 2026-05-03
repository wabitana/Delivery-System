const categoryModel = require("../models/category");
const asyncHandler = require("../middlewares/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const categories = await categoryModel.list();
  res.json({ success: true, categories });
});

const create = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  try {
    const cat = await categoryModel.create(req.body);
    res.status(201).json({ success: true, category: cat });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Slug already exists" });
    }
    throw e;
  }
});

module.exports = { list, create };
