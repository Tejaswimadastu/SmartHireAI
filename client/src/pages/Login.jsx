import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const res = await axios.post(
        "/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="text-center mb-4">

          <h1 className="fw-bold">
            🚀 SmartHire AI
          </h1>

          <p>
            AI Powered Resume Screening &
            Job Matching Platform
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
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
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />

          </div>

          <button
            className="btn btn-primary w-100"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-4">

          <p>
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="btn btn-outline-primary"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;
