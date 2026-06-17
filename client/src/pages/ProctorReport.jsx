import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaShieldAlt, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaHistory,
  FaFileAlt
} from "react-icons/fa";

function ProctorReport() {
  const { candidateId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProctorSessions();
  }, [candidateId]);

  const fetchProctorSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/interview/session/candidate/${candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const list = res.data.sessions || [];
      setSessions(list);
      if (list.length > 0) {
        setActiveSession(list[0]);
      }
    } catch (err) {
      console.error("Error fetching proctor sessions:", err);
      alert("Failed to load proctoring logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/dashboard" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <div className="row g-4">
        {/* Sidebar list of sessions */}
        <div className="col-lg-4 col-md-5">
          <div className="card border-0 shadow-sm p-4 sticky-lg-top" style={{ top: "90px" }}>
            <h5 className="fw-bold mb-3 text-main d-flex align-items-center gap-2">
              <FaHistory className="text-primary" /> Session History ({sessions.length})
            </h5>

            {loading ? (
              <div className="text-center py-5">
                <FaSpinner className="spinner-border text-primary spinner-border-sm" style={{ borderRightColor: "transparent" }} />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-muted small py-4 text-center">
                No mock interview sessions recorded for this candidate.
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {sessions.map((session) => (
                  <button
                    key={session._id}
                    className={`btn text-start p-3 border rounded-3 w-100 transition-all ${
                      activeSession?._id === session._id 
                        ? "btn-primary shadow-sm" 
                        : "btn-light bg-transparent hover-bg-light"
                    }`}
                    onClick={() => setActiveSession(session)}
                    style={{ border: "1px solid var(--card-border) !important" }}
                  >
                    <div className="fw-bold small mb-1">
                      {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className={`badge ${
                        activeSession?._id === session._id ? "bg-white text-primary" : "bg-primary-glow text-primary"
                      } small`} style={{ fontSize: "11px" }}>
                        {session.category}
                      </span>
                      <span className="fw-bold small">{session.overallScore}% score</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Proctoring log evaluation detail report */}
        <div className="col-lg-8 col-md-7">
          {activeSession ? (
            <div className="card border-0 shadow-sm p-4 p-md-5">
              
              <div className="d-flex flex-wrap justify-content-between align-items-center pb-4 border-bottom mb-4 gap-3">
                <div>
                  <h3 className="fw-bold mb-1 text-main">Proctor Integrity Report</h3>
                  <p className="text-muted small mb-0">
                    Candidate: <strong className="text-main">{activeSession.candidateName}</strong> | Mode: {activeSession.category} Assessment
                  </p>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>
                  Print Report
                </button>
              </div>

              {/* Assessment Dials */}
              <div className="row g-3 text-center mb-5">
                <div className="col-4">
                  <div className="p-3 border rounded-4 bg-light">
                    <span className="small text-muted d-block mb-2 text-uppercase" style={{ fontSize: "11px" }}>Grade Score</span>
                    <h4 className="fw-bold mb-0 text-primary">{activeSession.overallScore}%</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border rounded-4 bg-light">
                    <span className="small text-muted d-block mb-2 text-uppercase" style={{ fontSize: "11px" }}>Integrity Score</span>
                    <h4 className={`fw-bold mb-0 ${
                      activeSession.suspicionScore >= 60 ? "text-danger" : activeSession.suspicionScore >= 30 ? "text-warning" : "text-success"
                    }`}>{100 - activeSession.suspicionScore}%</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border rounded-4 bg-light">
                    <span className="small text-muted d-block mb-2 text-uppercase" style={{ fontSize: "11px" }}>Hiring Tag</span>
                    <span className={`badge px-2 py-1 fw-bold ${
                      activeSession.hiringRecommendation === "Strong Hire" ? "bg-success text-white" :
                      activeSession.hiringRecommendation === "Hire" ? "bg-success text-white" :
                      activeSession.hiringRecommendation === "Maybe" ? "bg-warning text-dark" : "bg-danger text-white"
                    }`} style={{ fontSize: "12px" }}>
                      {activeSession.hiringRecommendation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proctor Assessment feedback summary */}
              <div className="card border p-4 rounded-4 mb-5" style={{ background: "rgba(239, 68, 68, 0.02)" }}>
                <h5 className="fw-bold text-danger d-flex align-items-center gap-2 mb-3">
                  🛡️ Integrity Assurance Summary
                </h5>
                <p className="text-muted mb-3 small" style={{ lineHeight: "1.6" }}>{activeSession.proctorFeedback}</p>
                <div className="small text-muted">
                  • Suspicion Violations Count: <strong>{activeSession.violations?.length || 0}</strong> <br />
                  • Interview Status: <strong>{activeSession.status}</strong> <br />
                  • Session Elapsed Timer: <strong>{activeSession.durationSeconds} seconds</strong>
                </div>

                {/* Screenshot evidence list */}
                {activeSession.violations && activeSession.violations.length > 0 && (
                  <div className="mt-4">
                    <h6 className="fw-bold text-main mb-3">Suspicion Screenshot Logs:</h6>
                    <div className="row g-3">
                      {activeSession.violations.map((v, i) => (
                        <div className="col-md-4 col-sm-6" key={i}>
                          <div className="border rounded-3 p-2 bg-white text-center">
                            {v.screenshot ? (
                              <img src={v.screenshot} alt="Integrity Breach" className="img-fluid rounded mb-2" style={{ maxHeight: "125px" }} />
                            ) : (
                              <div className="w-100 bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: "100px" }}>No Screenshot</div>
                            )}
                            <div className="fw-bold small text-danger mb-0 text-truncate">{v.violationType}</div>
                            <small className="text-muted" style={{ fontSize: "9px" }}>{new Date(v.timestamp).toLocaleTimeString()}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Questions transcript */}
              <div>
                <h5 className="fw-bold text-primary mb-4">Mock Interview Transcript Log</h5>
                <div className="d-flex flex-column gap-4">
                  {activeSession.questions.map((q, i) => (
                    <div className="border rounded-4 p-4 bg-light" key={i}>
                      <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-2 flex-wrap gap-2">
                        <h6 className="fw-bold text-main mb-0" style={{ maxWidth: "80%" }}>#{i + 1} {q.questionText}</h6>
                        <span className="badge bg-primary px-3 py-1 fw-semibold">Graded: {q.score}/100</span>
                      </div>
                      
                      <div className="mb-3">
                        <strong className="small text-muted d-block mb-1">Answer Speech Transcript:</strong>
                        <p className="font-monospace small bg-white p-3 border rounded-3 text-main mb-0">{q.transcribedAnswer || "(No answer speech recorded)"}</p>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <strong className="small text-muted d-block mb-1">Assessor Critique:</strong>
                          <p className="small text-main mb-0" style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}>{q.feedback}</p>
                        </div>
                        <div className="col-md-6">
                          <strong className="small text-success d-block mb-1">Suggested Ideal Answer:</strong>
                          <p className="small text-muted mb-0" style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}>{q.modelAnswer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="card border-0 shadow-sm p-5 text-center text-muted">
              <FaFileAlt className="fs-1 text-muted mb-3" />
              <h5>Select a practice session from the sidebar to review details</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProctorReport;
