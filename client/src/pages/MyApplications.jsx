import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaListAlt, FaCalendarAlt, FaBriefcase, FaBuilding } from "react-icons/fa";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/applications/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplications(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selected":
      case "Accepted":
        return "bg-success-glow text-success border border-success-glow";
      case "Shortlisted":
      case "Interview":
        return "bg-primary-glow text-primary border border-primary-glow";
      case "Rejected":
        return "bg-danger-glow text-danger border border-danger-glow";
      default:
        return "bg-secondary-glow text-muted border border-secondary-glow";
    }
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      <div className="card border-0 shadow-sm p-4">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <FaListAlt className="text-primary" /> My Applications
          </h2>
          <Link to="/jobs" className="btn btn-primary btn-sm">Find More Jobs</Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading applications...</span>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted mb-3">No applications found</h5>
            <p className="text-muted mb-4">You haven't applied to any job listings yet.</p>
            <Link to="/jobs" className="btn btn-primary px-4">Browse Jobs</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th className="text-center">ATS Match</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="fw-bold text-main d-flex align-items-center gap-2">
                        <FaBriefcase className="text-muted" style={{ fontSize: "14px" }} />
                        {app.job?.title || "Unknown Job Title"}
                      </div>
                    </td>
                    <td>
                      <div className="text-muted d-flex align-items-center gap-2">
                        <FaBuilding className="text-muted" style={{ fontSize: "14px" }} />
                        {app.job?.company || "Unknown Company"}
                      </div>
                    </td>
                    <td>
                      <div className="text-muted d-flex align-items-center gap-2">
                        <FaCalendarAlt className="text-muted" style={{ fontSize: "14px" }} />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        app.atsScore >= 80 ? "bg-success" : app.atsScore >= 50 ? "bg-warning text-dark" : "bg-danger"
                      }`}>
                        {app.atsScore || 0}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
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

export default MyApplications;