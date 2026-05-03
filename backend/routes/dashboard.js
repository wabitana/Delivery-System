const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticate(true));

router.get("/user", dashboardController.userDashboard);
router.get("/vendor", dashboardController.vendorDashboard);

module.exports = router;
