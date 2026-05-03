const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const userModel = require("../models/user");
const asyncHandler = require("../middlewares/asyncHandler");

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, phone, role } = req.body;
  const existing = await userModel.findByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }
  const password_hash = await bcrypt.hash(password, 12);
  const user = await userModel.create({
    email,
    password_hash,
    full_name,
    phone,
    role: role || "customer"
  });
  const token = signToken({ id: user.id, role: user.role });
  res.status(201).json({ success: true, token, user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userRow = await userModel.findByEmail(email);
  if (!userRow) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const ok = await bcrypt.compare(password, userRow.password_hash);
  if (!ok) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const user = await userModel.findById(userRow.id);
  const token = signToken({ id: user.id, role: user.role });
  res.json({ success: true, token, user });
});

const me = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.json({ success: true, user });
});

module.exports = { register, login, me };
