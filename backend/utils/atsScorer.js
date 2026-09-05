const roleKeywords = {
  "Full Stack Developer": [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "mysql",
    "html",
    "css",
    "git",
    "github",
    "rest api",
    "jwt",
    "bootstrap",
    "tailwind",
    "api"
  ],

  "Frontend Developer": [
    "html",
    "css",
    "javascript",
    "react",
    "redux",
    "tailwind",
    "bootstrap",
    "responsive",
    "figma"
  ],

  "Backend Developer": [
    "node",
    "express",
    "mongodb",
    "mysql",
    "jwt",
    "api",
    "rest",
    "authentication",
    "sql"
  ],

  "Data Engineer": [
    "python",
    "sql",
    "pandas",
    "numpy",
    "etl",
    "spark",
    "hadoop",
    "aws",
    "azure",
    "airflow"
  ]
};

const scoreResume = (resumeText, role) => {
  const text = resumeText.toLowerCase();

  let atsScore = 0;
  let resumeScore = 0;
  let matchedKeywords = 0;

  const keywords = roleKeywords[role] || [];

  // ==========================
  // ATS SCORE (100)
  // ==========================

  keywords.forEach((word) => {
    if (text.includes(word.toLowerCase())) {
      matchedKeywords++;
    }
  });

  // Keyword Match (60)
  atsScore += (matchedKeywords / keywords.length) * 60;

  // Resume Sections (20)
  const sections = [
    "summary",
    "education",
    "skills",
    "projects",
    "certification",
  ];

  let sectionCount = 0;

  sections.forEach((section) => {
    if (text.includes(section)) sectionCount++;
  });

  atsScore += (sectionCount / sections.length) * 20;

  // Action Verbs & Impact (20)
  const actionWords = [
    "developed",
    "built",
    "implemented",
    "created",
    "designed",
    "optimized",
    "integrated",
    "managed",
    "improved",
    "deployed",
  ];

  let actionCount = 0;

  actionWords.forEach((word) => {
    if (text.includes(word)) actionCount++;
  });

  atsScore += Math.min(actionCount * 2, 20);

  atsScore = Math.round(Math.min(atsScore, 100));

  // ==========================
  // RESUME SCORE (100)
  // ==========================

  // Contact (10)
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(resumeText))
    resumeScore += 3;

  if (/\d{10}/.test(resumeText))
    resumeScore += 3;

  if (text.includes("linkedin"))
    resumeScore += 2;

  if (text.includes("github"))
    resumeScore += 2;

  // Education (10)
  if (
    text.includes("b.tech") ||
    text.includes("btech") ||
    text.includes("bachelor")
  )
    resumeScore += 10;

  // Skills (15)
  const commonSkills = [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "mysql",
    "python",
    "git",
    "html",
    "css",
  ];

  let skillCount = 0;

  commonSkills.forEach((skill) => {
    if (text.includes(skill)) skillCount++;
  });

  resumeScore += Math.min(skillCount * 1.5, 15);

  // Projects (25)
  if (text.includes("project"))
    resumeScore += 10;

  if (text.includes("rest api"))
    resumeScore += 3;

  if (text.includes("authentication"))
    resumeScore += 3;

  if (text.includes("mongodb"))
    resumeScore += 3;

  if (text.includes("react"))
    resumeScore += 3;

  if (text.includes("node"))
    resumeScore += 3;

  // Certification (5)
  if (
    text.includes("certification") ||
    text.includes("certificate")
  )
    resumeScore += 5;

  // Experience (10)
  if (
    text.includes("intern") ||
    text.includes("experience")
  )
    resumeScore += 10;

  // Achievements (5)
  if (
    text.includes("achievement") ||
    text.includes("award")
  )
    resumeScore += 5;

  // Length (10)
  if (resumeText.length > 1200)
    resumeScore += 10;

  resumeScore = Math.round(Math.min(resumeScore, 100));

  return {
    atsScore,
    resumeScore,
    matchedKeywords,
    totalKeywords: keywords.length,
  };
};

module.exports = scoreResume;