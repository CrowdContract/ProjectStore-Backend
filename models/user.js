const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 }, // In production, always hash passwords
    department: { type: String, required: true, trim: true },
    enrollmentNumber: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ["student", "admin"], default: "admin" },
    avatar: { type: String, default: "" }, // Profile picture URL (optional)
    bio: { type: String, default: "" }, // Short bio (optional)

    // 🔥 ADD THIS FIELD
    address: { type: String, default: "" }, // User address (for Settings page)

    savedprojects: [{ type: mongoose.Types.ObjectId, ref: "Projects" }], // Saved projects
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

//"enrollmentNumber": "CS123456",
  //"password":"12345678"
  