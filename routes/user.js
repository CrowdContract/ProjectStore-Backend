const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "Projecthub123"; // Make sure this is secure in production

// * Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, department, enrollmentNumber, role } = req.body;

    if (!name || !email || !password || !department || !enrollmentNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let existingUser = await User.findOne({ enrollmentNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password, // In production, hash the password
      department,
      enrollmentNumber,
      role: role || "user"
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error in sign-up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// * Sign-in Route
router.post("/sign-in", async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    if (!enrollmentNumber || !password) {
      return res.status(400).json({ message: "Enrollment number and password are required" });
    }

    const existingUser = await User.findOne({ enrollmentNumber });
    if (!existingUser || existingUser.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingUser._id, name: existingUser.name, role: existingUser.role },
      JWT_SECRET,
      { expiresIn: "40d" }
    );

    return res.status(200).json({
      message: "Signin success",
      id: existingUser._id,
      role: existingUser.role,
      token,
    });
  } catch (error) {
    console.error("Error in sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✨ ADD THIS: Get current logged in User Data (Settings page GET)
router.get("/getUserData", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || req.headers.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✨ ADD THIS: Update User Address (Settings page PUT)
router.put("/update-user-address", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || req.headers.id;

    const { address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.address = address;
    await user.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// (Already Present) Get User by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// (Already Present) Update User
router.put("/user/:id", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.department = department || user.department;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// (Already Present) Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
