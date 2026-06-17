import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaUsers, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";

function Applicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { jobId } = useParams();

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setApplications(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert(`Application marked as ${status}`);
      fetchApplicants();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Status Update Failed");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning text-dark";
    return "bg-danger";
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <div className="card border-0 shadow-sm p-4">
        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <FaUsers className="text-primary" /> Active Job Applicants ({applications.length})
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading applicants...</span>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h5>No applicants have applied yet</h5>
            <p className="small mb-0">Hiring requisitions take time. Shared matches will show up here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Email</th>
                  <th className="text-center">ATS Score</th>
                  <th>Current Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="fw-bold text-main">{app.applicant?.name || "Unknown Candidate"}</div>
                      <Link 
                        to={`/proctor-report/${app.applicant?._id}`} 
                        className="small text-primary d-flex align-items-center gap-1 mt-1 text-decoration-none"
                        style={{ fontSize: "11px" }}
                      >
                        🛡️ View Proctoring Logs
                      </Link>
                    </td>
                    <td>
                      <span className="text-muted">{app.applicant?.email || "N/A"}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${getScoreBadgeColor(app.atsScore || 0)}`} style={{ fontSize: "13px" }}>
                        {app.atsScore || 0}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-primary-glow text-primary`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => updateStatus(app._id, "Shortlisted")}
                          disabled={app.status === "Shortlisted"}
                        >
                          Shortlist
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning text-dark"
                          onClick={() => updateStatus(app._id, "Interview")}
                          disabled={app.status === "Interview"}
                        >
                          Interview
                        </button>
                        <button
                          className="btn btn-sm btn-success d-flex align-items-center gap-1"
                          onClick={() => updateStatus(app._id, "Selected")}
                          disabled={app.status === "Selected"}
                        >
                          <FaCheck /> Select
                        </button>
                        <button
                          className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                          onClick={() => updateStatus(app._id, "Rejected")}
                          disabled={app.status === "Rejected"}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default Applicants;
