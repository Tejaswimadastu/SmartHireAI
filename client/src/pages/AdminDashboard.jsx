import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);

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

  return (
    <div className="container py-5">

      <h1 className="mb-4">
        Recruiter Dashboard
      </h1>

      <div className="row">

        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>{jobs.length}</h2>
              <p>Total Jobs</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>127</h2>
              <p>Applications</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>35</h2>
              <p>Interviews</p>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow">

        <div className="card-body">

          <h3>Posted Jobs</h3>

          <table className="table">

            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Applicants</th>
              </tr>
            </thead>

            <tbody>

              {jobs.map(job => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>
                    <a
                      href={`/applicants/${job._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;