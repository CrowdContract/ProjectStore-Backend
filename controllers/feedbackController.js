// controllers/feedbackController.js

const Feedback = require('../models/Feedback');

// Add new feedback
const addFeedback = async (req, res) => {
  try {
    const { projectId, comment, userId } = req.body; // 👈 getting userId from headers

    if (!projectId || !comment || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const feedback = new Feedback({
      projectId,
      comment,
      userId,
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback added successfully', feedback });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Server error while adding feedback' });
  }
};

// Get feedbacks for a project
const getFeedbacks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const feedbacks = await Feedback.find({ projectId })
      .populate('userId', 'name') // Only populate the name from user
      .sort({ createdAt: -1 });   // Latest feedback first

    res.status(200).json({ data: feedbacks });
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    res.status(500).json({ message: 'Server error while fetching feedbacks' });
  }
};

module.exports = { addFeedback, getFeedbacks };

