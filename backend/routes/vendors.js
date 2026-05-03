const express = require("express");
const vendorController = require("../controllers/vendorController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.get("/", vendorController.list);
router.get("/mine", authenticate(true), vendorController.mine);
router.get("/:id", vendorController.getOne);
router.post("/", authenticate(true), validate(schemas.vendorCreate), vendorController.create);
router.patch(
  "/:id",
  authenticate(true),
  validate(schemas.vendorUpdate),
  vendorController.update
);

module.exports = router;
