const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/project");
const { authenticateToken } = require("../middlewares/authMiddleware");


router.post("/add-project", authenticateToken, async (req, res) => {
  try {
    const { title, description, githubLink, technologies, category, fileUrl } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!title || !description || !githubLink || !technologies || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(technologies) || technologies.length === 0) {
      return res.status(400).json({ message: "Technologies must be a non-empty array" });
    }

    const allowedCategories = [
      "Web Development",
      "Mobile App Development",
      "Machine Learning",
      "Artificial Intelligence",
      "Cybersecurity",
      "Data Science",
      "Embedded Systems",
      "Blockchain",
      "Game Development",
      "Other"
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category provided" });
    }

    if (!/^https?:\/\/github\.com\/.+/.test(githubLink)) {
      return res.status(400).json({ message: "Invalid GitHub link format" });
    }

    const techArray = technologies.map((tech) => tech.trim());

    const newProject = new Project({
      title: title.trim(),
      description: description.trim(),
      githubLink: githubLink.trim(),
      technologies: techArray,
      category: category.trim(),
      fileUrl: fileUrl || "",  
      createdBy: req.user.id,
    });

    await newProject.save();
    res.status(201).json({ message: " Project added successfully", project: newProject });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// UPDATE PROJECT
router.put("/update-project/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, githubLink, technologies, category, fileUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: " Invalid project ID" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: " Project not found" });
    }

    if (!title || !description || !githubLink || !technologies || !category) {
      return res.status(400).json({ message: " All fields are required" });
    }

    if (!Array.isArray(technologies) || technologies.length === 0) {
      return res.status(400).json({ message: "Technologies must be a non-empty array" });
    }

    const allowedCategories = [
      "Web Development",
      "Mobile App Development",
      "Machine Learning",
      "Artificial Intelligence",
      "Cybersecurity",
      "Data Science",
      "Embedded Systems",
      "Blockchain",
      "Game Development",
      "Other",
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: " Invalid category provided" });
    }

    if (!/^https?:\/\/github\.com\/.+/.test(githubLink)) {
      return res.status(400).json({ message: " Invalid GitHub link format" });
    }

    const updatedFields = {
      title: title.trim(),
      description: description.trim(),
      githubLink: githubLink.trim(),
      technologies: technologies.map((tech) => tech.trim()),
      category: category.trim(),
      fileUrl: fileUrl ? fileUrl.trim() : project.fileUrl, // if new fileUrl not provided, keep old one
    };

    const updatedProject = await Project.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    console.log(" Project updated successfully:", updatedProject);
    res.status(200).json({ message: "Project updated successfully!", project: updatedProject });

  } catch (error) {
    console.error("Error updating project:", error.message || error);
    res.status(500).json({ message: error.message || "An error occurred while updating the project" });
  }
});




router.delete("/delete-project/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

   
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You cannot delete this project" });
    }

    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "An error occurred while deleting the project" });
  }
});


router.get("/get-all-projects", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json({ status: "success", data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/get-recent-projects", async (_req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 }) 
      .limit(4) 
      .select("title description technologies fileUrl createdAt"); 

    if (!projects.length) {
      return res.status(404).json({ status: "error", message: "No recent projects found" });
    }

    return res.json({ status: "success", data: projects });
  } catch (error) {
    console.error("Error fetching recent projects:", error);
    return res.status(500).json({ status: "error", message: "An error occurred while fetching projects" });
  }
});



router.get('/get-project-by-id/:id', async (req, res) => {
  try {
      let { id } = req.params;
      id = id.trim(); 

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid project ID format' });
      }

      const project = await Project.findById(id);

      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }

      return res.json({
          status: 'success',
          data: project
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred' });
  }
});





module.exports = router;

