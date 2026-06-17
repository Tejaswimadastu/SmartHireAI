const User = require("../models/User");
const InterviewSession = require("../models/InterviewSession");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.error("Failed to initialize Google Generative AI in interview:", err);
  }
}

const generateQuestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.resume) {
      return res.status(400).json({
        message: "Please upload resume first"
      });
    }

    const pdfPath = path.join(__dirname, "..", "uploads", user.resume);
    if (!fs.existsSync(pdfPath)) {
      return res.status(400).json({
        message: "Resume file not found"
      });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text.toLowerCase();

    let questions = [];
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Based on the following candidate resume text, generate 5 relevant technical or behavioral interview questions.
        Return the result ONLY as a valid JSON array of strings:
        ["question 1", "question 2", ...]
        No formatting backticks. Plain JSON.
        
        Resume text:
        ${pdfData.text}`;

        const responseResult = await model.generateContent(prompt);
        const textResponse = responseResult.response.text().trim();
        const cleanJSON = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        questions = JSON.parse(cleanJSON);
      } catch (err) {
        console.error("Gemini Interview Question generation failed, falling back to local:", err);
        questions = getLocalQuestions(text);
      }
    } else {
      questions = getLocalQuestions(text);
    }

    res.json({ questions });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getLocalQuestions = (text) => {
  const questions = [];
  if (text.includes("react")) {
    questions.push("Explain React Virtual DOM and how reconciliation works.");
    questions.push("Difference between useState and useEffect hooks, and how hooks are ordered?");
  }
  if (text.includes("node")) {
    questions.push("Explain the Node.js Event Loop mechanism and libuv thread pool.");
  }
  if (text.includes("mongodb")) {
    questions.push("What is the Aggregation Pipeline in MongoDB, and how does it compare to map-reduce?");
  }
  if (text.includes("java")) {
    questions.push("Explain JVM Architecture and garbage collection tuning.");
  }
  if (text.includes("python")) {
    questions.push("What are Python Decorators and generators, and when would you use them?");
  }
  if (questions.length < 3) {
    questions.push("Tell me about a challenging technical project you worked on and the obstacles you overcame.");
    questions.push("How do you handle software scalability and database query optimization in your designs?");
    questions.push("What is your approach to system testing and deployment automation?");
  }
  return questions.slice(0, 5);
};

const getLocalEvaluation = (question, answer) => {
  const words = answer.split(/\s+/).filter(Boolean).length;
  let score = 30;
  if (words > 10) score += 20;
  if (words > 30) score += 20;
  if (words > 60) score += 20;
  // Add some simple randomness to feel realistic
  score += Math.min(Math.round(Math.random() * 10), 10);
  score = Math.min(score, 100);

  return {
    score,
    feedback: `Local Evaluation (No AI API connection): Your response contains ${words} words. To improve your score, ensure you provide structured details, reference specific technologies, and explain your personal contribution.`,
    modelAnswer: "To formulate a strong answer, use the STAR method: explain the Situation, Task, Action you took, and the Result achieved. Support it with technical details."
  };
};

const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer are required"
      });
    }

    let result;
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert technical interviewer. Evaluate the candidate's spoken answer to the following interview question.
        
        Question: ${question}
        Candidate's Answer: ${answer}

        Rate the answer and return a JSON object in this format:
        {
          "score": 85,
          "feedback": "Your answer is good because... However, you missed key concepts like...",
          "modelAnswer": "A comprehensive model answer to this question is..."
        }
        No formatting backticks. Plain JSON.`;

        const responseResult = await model.generateContent(prompt);
        const textResponse = responseResult.response.text().trim();
        const cleanJSON = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSON);

        result = {
          score: parsed.score || 50,
          feedback: parsed.feedback || "Good effort.",
          modelAnswer: parsed.modelAnswer || "Model answer not available."
        };
      } catch (err) {
        console.error("Gemini Evaluation failed, falling back to local:", err);
        result = getLocalEvaluation(question, answer);
      }
    } else {
      result = getLocalEvaluation(question, answer);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const saveInterviewSession = async (req, res) => {
  try {
    const { category, status, questions, violations, durationSeconds } = req.body;
    
    if (!category || !questions) {
      return res.status(400).json({ message: "Category and questions are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate overall score (average of question scores)
    const validScores = questions.filter(q => typeof q.score === "number");
    const overallScore = validScores.length > 0 
      ? Math.round(validScores.reduce((acc, q) => acc + q.score, 0) / validScores.length)
      : 0;

    // Calculate suspicion score (based on violations)
    const suspicionScore = Math.min((violations || []).length * 15, 100);

    // Determine hiring recommendation
    let hiringRecommendation = "Maybe";
    if (status === "Terminated") {
      hiringRecommendation = "Reject";
    } else if (overallScore >= 80 && suspicionScore < 30) {
      hiringRecommendation = "Strong Hire";
    } else if (overallScore >= 60 && suspicionScore < 50) {
      hiringRecommendation = "Hire";
    } else if (overallScore < 45 || suspicionScore >= 70) {
      hiringRecommendation = "Reject";
    }

    // Generate proctoring summary feedback
    let proctorFeedback = "";
    const violationCount = (violations || []).length;
    if (status === "Terminated") {
      proctorFeedback = `The interview was automatically terminated after exceeding the violation limit. Proctoring logs registered ${violationCount} suspicious events.`;
    } else if (violationCount === 0) {
      proctorFeedback = "Excellent! The proctoring system registered zero integrity violations during the session. Candidate stayed focused throughout.";
    } else {
      proctorFeedback = `Candidate completed the session. However, the proctoring system flagged ${violationCount} suspicious events (Suspicion Score: ${suspicionScore}%). Please review logs and screenshots.`;
    }

    const newSession = new InterviewSession({
      candidate: req.user.id,
      candidateName: user.name,
      category,
      status: status || "Completed",
      questions,
      violations: violations || [],
      overallScore,
      suspicionScore,
      proctorFeedback,
      hiringRecommendation,
      durationSeconds: durationSeconds || 0
    });

    await newSession.save();
    res.status(201).json({ success: true, session: newSession });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ candidate: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCandidateSession = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const sessions = await InterviewSession.find({ candidate: candidateId }).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find()
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswer,
  saveInterviewSession,
  getInterviewHistory,
  getCandidateSession,
  getAllSessions
};