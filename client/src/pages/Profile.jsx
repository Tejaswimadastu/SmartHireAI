import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaTrophy,
  FaCode
} from "react-icons/fa";

function Profile() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [stats, setStats] = useState({
    applications: 0,
    resumeScore: 0,
    atsScore: 0,
    interviews: 0
  });

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/user",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh"
      }}
    >
      <div className="card border-0 shadow-lg">

        {/* Header */}

        <div
          className="card-header text-white text-center py-5"
          style={{
            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)"
          }}
        >
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff&size=200`}
            alt="profile"
            className="rounded-circle border border-4 border-white"
            width="120"
            height="120"
          />

          <h2 className="mt-3 fw-bold">
            {user.name}
          </h2>

          <p className="mb-0">
            {user.role}
          </p>
        </div>

        <div className="card-body p-5">

          <div className="row">

            {/* User Details */}

            <div className="col-md-6 mb-4">

              <div className="card shadow border-0">
                <div className="card-body text-dark">

                  <h4>
                    <FaUser /> User Details
                  </h4>

                  <hr />

                  <p>
                    <strong>Name:</strong>{" "}
                    {user.name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {user.email}
                  </p>

                  <p>
                    <strong>Role:</strong>{" "}
                    {user.role}
                  </p>

                </div>
              </div>

            </div>

            {/* Career Stats */}

            <div className="col-md-6 mb-4">

              <div className="card shadow border-0">
                <div className="card-body text-dark">

                  <h4>
                    <FaBriefcase /> Career Stats
                  </h4>

                  <hr />

                  <p>
                    Applications:{" "}
                    <strong>
                      {stats.applications}
                    </strong>
                  </p>

                  <p>
                    Resume Score:{" "}
                    <strong>
                      {stats.resumeScore}
                    </strong>
                  </p>

                  <p>
                    ATS Score:{" "}
                    <strong>
                      {stats.atsScore}
                    </strong>
                  </p>

                  <p>
                    Interviews:{" "}
                    <strong>
                      {stats.interviews}
                    </strong>
                  </p>

                </div>
              </div>

            </div>

          </div>

          {/* Skills Section */}

          <div className="card shadow border-0 mb-4">

            <div className="card-body text-dark">

              <h4>
                <FaCode /> Skills
              </h4>

              <hr />

              <div className="d-flex flex-wrap gap-2">

                <span className="badge bg-primary">
                  React
                </span>

                <span className="badge bg-success">
                  Node.js
                </span>

                <span className="badge bg-warning text-dark">
                  Java
                </span>

                <span className="badge bg-danger">
                  Python
                </span>

                <span className="badge bg-info text-dark">
                  MongoDB
                </span>

              </div>

            </div>

          </div>

          {/* Achievements */}

          <div className="card shadow border-0">

            <div className="card-body text-dark">

              <h4>
                <FaTrophy /> Achievements
              </h4>

              <hr />

              <ul>
                <li>
                  Resume Uploaded
                </li>

                <li>
                  ATS Analysis Completed
                </li>

                <li>
                  Applied Jobs
                </li>

                <li>
                  Profile Created
                </li>
              </ul>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;