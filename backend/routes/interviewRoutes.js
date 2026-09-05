const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    startInterview,
    evaluateInterviewAnswer,
    getUserInterviews,
    getInterviewResult,
    getDashboardStats,
} = require("../controllers/interviewController");

router.post(
    "/start",
    authMiddleware,
    startInterview
);

router.post(
  "/evaluate",
  authMiddleware,
  evaluateInterviewAnswer
);

router.get(
    "/my-interviews",
    authMiddleware,
    getUserInterviews
);

router.get(
  "/result/:id",
  authMiddleware,
  getInterviewResult
);

router.get(
  "/dashboard-stats",
  authMiddleware,
  getDashboardStats
);

module.exports = router;