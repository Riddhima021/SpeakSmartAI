require("dotenv").config();

const {
  evaluateAnswer,
} = require("./services/aiService");

(async () => {

  const result = await evaluateAnswer(

    "Explain Event Loop",

    "Event loop executes asynchronous tasks."

  );

  console.log(result);

})();