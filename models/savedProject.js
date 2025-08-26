const mongoose = require("mongoose");

const SavedProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", 
    required: true,
  },
  githubLink: {
    type: String,
    required: false, 
    validate: {
      validator: function (v) {
        return /^https:\/\/github\.com\/[\w-]+\/[\w-]+/.test(v);
      },
      message: "Invalid GitHub URL format!",
    },
  },
  projectFile: {
    type: String, 
    required: false,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SavedProject", SavedProjectSchema);
