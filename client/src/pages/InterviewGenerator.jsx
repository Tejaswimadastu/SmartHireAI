import { useState } from "react";
import axios from "axios";

function InterviewGenerator() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/interview/questions",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuestions(res.data.questions || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to generate interview questions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh"
      }}
    >
      <div className="card shadow border-0">

        <div className="card-body text-center">

          <h1 className="fw-bold mb-3">
            🤖 AI Interview Generator
          </h1>

          <p className="text-muted mb-4">
            Generate personalized interview questions
            based on your uploaded resume.
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={generateQuestions}
            disabled={loading}
          >
            {loading
              ? "Generating Questions..."
              : "Generate Questions"}
          </button>

        </div>

      </div>

      {questions.length > 0 && (
        <div className="card mt-4 shadow border-0">

          <div className="card-body">

            <h3 className="mb-4">
              🎯 Resume Based Interview Questions
            </h3>

            {questions.map(
              (question, index) => (
                <div
                  key={index}
                  className="card mb-3 border-start border-primary border-4"
                >
                  <div className="card-body">

                    <h6 className="fw-bold">
                      Question {index + 1}
                    </h6>

                    <p className="mb-0">
                      {question}
                    </p>

                  </div>
                </div>
              )
            )}

          </div>

        </div>
      )}

      {questions.length === 0 && !loading && (
        <div className="text-center mt-5">

          <h5 className="text-muted">
            No questions generated yet.
          </h5>

          <p>
            Upload and analyze your resume first.
          </p>

        </div>
      )}

    </div>
  );
}

export default InterviewGenerator;