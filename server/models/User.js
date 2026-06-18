const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: function() {
        return !this.isGoogleUser;
      }
    },

    isGoogleUser: {
      type: Boolean,
      default: false
    },

    role: {
      type: String,
      enum: [
        "jobseeker",
        "recruiter",
        "admin"
      ],
      default: "jobseeker"
    },

    resume: {
      type: String,
      default: ""
    },

    resumeScore: {
      type: Number,
      default: 0
    },

    atsScore: {
      type: Number,
      default: 0
    },

    skills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);