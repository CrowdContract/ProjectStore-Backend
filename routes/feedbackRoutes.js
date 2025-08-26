// routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const { addFeedback, getFeedbacks } = require('../controllers/feedbackController');

// POST: Add feedback
router.post('/add-feedback', addFeedback);

// GET: Get all feedbacks for a project
router.get('/get-feedbacks/:projectId', getFeedbacks);

module.exports = router;

