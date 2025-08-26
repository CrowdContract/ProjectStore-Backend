const express = require("express");
const router = express.Router();
const SavedProject = require("../models/savedProject");
const { authenticateToken } = require("../middlewares/authMiddleware");

//  Save a project
router.put("/save-project", authenticateToken, async (req, res) => {
    try {
        const { projectId, githubLink, projectFile } = req.body;
        const userId = req.user.id;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        // Check if project is already saved
        const existing = await SavedProject.findOne({ user: userId, project: projectId });
        if (existing) {
            return res.status(200).json({ message: "Project is already saved" });
        }

        // Save the project
        const savedProject = new SavedProject({ user: userId, project: projectId, githubLink, projectFile });
        await savedProject.save();

        res.status(201).json({ message: "Project saved successfully", savedProject });
    } catch (error) {
        console.error("Error saving project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/saved-projects", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const savedProjects = await SavedProject.find({ user: userId }).populate("project");
        res.status(200).json({ savedProjects });
    } catch (error) {
        console.error("Error fetching saved projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/remove-saved-project/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await SavedProject.findOneAndDelete({ _id: id, user: userId });

        if (!deleted) {
            return res.status(404).json({ message: "Project not found in saved list" });
        }

        res.status(200).json({ message: "Project removed successfully" });
    } catch (error) {
        console.error("Error removing project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;

