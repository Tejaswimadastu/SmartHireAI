import { useEffect, useState } from "react";
import axios from "axios";
import { FaBriefcase, FaSearch, FaMapMarkerAlt, FaWallet, FaTimes } from "react-icons/fa";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [matchingJobTitle, setMatchingJobTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingMatchId, setLoadingMatchId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const applyJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/applications/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Application Submitted Successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Application Failed");
    }
  };

  const checkMatch = async (jobId, jobTitle) => {
    try {
      setLoadingMatch(true);
      setLoadingMatchId(jobId);
      setMatchingJobTitle(jobTitle);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/ai/match/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAnalysis(res.data.analysis);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert("Failed to compute ATS Match. Ensure your resume is uploaded.");
    } finally {
      setLoadingMatch(false);
      setLoadingMatchId(null);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Available Career Opportunities</h1>
        <p className="text-muted">Find matching jobs, compare your ATS compatibility, and apply in one click.</p>
      </div>

      {/* Search Input Card */}
      <div className="card border-0 shadow-sm mb-5 p-3">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-0 text-muted"><FaSearch /></span>
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            placeholder="Search by job title or company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "16px", boxShadow: "none" }}
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="row g-4">
        {filteredJobs.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            <h5>No matching jobs found. Try another term!</h5>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job._id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100 p-4" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--card-border)" }}>
                <div className="card-body p-0 d-flex flex-column h-100">
                  
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="fw-bold text-main mb-1">{job.title}</h4>
                      <strong className="text-primary d-block mb-2">🏢 {job.company}</strong>
                    </div>
                    <span className="badge bg-success-glow text-success fw-semibold"><FaWallet className="me-1" /> {job.salary}</span>
                  </div>

                  <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
                    <span className="badge bg-light text-muted" style={{ fontSize: "12px" }}><FaMapMarkerAlt className="me-1" /> {job.location}</span>
                    {job.skills && job.skills.map((skill, index) => (
                      <span key={index} className="badge bg-primary-glow text-primary" style={{ fontSize: "12px" }}>{skill}</span>
                    ))}
                  </div>

                  <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    {job.description}
                  </p>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-success flex-grow-1"
                      onClick={() => applyJob(job._id)}
                    >
                      Apply Now
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                      onClick={() => checkMatch(job._id, job.title)}
                      disabled={loadingMatch && loadingMatchId === job._id}
                    >
                      {loadingMatch && loadingMatchId === job._id ? "Evaluating..." : "ATS Match"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Glassmorphic ATS Match Modal Overlay */}
      {showModal && (
        <div
          className="modal-backdrop-blur d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 1050,
            padding: "20px animate-fade-in"
          }}
        >
          <div
            className="card glass-card border-0 shadow-lg p-4 animate-fade-in"
            style={{
              width: "600px",
              maxWidth: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-outline-secondary position-absolute"
              style={{ top: "20px", right: "20px", borderRadius: "50%", padding: "5px 10px" }}
              onClick={() => {
                setShowModal(false);
                setAnalysis("");
              }}
            >
              <FaTimes />
            </button>

            <h3 className="fw-bold mb-2">ATS Match Analysis</h3>
            <p className="text-muted small mb-4">Role: {matchingJobTitle}</p>
            
            <div
              className="p-4 rounded-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--card-border)"
              }}
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "var(--text-main)",
                  margin: 0
                }}
              >
                {analysis}
              </pre>
            </div>

            <button
              className="btn btn-primary mt-4 w-100"
              onClick={() => {
                setShowModal(false);
                setAnalysis("");
              }}
            >
              Close Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Jobs;
