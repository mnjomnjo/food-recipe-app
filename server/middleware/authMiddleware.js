// Import JWT
const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json("Access denied. No token provided");
  }

  try {
    // Extract token (Bearer TOKEN)
    const token = authHeader.split(" ")[1];

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = verified;

    next(); // move to next function
  } catch (err) {
    res.status(400).json("Invalid token");
  }
};

module.exports = verifyToken;