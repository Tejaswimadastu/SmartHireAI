const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    company: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    skills: [
      {
        type: String
      }
    ],

    location: {
      type: String,
      default: ""
    },

    experience: {
      type: Number,
      default: 0
    },

    salary: {
      type: String,
      default: ""
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Job",
  jobSchema
);