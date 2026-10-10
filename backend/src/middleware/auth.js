const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/helpers");

function signToken(email) {
  return jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" });
}

function requireAdmin(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, "Authentication required"));
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = { signToken, requireAdmin };
