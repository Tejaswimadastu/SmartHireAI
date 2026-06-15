import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#4f46e5,#7c3aed)"
        }}
      >
        <div className="container">

          <div className="row align-items-center">

            <div className="col-md-6">

              <h1
                className="fw-bold"
                style={{
                  fontSize: "60px"
                }}
              >
                SmartHire AI
              </h1>

              <h3 className="mb-4">
                AI Powered Resume Screening &
                Job Matching Platform
              </h3>

              <p className="lead">
                Upload your resume, get ATS
                scores, skill analysis,
                interview questions and find
                your dream job faster.
              </p>

              <div className="mt-4">

                <Link
                  to="/register"
                  className="btn btn-light btn-lg me-3"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg"
                >
                  Login
                </Link>

              </div>

            </div>

            <div className="col-md-6 text-center">

              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="hero"
                width="350"
              />

            </div>

          </div>

        </div>
      </section>

      {/* Features */}

      <section className="container py-5">

        <h1 className="text-center mb-5">
          Platform Features
        </h1>

        <div className="row">

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body text-center">

                <h2>📄</h2>

                <h4>
                  Resume Analysis
                </h4>

                <p>
                  Analyze resumes and
                  discover strengths,
                  weaknesses and skills.
                </p>

              </div>

            </div>

          </div>

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body text-center">

                <h2>🎯</h2>

                <h4>
                  ATS Matching
                </h4>

                <p>
                  Compare resumes with
                  job descriptions and
                  calculate ATS score.
                </p>

              </div>

            </div>

          </div>

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 h-100">

              <div className="card-body text-center">

                <h2>💼</h2>

                <h4>
                  Job Applications
                </h4>

                <p>
                  Apply for jobs and
                  track application
                  status.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section
        className="py-5 text-white"
        style={{
          background: "#111827"
        }}
      >

        <div className="container">

          <div className="row text-center">

            <div className="col-md-3">

              <h1>1000+</h1>

              <p>Resumes Analyzed</p>

            </div>

            <div className="col-md-3">

              <h1>500+</h1>

              <p>Jobs Posted</p>

            </div>

            <div className="col-md-3">

              <h1>95%</h1>

              <p>ATS Accuracy</p>

            </div>

            <div className="col-md-3">

              <h1>300+</h1>

              <p>Successful Hires</p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="container py-5 text-center">

        <h1>
          Ready To Get Hired?
        </h1>

        <p className="lead">
          Start your AI-powered job
          search journey today.
        </p>

        <Link
          to="/register"
          className="btn btn-primary btn-lg"
        >
          Join SmartHire AI
        </Link>

      </section>
    </>
  );
}

export default Home;