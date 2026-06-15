import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import ATSScoreCircle from "../components/ATSScoreCircle";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

function Dashboard() {
  const [jobs, setJobs] = useState([]);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    {};

  const [stats, setStats] = useState({
  resumeScore: 0,
  atsScore: 0,
  applications: 0,
  interviews: 0
});
  useEffect(() => {
  fetchJobs();
  fetchDashboard();
}, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs"
      );

      setJobs(res.data.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDashboard = async () => {
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
const skillData = [
  {
    name: "Frontend",
    value: 35
  },
  {
    name: "Backend",
    value: 30
  },
  {
    name: "Database",
    value: 20
  },
  {
    name: "Cloud",
    value: 15
  }
];
  

  const applicationData = [
    { month: "Jan", applications: 5 },
    { month: "Feb", applications: 8 },
    { month: "Mar", applications: 12 },
    { month: "Apr", applications: 15 },
    { month: "May", applications: 10 }
  ];

  const COLORS = [
    "#4f46e5",
    "#10b981",
    "#f59e0b",
    "#ef4444"
  ];

  return (
    <div
      className="container-fluid p-4"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right,#eef2ff,#f8fafc)"
      }}
    >
      {/* Hero Section */}

      <div
        className="p-4 rounded shadow mb-4 text-white"
        style={{
          background:
            "linear-gradient(135deg,#4f46e5,#7c3aed)"
        }}
      >
        <h1 className="fw-bold">
  Welcome Back, {stats.name || user.name} 👋
</h1>

        <p className="mb-0">
          Track your resume performance,
          ATS score, job applications,
          and interview readiness.
        </p>
      </div>

      {/* Stats Cards */}

      <div className="row">

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Resume Score
              </h6>

              <h1 className="text-primary fw-bold">
                {stats.resumeScore}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                ATS Score
              </h6>

              <h1 className="text-success fw-bold">
                {stats.atsScore}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Applications
              </h6>

              <h1 className="text-warning fw-bold">
                {stats.applications}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Interviews
              </h6>

              <h1 className="text-danger fw-bold">
                {stats.interviews}
              </h1>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}

      <div className="card shadow border-0 mb-4">
        <div className="card-body">

          <h4 className="mb-3">
            Quick Actions
          </h4>

          <div className="d-flex gap-3 flex-wrap">

            <div className="d-flex gap-3 flex-wrap">

  <Link
    to="/resume"
    className="btn btn-primary"
  >
    Upload Resume
  </Link>

  <Link
    to="/resume-analyzer"
    className="btn btn-success"
  >
    Analyze Resume
  </Link>

  <Link
    to="/jobs"
    className="btn btn-warning"
  >
    Browse Jobs
  </Link>

  <Link
    to="/profile"
    className="btn btn-info"
  >
    Profile
  </Link>

</div>

            <a
              href="/resume-analyzer"
              className="btn btn-success"
            >
              Analyze Resume
            </a>

            <a
              href="/jobs"
              className="btn btn-warning"
            >
              Browse Jobs
            </a>

            <a
              href="/profile"
              className="btn btn-info"
            >
              Profile
            </a>

          </div>

        </div>
      </div>

      {/* Analytics */}

      <div className="row">

        <div className="col-md-8 mb-4">
          <div className="card shadow border-0">
            <div className="card-body">

              <h4 className="text-center mb-4">
                Profile Analytics
              </h4>

              <div className="row">

                <div className="col-md-4">
                  <ATSScoreCircle
                    score={stats.resumeScore}
                    title="Resume Score"
                  />
                </div>

                <div className="col-md-4">
                  <ATSScoreCircle
                    score={stats.atsScore}
                    title="ATS Match"
                  />
                </div>

                <div className="col-md-4">
                  <ATSScoreCircle
                    score={75}
                    title="Interview Ready"
                  />
                </div>

              </div>

            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow border-0">
            <div className="card-body">

              <h4>Career Tips</h4>

              <ul>
                <li>Learn Docker</li>
                <li>Learn AWS</li>
                <li>Improve DSA</li>
                <li>Build Projects</li>
                <li>Practice Interviews</li>
              </ul>

            </div>
          </div>
        </div>

      </div>

      {/* Charts */}

      <div className="row">

        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-body">

              <h4 className="mb-3">
                Skills Distribution
              </h4>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>
                  <Pie
                    data={skillData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    {skillData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-body">

              <h4 className="mb-3">
                Applications Trend
              </h4>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart
                  data={applicationData}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="applications"
                    fill="#4f46e5"
                  />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>

      </div>

      {/* Jobs */}

      <div className="card shadow border-0">
        <div className="card-body">

          <h3 className="mb-4">
            Recommended Jobs
          </h3>

          <div className="row">

            {jobs.map((job) => (
              <div
                className="col-md-6 mb-3"
                key={job._id}
              >
                <div className="card border h-100">
                  <div className="card-body">

                    <h5>{job.title}</h5>

                    <p>
                      <strong>
                        Company:
                      </strong>{" "}
                      {job.company}
                    </p>

                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {job.location}
                    </p>

                    <p>
                      <strong>
                        Salary:
                      </strong>{" "}
                      ₹{job.salary}
                    </p>

                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;