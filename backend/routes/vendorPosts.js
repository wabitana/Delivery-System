const express = require("express");
const vendorPostController = require("../controllers/vendorPostController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.get("/", vendorPostController.listPublic);
router.get("/mine", authenticate(true), vendorPostController.listMine);
router.post(
  "/",
  authenticate(true),
  validate(schemas.vendorPostCreate),
  vendorPostController.create
);
router.patch(
  "/:id",
  authenticate(true),
  validate(schemas.vendorPostUpdate),
  vendorPostController.update
);
router.delete("/:id", authenticate(true), vendorPostController.remove);

module.exports = router;
