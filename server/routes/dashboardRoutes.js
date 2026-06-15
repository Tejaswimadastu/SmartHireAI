const express = require("express");

const router = express.Router();

const protect =
require("../middleware/authMiddleware");

const {
  getStats,
  getUserDashboard
} = require(
  "../controllers/dashboardController"
);

router.get(
  "/admin",
  protect,
  getStats
);

router.get(
  "/user",
  protect,
  getUserDashboard
);

module.exports = router;