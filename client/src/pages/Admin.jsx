import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [jobs, setJobs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: "",
    description: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs"
      );

      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/jobs",
        {
          ...formData,
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Job Posted Successfully");

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        skills: "",
        description: ""
      });

      fetchJobs();
    } catch (err) {
      console.log(err);
      alert("Failed to post job");
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh"
      }}
    >
      <h1 className="fw-bold mb-4">
        Recruiter Dashboard
      </h1>

      <div className="card shadow border-0 mb-5">
        <div className="card-body">

          <h3 className="mb-4">
            Post New Job
          </h3>

          <form onSubmit={submitHandler}>

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              className="form-control mb-3"
              value={formData.title}
              onChange={changeHandler}
              required
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              className="form-control mb-3"
              value={formData.company}
              onChange={changeHandler}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              className="form-control mb-3"
              value={formData.location}
              onChange={changeHandler}
            />

            <input
              type="text"
              name="salary"
              placeholder="Salary"
              className="form-control mb-3"
              value={formData.salary}
              onChange={changeHandler}
            />

            <input
              type="text"
              name="skills"
              placeholder="React, Node.js, MongoDB"
              className="form-control mb-3"
              value={formData.skills}
              onChange={changeHandler}
            />

            <textarea
              rows="5"
              name="description"
              placeholder="Job Description"
              className="form-control mb-3"
              value={formData.description}
              onChange={changeHandler}
            />

            <button
              className="btn btn-primary"
            >
              Post Job
            </button>

          </form>

        </div>
      </div>

      <div className="card shadow border-0">
        <div className="card-body">

          <h3 className="mb-4">
            Posted Jobs
          </h3>

          <div className="row">

            {jobs.map((job) => (
              <div
                key={job._id}
                className="col-md-6 mb-3"
              >
                <div className="card border h-100">

                  <div className="card-body">

                    <h5>
                      {job.title}
                    </h5>

                    <p>
                      <strong>Company:</strong>{" "}
                      {job.company}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {job.location}
                    </p>

                    <p>
                      <strong>Salary:</strong>{" "}
                      {job.salary}
                    </p>

                    <p>
                      <strong>Skills:</strong>{" "}
                      {job.skills?.join(", ")}
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

export default Admin;