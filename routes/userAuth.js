const jwt = require("jsonwebtoken");
require("dotenv").config(); 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid format" });
    }

    const token = authHeader.split(" ")[1];

    //  JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
        console.error(" JWT_SECRET is missing in environment variables");
        return res.status(500).json({ message: "Internal server error. Please contact support." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(" JWT Verification Error:", err.message);
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({ message: "Token expired. Please sign in again." });
            }
            return res.status(403).json({ message: "Invalid token. Access denied." });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };


