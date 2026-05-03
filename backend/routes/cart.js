const express = require("express");
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.use(authenticate(true));

router.get("/", cartController.getCart);
router.post("/", validate(schemas.cartItem), cartController.addOrUpdate);
router.patch(
  "/items/:productId",
  validate(schemas.cartItemQty),
  cartController.patchQty
);
router.delete("/items/:productId", cartController.removeLine);
router.delete("/", cartController.clear);

module.exports = router;
