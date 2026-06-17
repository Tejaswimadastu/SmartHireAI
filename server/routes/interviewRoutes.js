const express = require("express");

const router = express.Router();

const protect =
require("../middleware/authMiddleware");

const {
  generateQuestions,
  evaluateAnswer,
  saveInterviewSession,
  getInterviewHistory,
  getCandidateSession,
  getAllSessions
} = require(
  "../controllers/interviewController"
);

router.get(
  "/questions",
  protect,
  generateQuestions
);

router.post(
  "/evaluate",
  protect,
  evaluateAnswer
);

router.post(
  "/session",
  protect,
  saveInterviewSession
);

router.get(
  "/session/history",
  protect,
  getInterviewHistory
);

router.get(
  "/session/candidate/:candidateId",
  protect,
  getCandidateSession
);

router.get(
  "/session/all",
  protect,
  getAllSessions
);

module.exports = router;