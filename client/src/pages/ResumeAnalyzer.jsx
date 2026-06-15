import { useState } from "react";
import axios from "axios";

function ResumeAnalyzer() {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/ai/analyze-uploaded",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAnalysis(res.data.analysis);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Analysis Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      <div className="card shadow border-0">

        <div className="card-body text-center">

          <h1 className="mb-4">
            📄 Resume Analyzer
          </h1>

          <p>
            Analyze your uploaded resume
            and get ATS insights.
          </p>

          <button
            onClick={analyzeResume}
            className="btn btn-primary btn-lg"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Resume"}
          </button>

        </div>

      </div>

      {analysis && (
        <div className="card shadow border-0 mt-5">

          <div className="card-body">

            <h2 className="mb-4">
              AI Analysis
            </h2>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit"
              }}
            >
              {analysis}
            </pre>

          </div>

        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;