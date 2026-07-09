require("dotenv").config();

const {
  generateInterviewQuestions,
} = require("./services/aiService");

(async () => {
  const questions =
    await generateInterviewQuestions(
      "Google",
      "Full Stack Developer",
      "Technical",
      "Medium"
    );

  console.log(questions);
})();