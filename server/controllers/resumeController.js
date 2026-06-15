
const fs = require("fs");
const pdfParse = require("pdf-parse");
const User = require("../models/User");
const analyzeResume = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.resume = req.file.filename;
    await user.save();

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    res.json({
      success: true,
      message: "Resume Uploaded Successfully",
      filename: req.file.filename,
      extractedText: pdfData.text
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  analyzeResume
};