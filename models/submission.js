const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the student who submitted the project
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Refers to the submitted project
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending Review", "Approved", "Rejected"],
      default: "Pending Review",
    },
    feedback: {
      type: String, // Professors can leave feedback on the submission
      trim: true,   // Removes unnecessary spaces
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Ensures submittedAt doesn't change after creation
    },
  },
  { timestamps: true }
);


const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

module.exports = Submission;

