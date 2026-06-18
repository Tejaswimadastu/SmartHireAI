const express = require("express");

const router = express.Router();

const {
  register,
  login,
  sendOTP,
  verifyOTPAndRegister,
  sendLoginOTP,
  verifyLoginOTP,
  googleAuth
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/register-otp", verifyOTPAndRegister);
router.post("/login-otp-request", sendLoginOTP);
router.post("/login-otp-verify", verifyLoginOTP);
router.post("/google", googleAuth);

router.post("/test", (req, res) => {
    console.log("TEST HIT");
    res.json({
        message: "Working"
    });
});

module.exports = router;