import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaBriefcase,
  FaTrophy,
  FaCode,
  FaEnvelope,
  FaUserTag
} from "react-icons/fa";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [stats, setStats] = useState({
    applications: 0,
    resumeScore: 0,
    atsScore: 0,
    interviews: 0,
    skills: [],
    missingSkills: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/dashboard/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(res.data);
    } catch (error) {
      console.log("Error fetching profile stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      <div className="card border-0 shadow-lg" style={{ borderRadius: "24px", overflow: "hidden" }}>
        
        {/* Header Banner */}
        <div
          className="card-header text-white text-center py-5 border-0 position-relative"
          style={{
            background: "linear-gradient(135deg, var(--primary), #7c3aed)"
          }}
        >
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=4f46e5&size=200&bold=true`}
            alt="User profile avatar"
            className="rounded-circle border border-4 border-white shadow"
            width="120"
            height="120"
          />
          <h2 className="mt-3 fw-bold mb-1 text-white">{user.name}</h2>
          <span className="badge bg-light text-primary px-3 py-1.5 fw-semibold text-uppercase" style={{ fontSize: "12px", letterSpacing: "1px" }}>
            {user.role}
          </span>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="row g-4">
            {/* User details card */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                  <FaUser style={{ fontSize: "20px" }} /> Candidate Profile
                </h4>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-primary-glow text-primary"><FaUser /></div>
                    <div>
                      <small className="text-muted d-block">Full Name</small>
                      <strong className="text-main">{user.name}</strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-primary-glow text-primary"><FaEnvelope /></div>
                    <div>
                      <small className="text-muted d-block">Email Address</small>
                      <strong className="text-main">{user.email}</strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-primary-glow text-primary"><FaUserTag /></div>
                    <div>
                      <small className="text-muted d-block">Access Role</small>
                      <strong className="text-main text-capitalize">{user.role}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Career stats card */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                  <FaBriefcase style={{ fontSize: "20px" }} /> Job Application Stats
                </h4>
                <div className="row g-3 text-center">
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: "var(--primary-glow)" }}>
                      <h3 className="fw-bold text-primary mb-1">{stats.applications}</h3>
                      <small className="text-muted">Applications</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: "var(--accent-glow)" }}>
                      <h3 className="fw-bold text-success mb-1">{stats.resumeScore}</h3>
                      <small className="text-muted">Resume Score</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                      <h3 className="fw-bold text-warning mb-1">{stats.atsScore}</h3>
                      <small className="text-muted">ATS Rating</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
                      <h3 className="fw-bold text-danger mb-1">{stats.interviews}</h3>
                      <small className="text-muted">Interviews</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills from Resume */}
          <div className="card border-0 shadow-sm mt-4 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <FaCode style={{ fontSize: "20px" }} /> Skills Extracted from Resume
            </h4>
            <div className="d-flex flex-wrap gap-2">
              {stats.skills && stats.skills.length > 0 ? (
                stats.skills.map((skill, index) => (
                  <span key={index} className="badge bg-primary-glow text-primary px-3 py-2 fw-medium" style={{ fontSize: "13px" }}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-muted">No parsed skills detected. Please upload and analyze your resume.</span>
              )}
            </div>
          </div>

          {/* Achievements Checklist */}
          <div className="card border-0 shadow-sm mt-4 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <FaTrophy style={{ fontSize: "20px" }} /> Account Milestones
            </h4>
            <ul className="list-group list-group-flush bg-transparent">
              <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex align-items-center gap-3">
                <span className="text-success" style={{ fontSize: "18px" }}>✔️</span>
                <span>Profile setup completed successfully</span>
              </li>
              <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex align-items-center gap-3">
                <span className={stats.resumeScore > 0 ? "text-success" : "text-muted"} style={{ fontSize: "18px" }}>
                  {stats.resumeScore > 0 ? "✔️" : "⚪"}
                </span>
                <span className={stats.resumeScore > 0 ? "" : "text-muted"}>Resume uploaded & screen analysis complete</span>
              </li>
              <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex align-items-center gap-3">
                <span className={stats.applications > 0 ? "text-success" : "text-muted"} style={{ fontSize: "18px" }}>
                  {stats.applications > 0 ? "✔️" : "⚪"}
                </span>
                <span className={stats.applications > 0 ? "" : "text-muted"}>Applied for first job match listing</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;
