import { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaSpinner } from "react-icons/fa";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file");
      setFile(null);
    }
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setUploadedFilename(res.data.filename);
      alert("Resume Uploaded Successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const analyzeResume = async () => {
    setAnalyzing(true);
    setAnalysis("");
    try {
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
      alert("Analysis Success!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Analysis Failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          
          <div className="card border-0 shadow-sm p-4 p-md-5">
            <h2 className="fw-bold mb-3 text-center">Resume Management</h2>
            <p className="text-muted text-center mb-4">
              Upload your PDF resume to calculate compatibility ratings and custom interview questions.
            </p>

            {/* Drop Zone Area */}
            <div
              className="p-5 rounded-4 text-center mb-4 d-flex flex-column align-items-center justify-content-center"
              style={{
                border: "2px dashed var(--primary-glow)",
                background: "rgba(79, 70, 229, 0.02)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onClick={() => document.getElementById("resume-input").click()}
            >
              <input
                id="resume-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <FaCloudUploadAlt className="text-primary mb-3" style={{ fontSize: "56px", opacity: 0.8 }} />
              <h5 className="fw-bold mb-1">Click to browse file</h5>
              <p className="text-muted small mb-0">PDF files only (Max 5MB)</p>
            </div>

            {/* Selected File Details Card */}
            {file && (
              <div className="card border p-3 mb-4 rounded-3 d-flex flex-row align-items-center justify-content-between" style={{ background: "rgba(255,255,255,0.01)" }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-danger-glow rounded text-danger" style={{ fontSize: "24px" }}><FaFilePdf /></div>
                  <div style={{ wordBreak: "break-all" }}>
                    <strong className="d-block text-main">{file.name}</strong>
                    <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                  </div>
                </div>
                <span className="badge bg-light text-muted">Ready</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-3 justify-content-center">
              <button
                className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
                onClick={uploadResume}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="spinner-border spinner-border-sm" style={{ borderRightColor: "transparent" }} /> Uploading...
                  </>
                ) : (
                  "Upload Resume"
                )}
              </button>
              <button
                className="btn btn-success px-4 py-2 d-flex align-items-center gap-2"
                onClick={analyzeResume}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <FaSpinner className="spinner-border spinner-border-sm" style={{ borderRightColor: "transparent" }} /> Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>

          </div>

          {/* Analysis Report Card */}
          {analysis && (
            <div className="card border-0 shadow-sm mt-4 p-4 p-md-5">
              <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                <FaCheckCircle className="text-success" /> AI Screening Evaluation
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

export default ResumeUpload;
