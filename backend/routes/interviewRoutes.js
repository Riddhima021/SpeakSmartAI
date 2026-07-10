const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    startInterview,
    evaluateInterviewAnswer,
    getUserInterviews,
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

module.exports = router;