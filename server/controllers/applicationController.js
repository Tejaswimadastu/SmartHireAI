const Application = require("../models/Application");

// Apply Job
const applyJob = async (req, res) => {
  try {
    const alreadyApplied =
      await Application.findOne({
        job: req.params.jobId,
        applicant: req.user.id
      });

    if (alreadyApplied) {
      return res.status(400).json({
        message:
          "You already applied for this job"
      });
    }

    const application =
      await Application.create({
        job: req.params.jobId,
        applicant: req.user.id,
        status: "Applied"
      });

    res.status(201).json(application);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// My Applications
const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user.id
      }).populate("job");

    res.json(applications);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Recruiter Job Applicants
const getJobApplicants = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        job: req.params.jobId
      }).populate(
        "applicant",
        "name email role"
      );

    res.json(applications);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ATS Ranking
const getApplicants = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        job: req.params.jobId
      })
        .populate(
          "applicant",
          "name email role"
        )
        .sort({
          atsScore: -1
        });

    res.json(applications);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update Status
const updateApplicationStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          message:
            "Status is required"
        });
      }

      const application =
        await Application.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );

      if (!application) {
        return res.status(404).json({
          message:
            "Application not found"
        });
      }

      res.json(application);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplicants,
  getApplicants,
  updateApplicationStatus
};