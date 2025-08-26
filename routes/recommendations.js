const express = require('express');
const router = express.Router();

// Example static projects data (replace with database later)
const projects = [
  { id: 1, title: "AI Chatbot", tags: ["AI", "Chatbot", "NLP"] },
  { id: 2, title: "Web Portfolio", tags: ["HTML", "CSS", "JavaScript"] },
  { id: 3, title: "ML Predictor", tags: ["Machine Learning", "Prediction"] },
  { id: 4, title: "E-commerce Site", tags: ["E-commerce", "Web"] }
];

// GET /recommendations/:projectId
router.get('/:projectId', (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Find projects with at least one matching tag
  const recommendations = projects.filter(p =>
    p.id !== projectId && p.tags.some(tag => project.tags.includes(tag))
  );

  res.json(recommendations);
});

module.exports = router;
