import { Navigate } from "react-router-dom";

function JobSeekerRoute({ children }) {
  const user =
    JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "jobseeker") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default JobSeekerRoute;