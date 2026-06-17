import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/auth/register",
        formData
      );

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <div className="text-center mb-4">

          <h1 className="fw-bold">
            🚀 SmartHire AI
          </h1>

          <p>
            Create your account and start
            your AI-powered career journey
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label className="form-label">
              Full Name
            </label>

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

            <label className="form-label">
              Email
            </label>

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

            <label className="form-label">
              Password
            </label>

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

            <label className="form-label">
              Join Us As A
            </label>

            <div className="row g-2">

              <div className="col-6">

                <button
                  type="button"
                  className={`btn w-100 py-2 ${
                    formData.role === "jobseeker"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, role: "jobseeker" })
                  }
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
                  onClick={() =>
                    setFormData({ ...formData, role: "recruiter" })
                  }
                  style={{ fontSize: "14px" }}
                >
                  💼 Recruiter
                </button>

              </div>

            </div>

          </div>

          <button
            className="btn btn-success w-100 py-2"
          >
            Create Account
          </button>

        </form>

        <div className="text-center mt-4">

          <p className="mb-2">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="btn btn-outline-primary w-100"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;
