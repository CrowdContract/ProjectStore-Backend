const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Setup
app.use(cors({
  origin: "http://localhost:5173",  // 👈 allow your React frontend to talk to backend
  credentials: true,                // 👈 allow cookies/auth headers (optional, but good practice)
}));

// Import routes
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/Project");
const savedProjectRoutes = require("./routes/savedproject");
const favouriteRoutes = require("./routes/favouriteRoutes");
const recommendationRoutes = require("./routes/recommendations");
const feedbackRoutes = require("./routes/feedbackRoutes");
//const settingsRoutes= require("./routes/")

// Use routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);  // project-related routes
app.use("/api/v1/saved", savedProjectRoutes);
app.use("/api/v1", favouriteRoutes);         // 👈 your add-favourite POST is inside this
app.use("/recommendation", recommendationRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
