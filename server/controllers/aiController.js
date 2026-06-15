const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const User = require("../models/User");
const Job = require("../models/Job");

// ===============================
// Skills Database
// ===============================
const skillsDatabase = [
  "java",
  "python",
  "javascript",
  "react",
  "nodejs",
  "node.js",
  "express",
  "mongodb",
  "mysql",
  "postgresql",
  "sql",
  "html",
  "css",
  "bootstrap",
  "tailwind",
  "git",
  "github",
  "docker",
  "aws",
  "azure",
  "firebase",
  "streamlit",
  "supabase",
  "machine learning",
  "deep learning",
  "c",
  "c++",
  "power bi",
  "tableau"
];

// ===============================
// Resume Analysis Logic
// ===============================
const generateAnalysis = (resumeText) => {
  const text = resumeText.toLowerCase();

  const foundSkills = skillsDatabase.filter(skill =>
    text.includes(skill)
  );

  const recommendedSkills = [
    "docker",
    "aws",
    "kubernetes",
    "ci/cd",
    "redis"
  ];

  const missingSkills = recommendedSkills.filter(
    skill => !foundSkills.includes(skill)
  );

  const roles = [];

  if (
    foundSkills.includes("react") ||
    foundSkills.includes("html") ||
    foundSkills.includes("css")
  ) {
    roles.push("Frontend Developer");
  }

  if (
    foundSkills.includes("nodejs") ||
    foundSkills.includes("express")
  ) {
    roles.push("Backend Developer");
  }

  if (
    foundSkills.includes("react") &&
    foundSkills.includes("nodejs")
  ) {
    roles.push("Full Stack Developer");
  }

  if (
    foundSkills.includes("python") ||
    foundSkills.includes("machine learning")
  ) {
    roles.push("Python Developer");
  }

  if (
    foundSkills.includes("sql") ||
    foundSkills.includes("mysql") ||
    foundSkills.includes("postgresql")
  ) {
    roles.push("Database Developer");
  }

  let score = 0;

  score += Math.min(
    (foundSkills.length / 20) * 40,
    40
  );

  if (
    text.includes("project") ||
    text.includes("projects")
  ) {
    score += 20;
  }

  if (
    text.includes("b.tech") ||
    text.includes("bachelor") ||
    text.includes("degree")
  ) {
    score += 10;
  }

  if (
    text.includes("internship") ||
    text.includes("experience")
  ) {
    score += 20;
  }

  if (resumeText.length > 2000) {
    score += 10;
  }

  score = Math.min(Math.round(score), 100);

  return {
    score,
    foundSkills,
    missingSkills,
    roles,
    analysis: `
Resume Score: ${score}/100

Technical Skills:
${foundSkills.length
  ? foundSkills.join(", ")
  : "No skills detected"}

Strengths:
• Strong technical foundation
• Hands-on project experience
• Industry relevant technologies

Missing Skills:
${missingSkills.length
  ? missingSkills.join(", ")
  : "None"}

Suitable Roles:
${roles.length
  ? roles.join(", ")
  : "Software Developer"}

Interview Questions:

1. Explain OOP concepts.
2. Difference between SQL and NoSQL.
3. What is React Virtual DOM?
4. Explain REST APIs.
5. What is Git branching?
`
  };
};
const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required"
      });
    }

    const result =
      generateAnalysis(resumeText);

    res.status(200).json({
      success: true,
      analysis: result.analysis
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// ===============================
// Analyze Uploaded Resume
// ===============================
const analyzeUploadedResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resume) {
      return res.status(404).json({
        success: false,
        message: "No resume uploaded"
      });
    }

    const pdfPath = path.join(
      __dirname,
      "..",
      "uploads",
      user.resume
    );

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file not found"
      });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);

    const result = generateAnalysis(
  pdfData.text
);

user.resumeScore = result.score;

user.atsScore =
  Math.max(result.score - 10, 0);

user.skills = result.foundSkills;

user.missingSkills =
  result.missingSkills;

await user.save();

return res.status(200).json({
  success: true,
  analysis: result.analysis,
  score: result.score,
  skills: result.foundSkills
});

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// ===============================
// ATS Match Resume With Job
// ===============================
const matchResumeWithJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user || !user.resume) {
      return res.status(404).json({
        success: false,
        message: "Please upload resume first"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const pdfPath = path.join(
      __dirname,
      "..",
      "uploads",
      user.resume
    );

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);

    const resumeText = pdfData.text.toLowerCase();

    const jobSkills = (job.skills || []).map(skill =>
      skill.toLowerCase().trim()
    );

    const matchedSkills = [];
    const missingSkills = [];

    jobSkills.forEach(skill => {
      if (resumeText.includes(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const score =
      jobSkills.length > 0
        ? Math.round(
            (matchedSkills.length / jobSkills.length) * 100
          )
        : 0;

    let recommendation = "Not Recommended";

    if (score >= 80) {
      recommendation = "Highly Recommended";
    } else if (score >= 60) {
      recommendation = "Recommended";
    } else if (score >= 40) {
      recommendation = "Needs Skill Improvement";
    }

    const suggestions =
      missingSkills.length > 0
        ? "Learn: " + missingSkills.join(", ")
        : "Excellent match. No major skill gaps.";

    return res.status(200).json({
      success: true,
      analysis: `
ATS Match Score: ${score}%

Matching Skills:
${matchedSkills.join(", ") || "None"}

Missing Skills:
${missingSkills.join(", ") || "None"}

Suggestions:
${suggestions}

Hiring Recommendation:
${recommendation}
`
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  analyzeResume,
  analyzeUploadedResume,
  matchResumeWithJob
};