const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  applyJob,
  getMyApplications,
  getJobApplicants,
  getApplicants,
  updateApplicationStatus
} = require("../controllers/applicationController");

router.post(
  "/:jobId",
  protect,
  authorizeRoles("jobseeker"),
  applyJob
);

router.get(
  "/my",
  protect,
  authorizeRoles("jobseeker"),
  getMyApplications
);

router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getJobApplicants
);

router.get(
  "/applicants/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getApplicants
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

module.exports = router;