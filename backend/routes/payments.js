const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.post(
  "/order/:orderId/complete",
  authenticate(true),
  validate(schemas.paymentMock, "body"),
  paymentController.completeMock
);

module.exports = router;
