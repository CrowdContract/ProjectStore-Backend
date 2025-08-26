const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    fileUrl: { 
      type: String, 
      required: false 
    },
    title: { 
      type: String, 
      required: true
    },
    description: { 
      type: String, 
      required: true 
    },
    githubLink: { 
      type: String, 
      required: true 
    },
    technologies: { 
      type: [String], 
      required: true 
    },
    category: {
      type: String,
      enum: [
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
      ]
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", required: true },
  },
  { timestamps: true }
);


const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

module.exports = Project;
