// Import JWT package
const jwt = require("jsonwebtoken");


// ================= VERIFY TOKEN =================
const verifyToken = (req, res, next) => {

  // Get authorization header
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }

  try {

    // Extract token from Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // Verify token
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach decoded user data to request
    req.user = verified;

    // Continue to next middleware
    next();

  } catch (err) {

    // Handle expired token
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // Handle invalid token
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};


// ================= VERIFY ADMIN =================
const verifyAdmin = (req, res, next) => {

  // Check if user role is admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only",
    });
  }

  // Continue to next middleware
  next();
};


// Export middlewares
module.exports = {
  verifyToken,
  verifyAdmin,
};