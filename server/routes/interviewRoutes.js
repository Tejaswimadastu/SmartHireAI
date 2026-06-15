const express = require("express");

const router = express.Router();

const protect =
require("../middleware/authMiddleware");

const {
  generateQuestions
} = require(
  "../controllers/interviewController"
);

router.get(
  "/questions",
  protect,
  generateQuestions
);

module.exports = router;