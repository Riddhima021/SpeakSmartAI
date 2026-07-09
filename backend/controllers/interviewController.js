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
      difficulty
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

    const interview = await Interview.findById(interviewId);

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

    const result = await evaluateAnswer(
      currentQuestion.question,
      answer
    );

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

module.exports = {
  startInterview,
  evaluateInterviewAnswer,
};