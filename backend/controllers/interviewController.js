const Interview = require("../models/Interview");

const {
  generateInterviewQuestions,
  evaluateAnswer,
} = require("../services/aiService");

const startInterview = async (req, res) => {
  try {
    const { company, role, type, difficulty } = req.body;

    // Generate AI Questions
    const questions = await generateInterviewQuestions(
      company,
      role,
      type,
      difficulty,
    );

    // Save Interview
    const interview = await Interview.create({
      user: req.user.id,
      company,
      role,
      type,
      difficulty,
      questions,
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const evaluateInterviewAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer } = req.body;

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const currentQuestion = interview.questions[questionIndex];

    if (!currentQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const result = await evaluateAnswer(currentQuestion.question, answer);

    currentQuestion.answer = answer;
    currentQuestion.score = result.score;
    currentQuestion.feedback = result.feedback;
    currentQuestion.idealAnswer = result.idealAnswer;

    await interview.save();

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getInterviewResult = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const totalQuestions = interview.questions.length;

    const totalScore = interview.questions.reduce(
      (sum, question) => sum + (question.score || 0),
      0,
    );

    const overallScore =
      totalQuestions > 0 ? (totalScore / (totalQuestions * 10)) * 100 : 0;

    interview.overallScore = Math.round(overallScore);

    if (interview.questions.every((q) => q.answer && q.answer.trim() !== "")) {
      interview.status = "Completed";
    }

    await interview.save();

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id });

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter(
      (item) => item.status === "Completed",
    ).length;

    const bestScore =
      interviews.length > 0
        ? Math.max(...interviews.map((i) => i.overallScore || 0))
        : 0;

    const averageScore =
      interviews.length > 0
        ? (
            interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) /
            interviews.length
          ).toFixed(1)
        : 0;

    res.json({
      success: true,
      stats: {
        totalInterviews,
        completedInterviews,
        bestScore,
        averageScore,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  startInterview,
  evaluateInterviewAnswer,
  getUserInterviews,
  getInterviewResult,
  getDashboardStats,
};
