const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.use(authenticate(true));

router.get("/open-orders", deliveryController.listOpenOrders);
router.get("/profile", deliveryController.profileGet);
router.patch(
  "/profile",
  validate(schemas.deliveryProfile),
  deliveryController.profilePatch
);
router.post(
  "/orders/:orderId/tracking",
  validate(schemas.trackingCreate),
  deliveryController.addTracking
);
router.get("/orders/:orderId/tracking", deliveryController.trackingList);
router.post("/orders/:orderId/claim", deliveryController.claimOrder);

module.exports = router;
