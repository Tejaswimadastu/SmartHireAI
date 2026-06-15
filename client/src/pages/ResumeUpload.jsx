import { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("UPLOAD RESPONSE:", res.data);

      alert("Resume Uploaded Successfully");
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      console.log("UPLOAD ERROR RESPONSE:", error.response);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Upload Failed"
      );
    }
  };

  const analyzeResume = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/ai/analyze-uploaded",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("AI RESPONSE:", res.data);

      setAnalysis(res.data.analysis);

      alert("Analysis Success");
    } catch (error) {
      console.log("ANALYSIS ERROR:", error);
      console.log("ANALYSIS RESPONSE:", error.response);

      alert(
        JSON.stringify(error.response?.data) ||
        error.message
      );
    }
  };

  return (
    <div className="container mt-5">
      <h1>Resume Upload & Analysis</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button
        className="btn btn-primary"
        onClick={uploadResume}
      >
        Upload Resume
      </button>

      <button
        className="btn btn-success ms-2"
        onClick={analyzeResume}
      >
        Analyze Resume
      </button>

      <br />
      <br />

      {analysis && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h3>AI Analysis</h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit"
            }}
          >
            {analysis}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;