const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  analyzeResume,
  analyzeUploadedResume,
  matchResumeWithJob
} = require("../controllers/aiController");

console.log("analyzeResume =", analyzeResume);
console.log("analyzeUploadedResume =", analyzeUploadedResume);
console.log("matchResumeWithJob =", matchResumeWithJob);

router.post(
  "/analyze",
  protect,
  analyzeResume
);

router.get(
  "/analyze-uploaded",
  protect,
  analyzeUploadedResume
);

router.get(
  "/match/:jobId",
  protect,
  matchResumeWithJob
);

module.exports = router;