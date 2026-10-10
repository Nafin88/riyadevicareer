const multer = require("multer");

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || "Internal server error";
  if (err instanceof multer.MulterError) status = 400;
  if (err.name === "ValidationError") status = 422; // mongoose
  if (status >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") message = "Internal server error";
  }
  res.status(status).json({ success: false, message, errors: err.details });
}

module.exports = { notFound, errorHandler };
