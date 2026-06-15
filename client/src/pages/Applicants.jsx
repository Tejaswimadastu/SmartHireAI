import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Applicants() {
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  console.log("JOB ID:", jobId);
  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("APPLICANTS RESPONSE:", res.data);

      setApplications(res.data);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to load applicants"
      );
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(`Application ${status}`);

      fetchApplicants();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Status Update Failed"
      );
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Applicants</h1>

      {applications.length === 0 ? (
        <p>No Applicants Found</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            className="card mb-3"
          >
            <div className="card-body">
              <h4>{app.applicant.name}</h4>

              <p>
                <strong>Email:</strong>{" "}
                {app.applicant.email}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {app.status}
              </p>

              <button
                className="btn btn-success"
                onClick={() =>
                  updateStatus(app._id, "Accepted")
                }
              >
                Accept
              </button>

              <button
                className="btn btn-danger ms-2"
                onClick={() =>
                  updateStatus(app._id, "Rejected")
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Applicants;