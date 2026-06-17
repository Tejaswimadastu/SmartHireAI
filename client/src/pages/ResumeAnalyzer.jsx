import { useState } from "react";
import axios from "axios";
import { FaFileAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";

function ResumeAnalyzer() {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    try {
      setLoading(true);
      setAnalysis("");
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "/api/ai/analyze-uploaded",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAnalysis(res.data.analysis);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          
          <div className="card border-0 shadow-sm p-4 p-md-5 text-center">
            <div className="p-3 bg-primary-glow text-primary rounded-circle mb-4" style={{ width: "70px", height: "70px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
              <FaFileAlt />
            </div>
            <h1 className="fw-bold mb-3">AI Resume Analyzer</h1>
            <p className="text-muted mb-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
              Run our deep-learning screening algorithm on your uploaded resume to see strengths, core gaps, and suitable engineering roles.
            </p>

            <button
              onClick={analyzeResume}
              className="btn btn-primary btn-lg px-5 py-3 shadow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner-border spinner-border-sm me-2" style={{ borderRightColor: "transparent" }} /> Analyzing Profile...
                </>
              ) : (
                "Analyze Uploaded Resume"
              )}
            </button>
          </div>

          {analysis && (
            <div className="card border-0 shadow-sm mt-4 p-4 p-md-5">
              <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                <FaCheckCircle className="text-success" /> AI Screening Summary
              </h3>
              <div
                className="p-4 rounded-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--card-border)",
                  fontFamily: "inherit"
                }}
              >
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "var(--text-main)",
                    margin: 0
                  }}
                >
                  {analysis}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
