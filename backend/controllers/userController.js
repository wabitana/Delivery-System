const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const asyncHandler = require("../middlewares/asyncHandler");

const patchProfile = asyncHandler(async (req, res) => {
  const { full_name, phone, avatar_url, current_password, new_password } = req.body;

  if (new_password) {
    if (!current_password) {
      return res.status(400).json({ success: false, message: "Current password is required to set a new password" });
    }
    const row = await userModel.findWithHash(req.user.id);
    const ok = await bcrypt.compare(current_password, row.password_hash);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    const password_hash = await bcrypt.hash(new_password, 12);
    await userModel.updatePassword(req.user.id, password_hash);
  }

  if (full_name !== undefined || phone !== undefined || avatar_url !== undefined) {
    await userModel.updateProfile(req.user.id, {
      ...(full_name !== undefined ? { full_name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(avatar_url !== undefined ? { avatar_url } : {})
    });
  }

  const user = await userModel.findById(req.user.id);
  res.json({ success: true, user });
});

module.exports = { patchProfile };
