const express = require("express");
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticate(true));

router.get("/unread-count", notificationController.unread);
router.patch("/read-all", notificationController.markReadAll);
router.patch("/:id/read", notificationController.markReadOne);
router.get("/", notificationController.list);

module.exports = router;
