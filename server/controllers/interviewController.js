const User = require("../models/User");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const generateQuestions = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(req.user.id);

    if (!user.resume) {
      return res.status(400).json({
        message:
          "Please upload resume first"
      });
    }

    const pdfPath = path.join(
      __dirname,
      "..",
      "uploads",
      user.resume
    );

    const pdfBuffer =
      fs.readFileSync(pdfPath);

    const pdfData =
      await pdfParse(pdfBuffer);

    const text =
      pdfData.text.toLowerCase();

    const questions = [];

    if (text.includes("react")) {
      questions.push(
        "Explain React Virtual DOM."
      );

      questions.push(
        "Difference between useState and useEffect?"
      );
    }

    if (text.includes("node")) {
      questions.push(
        "Explain Node.js Event Loop."
      );
    }

    if (text.includes("mongodb")) {
      questions.push(
        "What is Aggregation Pipeline?"
      );
    }

    if (text.includes("java")) {
      questions.push(
        "Explain JVM Architecture."
      );
    }

    if (text.includes("python")) {
      questions.push(
        "What are Python Decorators?"
      );
    }

    res.json({
      questions
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  generateQuestions
};