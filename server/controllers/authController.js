const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

// =============================
// Helper: Send OTP Email (or Console Fallback)
// =============================
const sendOTPEmail = async (email, otp) => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({
        from: `"SmartHire AI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "SmartHire AI - Verification Code",
        text: `Your verification code is: ${otp}. It is valid for 5 minutes.`,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #4f46e5; text-align: center;">SmartHire AI</h2>
          <p>Hello,</p>
          <p>Your email verification code is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <h1 style="background: #f3f4f6; padding: 12px 24px; display: inline-block; letter-spacing: 4px; color: #1f2937; border-radius: 6px; font-family: monospace;">${otp}</h1>
          </div>
          <p>This code is valid for 5 minutes.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">If you did not request this code, please ignore this email.</p>
        </div>`
      });
      console.log(`✉️ OTP email sent successfully to ${email}`);
      return true;
    } catch (err) {
      console.error("❌ Failed to send SMTP email:", err.message);
    }
  }

  // Fallback console log for development/testing
  console.log(`\n========================================`);
  console.log(`🔐 [DEVELOPER OTP BYPASS]`);
  console.log(`Email: ${email}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`========================================\n`);
  return false;
};

// =============================
// Helper: Generate 6-Digit OTP
// =============================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =============================
// Password Login
// =============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.isGoogleUser && !user.password) {
      return res.status(400).json({
        message: "This account is registered with Google. Please use Google Login."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// =============================
// Password Registration
// =============================
const register = async (req, res) => {
  try {
    console.log("Register API Hit");
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// =============================
// Send Registration OTP
// =============================
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();

    // Remove existing OTPs for this email and create new
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Verification OTP sent successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// Verify OTP & Register User
// =============================
const verifyOTPAndRegister = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;
    if (!email || !otp || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "jobseeker"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User Registered Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// Send Login OTP
// =============================
const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email" });
    }

    const otp = generateOTP();

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Login OTP sent successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// Verify Login OTP & Login
// =============================
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired login code" });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// Google OAuth Sign-In / Sign-Up
// =============================
const googleAuth = async (req, res) => {
  try {
    const { token, role } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify token with Google's endpoint
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email, name, email_verified } = response.data;

    if (!email_verified || email_verified === "false") {
      return res.status(400).json({ message: "Google email is not verified" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new Google user
      user = await User.create({
        name,
        email,
        isGoogleUser: true,
        role: role || "jobseeker"
      });
    } else if (!user.isGoogleUser) {
      // Convert standard user to google user if matching
      user.isGoogleUser = true;
      await user.save();
    }

    const localToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google Auth Successful",
      token: localToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res.status(400).json({
      message: "Invalid Google token or verification failed"
    });
  }
};

module.exports = {
  register,
  login,
  sendOTP,
  verifyOTPAndRegister,
  sendLoginOTP,
  verifyLoginOTP,
  googleAuth
};