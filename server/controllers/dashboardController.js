const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Admin Dashboard
const getStats = async (req, res) => {
  try {

    const totalUsers =
      await User.countDocuments();

    const totalJobs =
      await Job.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const acceptedApplications =
      await Application.countDocuments({
        status: "Accepted"
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "Rejected"
      });

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      acceptedApplications,
      rejectedApplications
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// User Dashboard
const getUserDashboard = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.user.id
      );

    const applications =
      await Application.countDocuments({
        applicant: req.user.id
      });

    const shortlisted =
      await Application.countDocuments({
        applicant: req.user.id,
        status: "Shortlisted"
      });

    res.json({
      name: user.name,
      resumeScore:
        user.resumeScore || 0,

      atsScore:
        user.atsScore || 0,

      applications,

      interviews:
        shortlisted
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getStats,
  getUserDashboard
};