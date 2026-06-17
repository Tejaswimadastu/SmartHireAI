import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrophy, FaListOl, FaUser } from "react-icons/fa";

function CandidateRanking() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const fetchRecruiterJobs = async () => {
    try {
      const res = await axios.get("/api/jobs");
      const user = JSON.parse(localStorage.getItem("user")) || {};
      // Filter jobs posted by this recruiter
      const recruiterJobs = res.data.filter(job => job.postedBy === user.id || job.postedBy?._id === user.id);
      setJobs(recruiterJobs);
      if (recruiterJobs.length > 0) {
        setSelectedJobId(recruiterJobs[0]._id);
        fetchRankedCandidates(recruiterJobs[0]._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchRankedCandidates = async (jobId) => {
    if (!jobId) return;
    try {
      setLoadingCandidates(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/applications/applicants/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCandidates(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load rankings");
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    fetchRankedCandidates(jobId);
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      
      <div className="card border-0 shadow-sm p-4 mb-4">
        <h2 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <FaTrophy className="text-warning animate-pulse" /> ATS Candidate Leaderboard
        </h2>
        <p className="text-muted mb-4">
          Select an active job requisition below to view matching candidate profiles sorted by their parsed ATS scores.
        </p>

        {loadingJobs ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <h5>No requisitions found</h5>
            <p className="small mb-3">You must post a job and receive applications before generating leaderboards.</p>
            <Link to="/admin" className="btn btn-primary btn-sm">Post New Job</Link>
          </div>
        ) : (
          <div className="mb-3" style={{ maxWidth: "400px" }}>
            <label className="form-label fw-semibold">Select Job Requisition</label>
            <select
              className="form-select form-control"
              value={selectedJobId}
              onChange={handleJobChange}
            >
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.title} - {job.company}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedJobId && (
        <div className="card border-0 shadow-sm p-4">
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
            <FaListOl /> Candidate Standings
          </h4>

          {loadingCandidates ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading standings...</span>
              </div>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No applications received yet for this job</h5>
              <p className="small mb-0">Matches will populate dynamically when job seekers submit profiles.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Candidate Name</th>
                    <th>Email Address</th>
                    <th className="text-center">ATS Match</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((cand, index) => (
                    <tr key={cand._id}>
                      <td>
                        <span className={`badge ${index === 0 ? "bg-warning text-dark fw-bold" : index === 1 ? "bg-secondary text-white fw-bold" : "bg-light text-muted"}`} style={{ fontSize: "12px" }}>
                          #{index + 1}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-main d-flex align-items-center gap-2">
                          <FaUser className="text-muted" style={{ fontSize: "13px" }} />
                          {cand.applicant?.name || "Unknown Candidate"}
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{cand.applicant?.email || "N/A"}</span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${
                          cand.atsScore >= 80 ? "bg-success" : cand.atsScore >= 50 ? "bg-warning text-dark" : "bg-danger"
                        }`} style={{ fontSize: "13px" }}>
                          {cand.atsScore || 0}%
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-muted">
                          {cand.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default CandidateRanking;
