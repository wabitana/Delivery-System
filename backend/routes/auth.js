const express = require("express");
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.post("/register", validate(schemas.register), authController.register);
router.post("/login", validate(schemas.login), authController.login);
router.get("/me", authenticate(true), authController.me);

module.exports = router;
