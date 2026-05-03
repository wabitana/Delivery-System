const express = require("express");
const productController = require("../controllers/productController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.get("/", productController.list);
router.get("/:id", productController.getOne);
router.post("/", authenticate(true), validate(schemas.productCreate), productController.create);
router.patch(
  "/:id",
  authenticate(true),
  validate(schemas.productUpdate),
  productController.update
);
router.delete("/:id", authenticate(true), productController.remove);

module.exports = router;
