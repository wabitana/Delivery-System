const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.use(authenticate(true));

router.post("/checkout", validate(schemas.checkout), orderController.checkout);
router.get("/", orderController.listMine);
router.get("/:id", orderController.getOne);
router.patch(
  "/:id/status",
  validate(schemas.orderStatusUpdate),
  orderController.updateStatus
);
router.post("/:id/simulate-step", orderController.simulateStep);

module.exports = router;
