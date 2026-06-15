const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

router.get("/", getJobs);

router.get(
  "/myjobs",
  protect,
  authorizeRoles("recruiter"),
  getMyJobs
);

router.get("/:id", getJobById);

router.post(
  "/",
  protect,
  authorizeRoles("recruiter"),
  createJob
);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  deleteJob
);

module.exports = router;