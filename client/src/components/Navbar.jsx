
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import {
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaChartLine,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaUsers,
  FaRobot,
  FaUpload
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const { darkMode, setDarkMode } =
    useContext(ThemeContext);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    {};

  const logoutHandler = () => {
    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm py-3"
      style={{
        background: darkMode ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: darkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
        zIndex: 1030
      }}
    >
      <div className="container">

        <Link
          className="navbar-brand fw-bold fs-3 text-primary d-flex align-items-center gap-2"
          to="/dashboard"
          style={{ letterSpacing: "-0.5px" }}
        >
          🚀 SmartHire <span className="text-secondary opacity-75 fs-4">AI</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ filter: darkMode ? "invert(1)" : "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center gap-1 mt-3 mt-lg-0">

            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link px-3"
                style={({ isActive }) => ({
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: isActive ? "600" : "400"
                })}
              >
                <FaHome className="me-1" /> Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className="nav-link px-3"
                style={({ isActive }) => ({
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: isActive ? "600" : "400"
                })}
              >
                <FaChartLine className="me-1" /> Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/jobs"
                className="nav-link px-3"
                style={({ isActive }) => ({
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: isActive ? "600" : "400"
                })}
              >
                <FaBriefcase className="me-1" /> Jobs
              </NavLink>
            </li>

            {user.role !== "recruiter" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/resume"
                    className="nav-link px-3"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: isActive ? "600" : "400"
                    })}
                  >
                    <FaUpload className="me-1" /> Upload
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/resume-analyzer"
                    className="nav-link px-3"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: isActive ? "600" : "400"
                    })}
                  >
                    <FaFileAlt className="me-1" /> Resume AI
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/resume-report"
                    className="nav-link px-3"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: isActive ? "600" : "400"
                    })}
                  >
                    📊 Report
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/interview"
                    className="nav-link px-3"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: isActive ? "600" : "400"
                    })}
                  >
                    <FaRobot className="me-1" /> Interview AI
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/my-applications"
                    className="nav-link px-3"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: isActive ? "600" : "400"
                    })}
                  >
                    Applications
                  </NavLink>
                </li>
              </>
            )}

            {user.role === "recruiter" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/admin"
                    className="nav-link px-3"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: isActive ? "600" : "400"
                    })}
                  >
                    <FaUsers className="me-1" /> Recruiter
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/ranking"
                    className="nav-link px-3"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: isActive ? "600" : "400"
                    })}
                  >
                    🏆 Ranking
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink
                to={
                  user.role === "recruiter"
                    ? "/recruiter-profile"
                    : "/profile"
                }
                className="nav-link px-3"
                style={({ isActive }) => ({
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: isActive ? "600" : "400"
                })}
              >
                <FaUser className="me-1" /> Profile
              </NavLink>
            </li>

            <div className="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0">
              <span
                className="badge text-primary"
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "8px 12px",
                  background: "var(--primary-glow)"
                }}
              >
                👋 {user.name || "User"}
              </span>

              <button
                className={`btn btn-sm ${
                  darkMode ? "btn-outline-warning" : "btn-outline-dark"
                }`}
                onClick={() => setDarkMode(!darkMode)}
                style={{ borderRadius: "8px", padding: "6px 12px" }}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>

              <button
                onClick={logoutHandler}
                className="btn btn-sm btn-danger ms-1"
                style={{ borderRadius: "8px", padding: "6px 12px" }}
              >
                <FaSignOutAlt />
              </button>
            </div>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;

