const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateInterviewQuestions = async (
  company,
  role,
  type,
  difficulty
) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "Return ONLY valid JSON. No markdown. No explanation.",
        },
        {
          role: "user",
          content: `
Generate exactly 10 ${type} interview questions.

Company: ${company}

Role: ${role}

Difficulty: ${difficulty}

Return JSON:

[
 {
   "question":"..."
 }
]
`,
        },
      ],

      temperature: 0.7,
    });

    let text = completion.choices[0].message.content;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error) {
    console.log(error);

    throw error;
  }
};

const evaluateAnswer = async (question, answer) => {
  try {

    const completion = await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      messages: [

        {
          role: "system",
          content:
            "Return ONLY valid JSON."
        },

        {
          role: "user",

          content: `
Evaluate this interview answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY JSON

{
 "score":8,
 "feedback":"....",
 "idealAnswer":"...."
}
`
        }

      ],

      temperature: 0.5,

    });

    let text = completion.choices[0].message.content;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error) {

    console.log(error);

    throw error;

  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
};