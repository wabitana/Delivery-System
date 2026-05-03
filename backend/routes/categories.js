const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.get("/", categoryController.list);
router.post(
  "/",
  authenticate(true),
  validate(schemas.categoryCreate),
  categoryController.create
);

module.exports = router;
