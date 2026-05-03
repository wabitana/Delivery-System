function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(status).json({
    success: false,
    message,
    ...(err.details && { details: err.details })
  });
}

function notFound(req, res, next) {
  res.status(404).json({ success: false, message: "Route not found" });
}

module.exports = { errorHandler, notFound };
