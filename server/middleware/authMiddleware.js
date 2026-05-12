// Import JWT package
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get authorization header
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json("Access denied. No token provided");
  }

  try {
    // Extract token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to request
    req.user = verified;

    // Continue to next middleware or route
    next();

  } catch (err) {
    return res.status(401).json({
  message: "Invalid token",
});
  }
};

// Middleware to check admin role
const verifyAdmin = (req, res, next) => {
  // Check if user role is admin
  if (req.user.role !== "admin") {
    return res.status(403).json("Access denied. Admins only");
  }

  next();
};

// Export middlewares
module.exports = {
  verifyToken,
  verifyAdmin,
};