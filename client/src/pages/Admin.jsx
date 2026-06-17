import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaBriefcase, FaUsers, FaMapMarkerAlt, FaWallet } from "react-icons/fa";

function Admin() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const res = await axios.get("http://localhost:5000/api/jobs");
      const user = JSON.parse(localStorage.getItem("user")) || {};
      // Filter jobs posted by this recruiter
      const recruiterJobs = res.data.filter(job => job.postedBy === user.id || job.postedBy?._id === user.id);
      setJobs(recruiterJobs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
            .filter(Boolean)
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Job Posted Successfully!");

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
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      
      {/* Header Banner */}
      <div
        className="p-5 rounded-4 shadow-sm mb-5 text-white position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)"
        }}
      >
        <span className="badge bg-light text-primary mb-2 px-3 py-1 fw-bold">RECRUITER WORKSPACE</span>
        <h1 className="fw-bold mb-2 text-white">Recruiter Dashboard</h1>
        <p className="mb-0 text-white-50 lead fs-6">
          Post new hiring requisites, track applications, and view candidate ATS profiles.
        </p>
      </div>

      <div className="row g-4">
        {/* Post new job form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4">
            <h4 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
              <FaPlusCircle /> Post New Requisition
            </h4>
            
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Lead Frontend Engineer"
                  className="form-control"
                  value={formData.title}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. SmartHire Tech"
                  className="form-control"
                  value={formData.company}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Job Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Hyderabad (Hybrid)"
                  className="form-control"
                  value={formData.location}
                  onChange={changeHandler}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Salary Package</label>
                <input
                  type="text"
                  name="salary"
                  placeholder="e.g. 15,00,000 - 20,00,000"
                  className="form-control"
                  value={formData.salary}
                  onChange={changeHandler}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Skills Requested (Comma Separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, MongoDB"
                  className="form-control"
                  value={formData.skills}
                  onChange={changeHandler}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Job Description</label>
                <textarea
                  rows="4"
                  name="description"
                  placeholder="Summarize key responsibilities, background, and project criteria..."
                  className="form-control"
                  value={formData.description}
                  onChange={changeHandler}
                  required
                />
              </div>

              <button className="btn btn-primary w-100 py-2.5">
                Publish Requisition
              </button>
            </form>
          </div>
        </div>

        {/* List of posted jobs */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4">
            <h4 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
              <FaBriefcase /> Active Requisitions ({jobs.length})
            </h4>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading jobs...</span>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h5>No jobs posted yet</h5>
                <p className="small mb-0">Use the form on the left to publish your first hiring requisition.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {jobs.map((job) => (
                  <div key={job._id} className="card border p-3 rounded-3" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--card-border)" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0 text-main">{job.title}</h5>
                      <span className="badge bg-success-glow text-success fw-semibold"><FaWallet className="me-1" /> {job.salary}</span>
                    </div>
                    
                    <p className="mb-2 text-primary fw-medium" style={{ fontSize: "14px" }}>🏢 {job.company}</p>
                    
                    <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
                      <span className="badge bg-light text-muted" style={{ fontSize: "11px" }}><FaMapMarkerAlt className="me-1" /> {job.location}</span>
                      {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="badge bg-primary-glow text-primary" style={{ fontSize: "11px" }}>{skill}</span>
                      ))}
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        to={`/applicants/${job._id}`}
                        className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      >
                        <FaUsers /> View Applicants
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Admin;