const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided or invalid format." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(" JWT Verification Failed:", err.message);

      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Session expired. Please log in again." });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token. Access denied." });
      } else if (err.name === "NotBeforeError") {
        return res.status(403).json({ message: "Token not active yet. Please check your system clock." });
      }
      return res.status(403).json({ message: "Authentication failed." });
    }

    req.user = user; //  Extract user details
    next();
  });
};

module.exports = { authenticateToken };
