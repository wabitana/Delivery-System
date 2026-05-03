const jwt = require("jsonwebtoken");
const config = require("../config");

function extractToken(req) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return null;
  return h.slice(7);
}

function authenticate(required = true) {
  return (req, res, next) => {
    try {
      const token = extractToken(req);
      if (!token) {
        if (required) {
          return res.status(401).json({ success: false, message: "Authentication required" });
        }
        req.user = null;
        return next();
      }
      const payload = jwt.verify(token, config.jwt.secret);
      req.user = { id: payload.sub, role: payload.role };
      next();
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
}

module.exports = { authenticate, requireRoles, extractToken };
