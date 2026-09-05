const pdf = require("pdf-parse");
const scoreResume = require("../utils/atsScorer");
const { analyzeResumeWithAI } = require("../utils/resumeAnalyzer");

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    const role = req.body.role || "Full Stack Developer";

    // Extract text from uploaded PDF
    const data = await pdf(req.file.buffer);
    const extractedText = data.text;

    // console.log("Resume Text:");
    // console.log(extractedText);

    // Calculate ATS Score
    const scores = scoreResume(extractedText, role);
    // console.log(scores);

    // AI Analysis
    const analysis = await analyzeResumeWithAI(
      extractedText,
      role,
      scores
    );

    // console.log(analysis);

    res.json({
      success: true,
      analysis,
    });
  } catch (err) {
    console.error(err);

   res.status(500).json({
  success: false,
  message: "Resume analysis failed.",
});
  }
};

module.exports = {
  analyzeResume,
};