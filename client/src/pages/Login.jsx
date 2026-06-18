import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaKey, FaArrowLeft, FaEnvelope } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP states
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const navigate = useNavigate();

  // Initialize Google Identity Services
  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "625455648831-2sk0u3b85f2r4srm25qepn4rghlh0h9n.apps.googleusercontent.com",
        callback: handleGoogleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [useOtp]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      const res = await axios.post("/api/auth/google", {
        token: response.credential
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Google authentication failed");
    }
  };

  // Password Login Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  // Request Login OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    setSendingOtp(true);

    try {
      await axios.post("/api/auth/login-otp-request", { email });
      alert("A login OTP verification code has been sent to your email!");
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send login code");
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify Login OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifyingOtp(true);

    try {
      const res = await axios.post("/api/auth/login-otp-verify", {
        email,
        otp
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid or expired login code");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="text-center mb-4">
          <h1 className="fw-bold">🚀 SmartHire AI</h1>
          <p>AI Powered Resume Screening & Job Matching Platform</p>
        </div>

        {/* Google Sign-in button wrapper */}
        <div className="mb-4">
          <div id="google-login-btn" className="w-100 mb-3"></div>
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted" style={{ fontSize: "12px" }}>OR LOGIN WITH EMAIL</span>
            <hr className="flex-grow-1" />
          </div>
        </div>

        {!useOtp ? (
          // Password Login Form
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100 mb-3">
              Login
            </button>

            <button
              type="button"
              className="btn btn-link w-100 text-decoration-none"
              onClick={() => setUseOtp(true)}
            >
              🔒 Login with Email OTP
            </button>
          </form>
        ) : (
          // OTP Login Form
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="mb-4">
                  <label className="form-label">Enter Registered Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="btn btn-primary w-100 mb-3"
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending Code..." : "Send Verification OTP"}
                </button>

                <button
                  type="button"
                  className="btn btn-link w-100 text-muted d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setUseOtp(false)}
                >
                  <FaArrowLeft /> Back to Password Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="text-center mb-4">
                  <div className="mb-3 d-inline-block p-3 rounded-circle bg-primary-glow text-primary">
                    <FaKey style={{ fontSize: "24px" }} />
                  </div>
                  <h5 className="fw-bold">Enter OTP</h5>
                  <p className="text-muted small">We sent a login code to <strong>{email}</strong></p>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control text-center fw-bold"
                    placeholder="0 0 0 0 0 0"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    style={{ fontSize: "22px", letterSpacing: "8px" }}
                    required
                  />
                </div>

                <button
                  className="btn btn-success w-100 mb-3"
                  disabled={verifyingOtp}
                >
                  {verifyingOtp ? "Verifying..." : "Verify & Login"}
                </button>

                <button
                  type="button"
                  className="btn btn-link w-100 text-muted d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setOtpSent(false)}
                >
                  <FaArrowLeft /> Change Email Address
                </button>
              </form>
            )}
          </div>
        )}

        <div className="text-center mt-4">
          <p>Don't have an account?</p>
          <Link to="/register" className="btn btn-outline-primary">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
