import { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/applications/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setApplications(res.data);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to load applications"
      );
    }
  };

  return (
    <div>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>No Applications Found</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px"
            }}
          >
            <h3>{app.job.title}</h3>

            <p>
              <strong>Company:</strong> {app.job.company}
            </p>

            <p>
              <strong>Status:</strong> {app.status}
            </p>

            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;