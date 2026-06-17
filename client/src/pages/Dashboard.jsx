import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ATSScoreCircle from "../components/ATSScoreCircle";
import {
  FaUpload,
  FaFileAlt,
  FaBriefcase,
  FaUser,
  FaLightbulb,
  FaListAlt
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [stats, setStats] = useState({
    resumeScore: 0,
    atsScore: 0,
    applications: 0,
    interviews: 0
  });

  useEffect(() => {
    fetchJobs();
    fetchDashboard();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs");
      setJobs(res.data.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/dashboard/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const skillData = [
    { name: "Frontend", value: 35 },
    { name: "Backend", value: 30 },
    { name: "Database", value: 20 },
    { name: "Cloud", value: 15 }
  ];

  const applicationData = [
    { month: "Jan", applications: 5 },
    { month: "Feb", applications: 8 },
    { month: "Mar", applications: 12 },
    { month: "Apr", applications: 15 },
    { month: "May", applications: 10 }
  ];

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="container py-4 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div
        className="p-5 rounded-4 shadow-sm mb-4 text-white position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)"
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <span className="badge bg-light text-primary mb-2 px-3 py-1 fw-bold">CANDIDATE PANEL</span>
          <h1 className="fw-bold mb-2">Welcome Back, {stats.name || user.name} 👋</h1>
          <p className="mb-0 text-white-50 lead fs-6">
            Track your resume performance, ATS score, job applications, and interview readiness.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <span className="text-muted fw-medium d-block mb-2 text-uppercase" style={{ fontSize: "12px", letterSpacing: "1px" }}>Resume Score</span>
              <h1 className="display-4 text-primary fw-bold mb-0">{stats.resumeScore}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <span className="text-muted fw-medium d-block mb-2 text-uppercase" style={{ fontSize: "12px", letterSpacing: "1px" }}>ATS Match</span>
              <h1 className="display-4 text-success fw-bold mb-0">{stats.atsScore}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <span className="text-muted fw-medium d-block mb-2 text-uppercase" style={{ fontSize: "12px", letterSpacing: "1px" }}>Applications</span>
              <h1 className="display-4 text-warning fw-bold mb-0">{stats.applications}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <span className="text-muted fw-medium d-block mb-2 text-uppercase" style={{ fontSize: "12px", letterSpacing: "1px" }}>Interviews</span>
              <h1 className="display-4 text-danger fw-bold mb-0">{stats.interviews}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Quick Actions</h5>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/resume" className="btn btn-primary d-flex align-items-center gap-2">
              <FaUpload /> Upload Resume
            </Link>
            <Link to="/resume-analyzer" className="btn btn-success d-flex align-items-center gap-2">
              <FaFileAlt /> Analyze Resume
            </Link>
            <Link to="/jobs" className="btn btn-warning text-dark d-flex align-items-center gap-2">
              <FaBriefcase /> Browse Jobs
            </Link>
            <Link to="/my-applications" className="btn btn-secondary d-flex align-items-center gap-2">
              <FaListAlt /> Applications
            </Link>
            <Link to="/profile" className="btn btn-info text-dark d-flex align-items-center gap-2">
              <FaUser /> View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">ATS Compatibility Analysis</h5>
              <div className="row g-3 text-center">
                <div className="col-md-4 col-12">
                  <ATSScoreCircle score={stats.resumeScore} title="Resume Score" />
                </div>
                <div className="col-md-4 col-12">
                  <ATSScoreCircle score={stats.atsScore} title="ATS Match" />
                </div>
                <div className="col-md-4 col-12">
                  <ATSScoreCircle score={stats.resumeScore > 0 ? 80 : 0} title="Interview Ready" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaLightbulb className="text-warning" /> Career Tips
              </h5>
              <ul className="list-group list-group-flush" style={{ background: "transparent" }}>
                <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex gap-2 align-items-start">
                  <span>🚀</span> <span>Learn high-demand cloud technologies like Docker & AWS.</span>
                </li>
                <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex gap-2 align-items-start">
                  <span>💡</span> <span>Integrate key ATS keywords from target job descriptions into your resume.</span>
                </li>
                <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex gap-2 align-items-start">
                  <span>💻</span> <span>Solve basic DSA concepts (linked list, strings, arrays) daily.</span>
                </li>
                <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex gap-2 align-items-start">
                  <span>🤖</span> <span>Practice questions inside our mock **AI Interview Generator** page.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Skills Domain Distribution</h5>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={skillData} dataKey="value" outerRadius={90} label>
                      {skillData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Applications Submission Trend</h5>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Recommended Jobs</h4>
            <Link to="/jobs" className="btn btn-sm btn-outline-primary">Browse All</Link>
          </div>

          <div className="row g-3">
            {jobs.length === 0 ? (
              <div className="col-12 text-center py-4 text-muted">No jobs available right now. Check back later!</div>
            ) : (
              jobs.map((job) => (
                <div className="col-md-6" key={job._id}>
                  <div className="card border-0 shadow-sm h-100 p-3" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--card-border)" }}>
                    <div className="card-body p-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold text-primary mb-0">{job.title}</h5>
                        <span className="badge bg-success-glow text-success fw-semibold">₹ {job.salary}</span>
                      </div>
                      <p className="mb-2 text-main fw-medium" style={{ fontSize: "14px" }}>🏢 {job.company}</p>
                      <div className="d-flex gap-2 align-items-center mb-3">
                        <span className="badge bg-light text-muted" style={{ fontSize: "11px" }}>📍 {job.location}</span>
                        {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="badge bg-primary-glow text-primary" style={{ fontSize: "11px" }}>{skill}</span>
                        ))}
                      </div>
                      <Link to="/jobs" className="btn btn-sm btn-outline-primary w-100">View Details & Apply</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
