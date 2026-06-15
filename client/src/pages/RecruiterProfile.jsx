function RecruiterProfile() {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    {};

  return (
    <div className="container py-5">
      <div className="card shadow border-0">
        <div className="card-body">

          <h2>Recruiter Profile</h2>

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
            Recruiter
          </p>

        </div>
      </div>
    </div>
  );
}

export default RecruiterProfile;