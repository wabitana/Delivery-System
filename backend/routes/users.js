const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const schemas = require("../validators/schemas");

const router = express.Router();

router.patch("/me", authenticate(true), validate(schemas.profilePatch), userController.patchProfile);

module.exports = router;
