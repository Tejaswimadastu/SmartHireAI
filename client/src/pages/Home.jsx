import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "85vh",
          background: "linear-gradient(135deg, hsl(243, 75%, 59%) 0%, #6d28d9 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glow decorative bubbles */}
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          top: "-100px",
          right: "-100px",
          filter: "blur(50px)"
        }} />
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          bottom: "-50px",
          left: "-50px",
          filter: "blur(40px)"
        }} />

        <div className="container py-5" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-md-7">
              <span className="badge bg-light text-primary mb-3 px-3 py-2 fw-semibold" style={{ fontSize: "14px" }}>
                ✨ Next-Gen AI Recruitment
              </span>
              <h1
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(42px, 5vw, 64px)",
                  lineHeight: "1.1",
                  letterSpacing: "-2px"
                }}
              >
                SmartHire AI
              </h1>
              <h3 className="mb-4 text-white-50 fw-light">
                AI-Powered Resume Screening & Job Matching
              </h3>
              <p className="lead text-white-75 mb-4" style={{ maxWidth: "600px" }}>
                Upload your resume, compute real-time ATS match scores, discover missing skills, generate customized interview questions, and apply to your dream job instantly.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link
                  to="/register"
                  className="btn btn-light btn-lg px-4"
                  style={{ color: "var(--primary)", fontWeight: "600" }}
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="col-md-5 text-center mt-5 mt-md-0">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="SmartHire AI Hero"
                className="img-fluid"
                style={{ maxWidth: "80%", height: "auto", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.25))" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-5 my-5">
        <h2 className="text-center fw-bold mb-2">Platform Features</h2>
        <p className="text-center text-muted mb-5">State-of-the-art tools for candidates and recruiters</p>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card glass-card border-0 h-100 p-4">
              <div className="card-body text-center d-flex flex-column align-items-center">
                <div className="mb-4 p-3 text-primary rounded-circle" style={{ width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", background: "var(--primary-glow)" }}>
                  📄
                </div>
                <h4 className="fw-bold mb-3">Resume Analysis</h4>
                <p className="text-muted mb-0">
                  Analyze resumes instantly using Gemini AI to discover core strengths, skill gaps, and recommended software job titles.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card glass-card border-0 h-100 p-4">
              <div className="card-body text-center d-flex flex-column align-items-center">
                <div className="mb-4 p-3 text-success rounded-circle" style={{ width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", background: "var(--accent-glow)" }}>
                  🎯
                </div>
                <h4 className="fw-bold mb-3">ATS Job Matching</h4>
                <p className="text-muted mb-0">
                  Compare your resume against any job description. Receive a comprehensive match score, missing skills list, and alignment tips.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card glass-card border-0 h-100 p-4">
              <div className="card-body text-center d-flex flex-column align-items-center">
                <div className="mb-4 p-3 text-warning rounded-circle" style={{ width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", background: "rgba(245, 158, 11, 0.15)" }}>
                  💼
                </div>
                <h4 className="fw-bold mb-3">Job Applications</h4>
                <p className="text-muted mb-0">
                  Apply for relevant roles, track real-time hiring stages, and let recruiters see you ranked by your custom match score.
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
          background: "var(--primary)"
        }}
      >
        <div className="container py-4">
          <div className="row text-center g-4">
            <div className="col-md-3 col-6">
              <h1 className="fw-extrabold mb-1" style={{ fontSize: "42px" }}>1,200+</h1>
              <p className="text-white-75 mb-0">Resumes Analyzed</p>
            </div>
            <div className="col-md-3 col-6">
              <h1 className="fw-extrabold mb-1" style={{ fontSize: "42px" }}>500+</h1>
              <p className="text-white-75 mb-0">Jobs Posted</p>
            </div>
            <div className="col-md-3 col-6">
              <h1 className="fw-extrabold mb-1" style={{ fontSize: "42px" }}>98%</h1>
              <p className="text-white-75 mb-0">ATS Accuracy</p>
            </div>
            <div className="col-md-3 col-6">
              <h1 className="fw-extrabold mb-1" style={{ fontSize: "42px" }}>450+</h1>
              <p className="text-white-75 mb-0">Successful Hires</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-5 my-5 text-center">
        <h2 className="fw-bold mb-3">Ready to Accelerate Your Career?</h2>
        <p className="lead text-muted mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
          Join SmartHire AI today as a Candidate or Recruiter and experience automated, intelligent talent sourcing.
        </p>
        <Link
          to="/register"
          className="btn btn-primary btn-lg px-5 mt-3 shadow-lg"
          style={{ padding: "14px 32px", borderRadius: "12px" }}
        >
          Join SmartHire AI Now
        </Link>
      </section>
    </div>
  );
}

export default Home;
