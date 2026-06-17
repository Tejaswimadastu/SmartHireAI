const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const User = require("../models/User");
const Job = require("../models/Job");

// Initialize Gemini AI
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.error("Failed to initialize Google Generative AI:", err);
  }
}

// Skills Database for local fallback analysis
const skillsDatabase = [
  "java", "python", "javascript", "react", "nodejs", "node.js", "express",
  "mongodb", "mysql", "postgresql", "sql", "html", "css", "bootstrap",
  "tailwind", "git", "github", "docker", "aws", "azure", "firebase",
  "streamlit", "supabase", "machine learning", "deep learning", "c", "c++",
  "power bi", "tableau"
];

// Local fallback analysis generator
const generateAnalysisLocal = (resumeText) => {
  const text = resumeText.toLowerCase();
  const foundSkills = skillsDatabase.filter(skill => text.includes(skill));
  const recommendedSkills = ["docker", "aws", "kubernetes", "ci/cd", "redis"];
  const missingSkills = recommendedSkills.filter(skill => !foundSkills.includes(skill));
  
  const roles = [];
  if (foundSkills.includes("react") || foundSkills.includes("html") || foundSkills.includes("css")) {
    roles.push("Frontend Developer");
  }
  if (foundSkills.includes("nodejs") || foundSkills.includes("express")) {
    roles.push("Backend Developer");
  }
  if (foundSkills.includes("react") && foundSkills.includes("nodejs")) {
    roles.push("Full Stack Developer");
  }
  if (foundSkills.includes("python") || foundSkills.includes("machine learning")) {
    roles.push("Python/ML Engineer");
  }
  if (foundSkills.includes("sql") || foundSkills.includes("mysql") || foundSkills.includes("postgresql")) {
    roles.push("Database Engineer");
  }

  let score = 40;
  score += Math.min((foundSkills.length / 20) * 40, 40);
  if (text.includes("project")) score += 10;
  if (text.includes("experience") || text.includes("internship")) score += 10;

  score = Math.min(Math.round(score), 100);

  const cleanSkills = foundSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1));
  const cleanMissing = missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1));

  return {
    score,
    foundSkills: cleanSkills,
    missingSkills: cleanMissing,
    roles: roles.length ? roles : ["Software Developer"],
    analysis: `Resume Score: ${score}/100\n\nTechnical Skills Found:\n${cleanSkills.join(", ") || "No major skills detected"}\n\nStrengths:\n• Solid foundation in core tools\n• Documented project details\n\nMissing Skills:\n${cleanMissing.join(", ")}\n\nSuggested Roles:\n${roles.join(", ") || "Software Developer"}`
  };
};

const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ success: false, message: "Resume text is required" });
    }

    let result;
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze the following resume text and evaluate key strengths, missing skills, suggested job roles, and a total ATS score out of 100. Provide the result as a raw JSON object with the following fields:
        {
          "score": 85,
          "foundSkills": ["skill1", "skill2"],
          "missingSkills": ["skill3"],
          "roles": ["Full Stack Developer"],
          "analysis": "Strengths, Gaps, and details formatted in Markdown."
        }
        Do NOT include any markdown block markers like \`\`\`json. Return only the plain JSON.
        
        Resume text:
        ${resumeText}`;

        const responseResult = await model.generateContent(prompt);
        const textResponse = responseResult.response.text().trim();
        const cleanJSON = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSON);
        result = {
          score: parsed.score || 70,
          foundSkills: parsed.foundSkills || [],
          missingSkills: parsed.missingSkills || [],
          roles: parsed.roles || ["Software Developer"],
          analysis: parsed.analysis || textResponse
        };
      } catch (err) {
        console.error("Gemini Analyze failed, falling back to local:", err);
        result = generateAnalysisLocal(resumeText);
      }
    } else {
      result = generateAnalysisLocal(resumeText);
    }

    res.status(200).json({ success: true, analysis: result.analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const analyzeUploadedResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.resume) {
      return res.status(404).json({ success: false, message: "No resume uploaded" });
    }

    const pdfPath = path.join(__dirname, "..", "uploads", user.resume);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: "Resume file not found" });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    let result;
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze the following resume text and extract technical skills, missing high-demand engineering skills, matching software roles, and score it out of 100.
        Return the result ONLY as a valid JSON object in this format:
        {
          "score": 85,
          "foundSkills": ["React", "Node.js"],
          "missingSkills": ["AWS", "Docker"],
          "roles": ["Full Stack Developer"],
          "analysis": "Formatted summary report of resume details"
        }
        No formatting backticks. Plain JSON.
        
        Resume text:
        ${resumeText}`;

        const responseResult = await model.generateContent(prompt);
        const textResponse = responseResult.response.text().trim();
        const cleanJSON = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSON);

        result = {
          score: parsed.score || 70,
          foundSkills: parsed.foundSkills || [],
          missingSkills: parsed.missingSkills || [],
          roles: parsed.roles || [],
          analysis: parsed.analysis || textResponse
        };
      } catch (err) {
        console.error("Gemini Upload Analyze failed, falling back to local:", err);
        result = generateAnalysisLocal(resumeText);
      }
    } else {
      result = generateAnalysisLocal(resumeText);
    }

    user.resumeScore = result.score;
    user.atsScore = Math.max(result.score - 5, 0); // set overall score
    user.skills = result.foundSkills;
    user.missingSkills = result.missingSkills;
    await user.save();

    return res.status(200).json({
      success: true,
      analysis: result.analysis,
      score: result.score,
      skills: result.foundSkills,
      missingSkills: result.missingSkills
    });
  } catch (error) {
    console.error("Upload analyze route error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const matchResumeWithJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user || !user.resume) {
      return res.status(404).json({ success: false, message: "Please upload resume first" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const pdfPath = path.join(__dirname, "..", "uploads", user.resume);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: "Resume file not found" });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    let result;
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an ATS Match simulator. Compare this resume text with the job requirements:
        Job Title: ${job.title}
        Company: ${job.company}
        Job Description: ${job.description}
        Skills Requested: ${job.skills ? job.skills.join(", ") : "None"}

        Evaluate and return a JSON object exactly in this format:
        {
          "score": 85,
          "matchedSkills": ["React"],
          "missingSkills": ["AWS"],
          "suggestions": "Suggestions to improve fit",
          "recommendation": "Highly Recommended",
          "analysis": "Summary report including match percentage, details, and suggestions"
        }
        No formatting backticks. Plain JSON.

        Resume Text:
        ${resumeText}`;

        const responseResult = await model.generateContent(prompt);
        const textResponse = responseResult.response.text().trim();
        const cleanJSON = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSON);

        result = {
          score: parsed.score || 50,
          matchedSkills: parsed.matchedSkills || [],
          missingSkills: parsed.missingSkills || [],
          suggestions: parsed.suggestions || "",
          recommendation: parsed.recommendation || "Recommended",
          analysis: parsed.analysis || textResponse
        };
      } catch (err) {
        console.error("Gemini Job Match failed, falling back to local:", err);
        result = getLocalJobMatch(resumeText, job);
      }
    } else {
      result = getLocalJobMatch(resumeText, job);
    }

    return res.status(200).json({
      success: true,
      analysis: result.analysis,
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      recommendation: result.recommendation,
      suggestions: result.suggestions
    });
  } catch (error) {
    console.error("Match error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Helper for local job matching
const getLocalJobMatch = (resumeText, job) => {
  const text = resumeText.toLowerCase();
  const jobSkills = (job.skills || []).map(s => s.toLowerCase().trim());
  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach(skill => {
    if (text.includes(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const score = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 50;
  let recommendation = "Needs Skill Improvement";
  if (score >= 80) recommendation = "Highly Recommended";
  else if (score >= 60) recommendation = "Recommended";
  else if (score < 40) recommendation = "Not Recommended";

  const suggestions = missingSkills.length > 0 ? `Learn: ${missingSkills.join(", ")}` : "Excellent match. Keep it up!";

  const cleanMatched = matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1));
  const cleanMissing = missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1));

  return {
    score,
    matchedSkills: cleanMatched,
    missingSkills: cleanMissing,
    suggestions,
    recommendation,
    analysis: `ATS Match Score: ${score}%\n\nMatching Skills:\n${cleanMatched.join(", ") || "None"}\n\nMissing Skills:\n${cleanMissing.join(", ") || "None"}\n\nSuggestions:\n${suggestions}\n\nHiring Recommendation:\n${recommendation}`
  };
};

module.exports = {
  analyzeResume,
  analyzeUploadedResume,
  matchResumeWithJob,
  getLocalJobMatch
};