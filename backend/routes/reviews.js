const express = require("express");
const reviewController = require("../controllers/reviewController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.get("/vendor/:vendorId", reviewController.byVendor);
router.post(
  "/",
  authenticate(true),
  validate(schemas.reviewCreate),
  reviewController.create
);

module.exports = router;
