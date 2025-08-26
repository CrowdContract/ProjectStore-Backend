const User = require("../models/user"); // 👈 assuming your User model is in models/User.js
const jwt = require("jsonwebtoken");

// GET /api/v1/users/getUserData
exports.getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 👈 your JWT secret
    const userId = decoded.id || req.headers.id;

    const user = await User.findById(userId).select("-password"); // Do not return password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

// PUT /api/v1/update-user-address
exports.updateUserAddress = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || req.headers.id;

    const { address } = req.body;

    await User.findByIdAndUpdate(userId, { address });

    res.status(200).json({ message: "Address updated successfully!" });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};
