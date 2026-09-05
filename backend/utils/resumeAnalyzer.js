const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeResumeWithAI = async (resumeText, role, scores) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an Expert ATS Resume Reviewer.

IMPORTANT RULES:
- Analyze ONLY the resume provided.
- Never invent skills or experience.
- If something is missing, mention it.
- Do NOT calculate ATS or Resume score.
- The scores are already calculated.
- Your feedback must match the resume content.
- Return ONLY valid JSON.
`,
        },
        {
          role: "user",
          content: `
Target Role:
${role}

Resume Score:
${scores.resumeScore}/100

ATS Score:
${scores.atsScore}/100

Matched Keywords:
${scores.matchedKeywords}/${scores.totalKeywords}

Resume Text:

${resumeText}

Return ONLY this JSON:

{
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "...",
    "..."
  ],
  "missingSkills": [
    "...",
    "...",
    "..."
  ],
  "suggestions": [
    "...",
    "...",
    "..."
  ],
  "recommendedProjects": [
    "...",
    "...",
    "..."
  ],
  "recommendedCertifications": [
    "...",
    "...",
    "..."
  ],
  "interviewQuestions": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}
`,
        },
      ],

      temperature: 0.2,
      max_tokens: 1500,
    });

    let text = completion.choices[0].message.content;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const ai = JSON.parse(text);

    return {
      resumeScore: scores.resumeScore,
      atsScore: scores.atsScore,
      matchedKeywords: scores.matchedKeywords,
      totalKeywords: scores.totalKeywords,

      strengths: ai.strengths || [],
      weaknesses: ai.weaknesses || [],
      missingSkills: ai.missingSkills || [],
      suggestions: ai.suggestions || [],
      recommendedProjects: ai.recommendedProjects || [],
      recommendedCertifications: ai.recommendedCertifications || [],
      interviewQuestions: ai.interviewQuestions || [],
    };
  } catch (err) {
    console.error("Resume AI Analysis Error:", err.message);
    throw err;
  }
};

module.exports = {
  analyzeResumeWithAI,
};