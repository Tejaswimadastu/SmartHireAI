const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

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

    const user = await User.findById(req.user.id);
    const job = await Job.findById(req.params.jobId);
    let computedAts = 0;

    if (user && user.resume && job) {
      try {
        const pdfPath = path.join(__dirname, "..", "uploads", user.resume);
        if (fs.existsSync(pdfPath)) {
          const pdfBuffer = fs.readFileSync(pdfPath);
          const pdfData = await pdfParse(pdfBuffer);
          const resumeText = pdfData.text.toLowerCase();

          const jobSkills = (job.skills || []).map(s => s.toLowerCase().trim());
          if (jobSkills.length > 0) {
            let matched = 0;
            jobSkills.forEach(skill => {
              if (resumeText.includes(skill)) {
                matched++;
              }
            });
            computedAts = Math.round((matched / jobSkills.length) * 100);
          } else {
            computedAts = 50; // default if no specific job skills are requested
          }
        }
      } catch (err) {
        console.error("Failed to parse resume for application ATS score:", err);
      }
    }

    const application =
      await Application.create({
        job: req.params.jobId,
        applicant: req.user.id,
        status: "Applied",
        atsScore: computedAts
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