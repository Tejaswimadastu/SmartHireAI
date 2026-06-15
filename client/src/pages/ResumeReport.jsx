import { useState } from "react";

function ResumeReport() {
  const [report] = useState({
    resumeScore: 92,
    atsScore: 84,
    skills: [
      "Java",
      "React",
      "Node.js",
      "SQL",
      "Git"
    ],
    missingSkills: [
      "Docker",
      "AWS",
      "Kubernetes"
    ]
  });

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh"
      }}
    >
      <div className="card shadow-lg border-0">

        <div
          className="card-header text-white text-center"
          style={{
            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)"
          }}
        >
          <h1>
            Resume Report
          </h1>
        </div>

        <div className="card-body">

          <div className="row text-center">

            <div className="col-md-6">
              <h2 className="text-primary">
                {report.resumeScore}
              </h2>

              <p>
                Resume Score
              </p>
            </div>

            <div className="col-md-6">
              <h2 className="text-success">
                {report.atsScore}
              </h2>

              <p>
                ATS Score
              </p>
            </div>

          </div>

          <hr />

          <h4>
            Skills
          </h4>

          <div className="mb-4">

            {report.skills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="badge bg-success me-2 mb-2"
                >
                  {skill}
                </span>
              )
            )}

          </div>

          <h4>
            Missing Skills
          </h4>

          <div className="mb-4">

            {report.missingSkills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="badge bg-danger me-2 mb-2"
                >
                  {skill}
                </span>
              )
            )}

          </div>

          <div
            className="alert alert-warning"
          >
            Learn Docker, AWS and
            Kubernetes to improve
            ATS score.
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              window.print()
            }
          >
            Download PDF
          </button>

        </div>

      </div>
    </div>
  );
}

export default ResumeReport;