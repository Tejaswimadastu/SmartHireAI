
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

  const activeStyle = {
    color: "#fff",
    fontWeight: "bold",
    borderBottom: "2px solid white"
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-lg"
      style={{
        background:
          "linear-gradient(90deg,#4f46e5,#7c3aed)"
      }}
    >
      <div className="container">

        <Link
          className="navbar-brand fw-bold fs-3"
          to="/dashboard"
        >
          🚀 SmartHire AI
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                <FaHome /> Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                <FaChartLine /> Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/jobs"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                <FaBriefcase /> Jobs
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/resume"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                <FaUpload /> Upload
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/resume-analyzer"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                <FaFileAlt /> Resume AI
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/resume-report"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                📊 Report
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/interview"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                <FaRobot /> Interview AI
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/my-applications"
                className="nav-link"
                style={({ isActive }) =>
                  isActive ? activeStyle : {}
                }
              >
                Applications
              </NavLink>
            </li>

            {user.role === "recruiter" && (
  <li className="nav-item">
    <NavLink
      to="/admin"
      className="nav-link"
      style={({ isActive }) =>
        isActive ? activeStyle : {}
      }
    >
      <FaUsers /> Recruiter
    </NavLink>
  </li>
)}

            <li className="nav-item">
  <NavLink
    to={
      user.role === "recruiter"
        ? "/recruiter-profile"
        : "/profile"
    }
    className="nav-link"
    style={({ isActive }) =>
      isActive ? activeStyle : {}
    }
  >
    <FaUser /> Profile
  </NavLink>
</li>
            {user.role === "recruiter" && (
  <li className="nav-item">
    <NavLink
      to="/ranking"
      className="nav-link"
      style={({ isActive }) =>
        isActive ? activeStyle : {}
      }
    >
      🏆 Ranking
    </NavLink>
  </li>
)}

            <li className="nav-item ms-3">
              <span
                className="badge rounded-pill bg-light text-dark"
                style={{
                  fontSize: "14px",
                  padding: "10px 14px"
                }}
              >
                👋 {user.name || "User"}
              </span>
            </li>

            <li className="nav-item ms-3">
              <button
                className="btn btn-warning"
                onClick={() =>
                  setDarkMode(!darkMode)
                }
              >
                {darkMode ? (
                  <>
                    <FaSun /> Light
                  </>
                ) : (
                  <>
                    <FaMoon /> Dark
                  </>
                )}
              </button>
            </li>

            <li className="nav-item ms-3">
              <button
                onClick={logoutHandler}
                className="btn btn-danger"
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;

