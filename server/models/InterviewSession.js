const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    candidateName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Completed", "Terminated"],
      default: "Completed"
    },
    questions: [
      {
        questionText: { type: String, required: true },
        transcribedAnswer: { type: String, default: "" },
        score: { type: Number, default: 0 },
        feedback: { type: String, default: "" },
        modelAnswer: { type: String, default: "" }
      }
    ],
    violations: [
      {
        violationType: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        screenshot: { type: String, default: "" } // Base64 dataURL
      }
    ],
    overallScore: {
      type: Number,
      default: 0
    },
    suspicionScore: {
      type: Number,
      default: 0
    },
    proctorFeedback: {
      type: String,
      default: ""
    },
    hiringRecommendation: {
      type: String,
      enum: ["Strong Hire", "Hire", "Maybe", "Reject"],
      default: "Maybe"
    },
    durationSeconds: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
