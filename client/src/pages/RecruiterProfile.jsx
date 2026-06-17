import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaBuilding, FaEnvelope, FaBriefcase, FaTrophy } from "react-icons/fa";

function RecruiterProfile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
      const recruiterJobs = res.data.filter(job => job.postedBy === user.id || job.postedBy?._id === user.id);
      setJobCount(recruiterJobs.length);
    } catch (err) {
      console.log(err);
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
          className="card-header text-white text-center py-5 border-0"
          style={{
            background: "linear-gradient(135deg, var(--primary), #7c3aed)"
          }}
        >
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=4f46e5&size=200&bold=true`}
            alt="Recruiter profile avatar"
            className="rounded-circle border border-4 border-white shadow"
            width="120"
            height="120"
          />
          <h2 className="mt-3 fw-bold mb-1 text-white">{user.name}</h2>
          <span className="badge bg-light text-primary px-3 py-1.5 fw-semibold text-uppercase" style={{ fontSize: "12px", letterSpacing: "1px" }}>
            Recruiter
          </span>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="row g-4">
            {/* Recruiter details card */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                  <FaUser style={{ fontSize: "20px" }} /> Account Info
                </h4>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-primary-glow text-primary"><FaBuilding /></div>
                    <div>
                      <small className="text-muted d-block">Company</small>
                      <strong className="text-main">SmartHire AI Partner</strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-primary-glow text-primary"><FaEnvelope /></div>
                    <div>
                      <small className="text-muted d-block">Work Email</small>
                      <strong className="text-main">{user.email}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter statistics card */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                  <FaBriefcase style={{ fontSize: "20px" }} /> Recruitment Overview
                </h4>
                <div className="p-4 rounded-4 text-center" style={{ background: "var(--primary-glow)" }}>
                  <h1 className="fw-bold text-primary mb-1">{jobCount}</h1>
                  <span className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Active Requisitions Posted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Achievements checklist */}
          <div className="card border-0 shadow-sm mt-4 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <FaTrophy style={{ fontSize: "20px" }} /> Milestones Accomplished
            </h4>
            <ul className="list-group list-group-flush bg-transparent">
              <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex align-items-center gap-3">
                <span className="text-success" style={{ fontSize: "18px" }}>✔️</span>
                <span>Recruiter profile registered successfully</span>
              </li>
              <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex align-items-center gap-3">
                <span className={jobCount > 0 ? "text-success" : "text-muted"} style={{ fontSize: "18px" }}>
                  {jobCount > 0 ? "✔️" : "⚪"}
                </span>
                <span className={jobCount > 0 ? "" : "text-muted"}>Published first candidate recruitment requirement</span>
              </li>
              <li className="list-group-item bg-transparent text-main border-0 px-0 py-2 d-flex align-items-center gap-3">
                <span className="text-success" style={{ fontSize: "18px" }}>✔️</span>
                <span>Accessed live applicant leaderboard rankings</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

export default RecruiterProfile;