// Import JWT
const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json("Access denied. No token provided");
  }

  try {
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (err) {
    res.status(400).json("Invalid token");
  }
};

// Middleware to verify admin user
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only",
    });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
};