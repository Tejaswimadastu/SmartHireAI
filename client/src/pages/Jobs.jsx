import { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs"
      );

      setJobs(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const applyJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Application Submitted");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed"
      );
    }
  };

  const checkMatch = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/ai/match/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAnalysis(res.data.analysis);

    } catch (error) {
      console.log(error);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">

      <h1 className="mb-4 text-center">
        Available Jobs
      </h1>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search Jobs..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="row">

        {filteredJobs.map(job => (

          <div
            key={job._id}
            className="col-md-6 mb-4"
          >

            <div
              className="card shadow border-0 h-100"
              style={{
                borderRadius: "20px"
              }}
            >

              <div className="card-body">

                <h3>
                  {job.title}
                </h3>

                <span className="badge bg-primary me-2">
                  {job.location}
                </span>

                <span className="badge bg-success">
                  ₹ {job.salary}
                </span>

                <hr />

                <p>
                  <strong>Company:</strong>{" "}
                  {job.company}
                </p>

                <p>
                  {job.description}
                </p>

                <div className="d-flex gap-2">

                  <button
                    className="btn btn-success"
                    onClick={() =>
                      applyJob(job._id)
                    }
                  >
                    Apply
                  </button>

                  <button
                    className="btn btn-info"
                    onClick={() =>
                      checkMatch(job._id)
                    }
                  >
                    ATS Match
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {analysis && (

        <div className="card mt-5 shadow">

          <div className="card-body">

            <h2>
              ATS Analysis
            </h2>

            <pre
              style={{
                whiteSpace: "pre-wrap"
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

export default Jobs;