import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaArrowLeft, FaKey } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker"
  });

  const [showOtpScreen, setShowOtpScreen] = useState(false);
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
        document.getElementById("google-register-btn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [formData.role]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      const res = await axios.post("/api/auth/google", {
        token: response.credential,
        role: formData.role
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Google registration failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit details to send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendingOtp(true);

    try {
      await axios.post("/api/auth/send-otp", { email: formData.email });
      alert("A 6-digit verification code has been sent to your email! (Please check your email or server console)");
      setShowOtpScreen(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP & Register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifyingOtp(true);

    try {
      const res = await axios.post("/api/auth/register-otp", {
        ...formData,
        otp
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Incorrect verification code");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        
        {!showOtpScreen ? (
          <>
            <div className="text-center mb-4">
              <h1 className="fw-bold">🚀 SmartHire AI</h1>
              <p>Create your account and start your AI-powered career journey</p>
            </div>

            {/* Google Sign-in button wrapper */}
            <div className="mb-4">
              <div id="google-register-btn" className="w-100 mb-3"></div>
              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted" style={{ fontSize: "12px" }}>OR REGISTER WITH EMAIL</span>
                <hr className="flex-grow-1" />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Join Us As A</label>
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className={`btn w-100 py-2 ${
                        formData.role === "jobseeker"
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setFormData({ ...formData, role: "jobseeker" })}
                      style={{ fontSize: "14px" }}
                    >
                      🔍 Job Seeker
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className={`btn w-100 py-2 ${
                        formData.role === "recruiter"
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setFormData({ ...formData, role: "recruiter" })}
                      style={{ fontSize: "14px" }}
                    >
                      💼 Recruiter
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-success w-100 py-2"
                disabled={sendingOtp}
              >
                {sendingOtp ? "Sending Verification Code..." : "Create Account"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="mb-3 d-inline-block p-3 rounded-circle bg-primary-glow text-primary">
                <FaKey style={{ fontSize: "28px" }} />
              </div>
              <h2 className="fw-bold">Verify Email</h2>
              <p className="text-muted">Enter the 6-digit OTP code sent to <strong>{formData.email}</strong></p>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control text-center fw-bold"
                  placeholder="0 0 0 0 0 0"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  style={{ fontSize: "24px", letterSpacing: "8px" }}
                  required
                />
              </div>

              <button
                className="btn btn-success w-100 py-2 mb-3"
                disabled={verifyingOtp}
              >
                {verifyingOtp ? "Verifying..." : "Verify & Complete Signup"}
              </button>

              <button
                type="button"
                className="btn btn-link w-100 text-muted d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowOtpScreen(false)}
              >
                <FaArrowLeft /> Edit Account Details
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-4">
          <p className="mb-2">Already have an account?</p>
          <Link to="/login" className="btn btn-outline-primary w-100">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
