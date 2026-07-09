const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    startInterview,
    evaluateInterviewAnswer,
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

module.exports = router;