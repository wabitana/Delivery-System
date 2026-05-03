const notificationModel = require("../models/notification");
const asyncHandler = require("../middlewares/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const unreadOnly = req.query.unread === "1";
  const rows = await notificationModel.listForUser(req.user.id, { unreadOnly });
  res.json({ success: true, notifications: rows });
});

const unread = asyncHandler(async (req, res) => {
  const count = await notificationModel.unreadCount(req.user.id);
  res.json({ success: true, count });
});

const markReadOne = asyncHandler(async (req, res) => {
  const ok = await notificationModel.markRead(req.user.id, Number(req.params.id));
  if (!ok) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true });
});

const markReadAll = asyncHandler(async (req, res) => {
  await notificationModel.markAllRead(req.user.id);
  res.json({ success: true });
});

module.exports = { list, unread, markReadOne, markReadAll };
