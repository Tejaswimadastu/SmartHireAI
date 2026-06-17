import { Navigate } from "react-router-dom";

function RecruiterRoute({ children }) {
  const user =
    JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "recruiter") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default RecruiterRoute;
