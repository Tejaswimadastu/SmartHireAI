import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ResumeReport() {
  const [report, setReport] = useState({
    resumeScore: 0,
    atsScore: 0,
    skills: [],
    missingSkills: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportDetails();
  }, []);

  const fetchReportDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/dashboard/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReport({
        resumeScore: res.data.resumeScore || 0,
        atsScore: res.data.atsScore || 0,
        skills: res.data.skills || [],
        missingSkills: res.data.missingSkills || []
      });
    } catch (error) {
      console.log("Error fetching report details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Report...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      <style>{`
        @media print {
          .print-hide, nav, .navbar, .btn {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .card {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="card shadow-lg border-0" style={{ borderRadius: "24px", overflow: "hidden" }}>
        
        <div
          className="card-header text-white text-center py-4 border-0"
          style={{
            background: "linear-gradient(135deg, var(--primary), #7c3aed)"
          }}
        >
          <span className="badge bg-light text-primary mb-2 px-3 fw-bold">SMARTHIRE AI REPORT</span>
          <h1 className="fw-bold mb-0 text-white">ATS Evaluation Report</h1>
        </div>

        <div className="card-body p-5">
          <div className="row text-center g-4 mb-4">
            <div className="col-md-6 col-6">
              <div className="p-4 rounded-4" style={{ background: "var(--primary-glow)" }}>
                <h1 className="text-primary fw-extrabold mb-1" style={{ fontSize: "56px" }}>{report.resumeScore}</h1>
                <p className="text-muted mb-0 fw-semibold">Overall Resume Score</p>
              </div>
            </div>

            <div className="col-md-6 col-6">
              <div className="p-4 rounded-4" style={{ background: "var(--accent-glow)" }}>
                <h1 className="text-success fw-extrabold mb-1" style={{ fontSize: "56px" }}>{report.atsScore}</h1>
                <p className="text-muted mb-0 fw-semibold">ATS Compatibility Rating</p>
              </div>
            </div>
          </div>

          <hr className="my-4" style={{ opacity: 0.1 }} />

          <h5 className="fw-bold mb-3">Identified Technical Skills</h5>
          <div className="mb-4">
            {report.skills.length === 0 ? (
              <span className="text-muted">No skills parsed yet. Try uploading your resume first!</span>
            ) : (
              report.skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge bg-primary-glow text-primary me-2 mb-2 px-3 py-2"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {skill}
                </span>
              ))
            )}
          </div>

          <h5 className="fw-bold mb-3">Identified Technical Skill Gaps</h5>
          <div className="mb-4">
            {report.missingSkills.length === 0 ? (
              <span className="text-success">🎉 Excellent! No high-demand missing skills identified.</span>
            ) : (
              report.missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="badge text-danger me-2 mb-2 px-3 py-2"
                  style={{ fontSize: "14px", fontWeight: "500", background: "rgba(239, 68, 68, 0.1)" }}
                >
                  {skill}
                </span>
              ))
            )}
          </div>

          {report.missingSkills.length > 0 && (
            <div className="alert alert-warning border-0 p-4 rounded-4 d-flex align-items-start gap-3 mb-4">
              <span style={{ fontSize: "24px" }}>💡</span>
              <div>
                <h6 className="fw-bold text-dark mb-1">Recommendation to boost your score:</h6>
                <p className="mb-0 text-dark opacity-75" style={{ fontSize: "14px" }}>
                  To increase your general ATS suitability, consider learning and adding **{report.missingSkills.join(", ")}** to your resume.
                </p>
              </div>
            </div>
          )}

          <div className="d-flex gap-3 mt-4 print-hide">
            <button
              className="btn btn-primary px-4 py-2"
              onClick={() => window.print()}
            >
              🖨️ Print / Download PDF
            </button>
            <Link to="/dashboard" className="btn btn-outline-secondary px-4 py-2">
              Back to Dashboard
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ResumeReport;
