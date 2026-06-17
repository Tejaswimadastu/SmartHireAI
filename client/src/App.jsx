import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import JobSeekerRoute from "./components/JobSeekerRoute";
import CandidateRanking from "./pages/CandidateRanking";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterRoute from "./components/RecruiterRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecruiterProfile from "./pages/RecruiterProfile";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import Applicants from "./pages/Applicants";

import ResumeUpload from "./pages/ResumeUpload";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeReport from "./pages/ResumeReport";

import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import InterviewGenerator from "./pages/InterviewGenerator";
import ProctorReport from "./pages/ProctorReport";

function AppContent() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
  path="/ranking"
  element={
    <ProtectedRoute>
      <CandidateRanking />
    </ProtectedRoute>
  }
/>
        {/* Protected Routes */}

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      {JSON.parse(
        localStorage.getItem("user")
      )?.role === "recruiter" ? (
        <Admin />
      ) : (
        <Dashboard />
      )}
    </ProtectedRoute>
  }
/>
        <Route
  path="/recruiter-profile"
  element={
    <ProtectedRoute>
      <RecruiterProfile />
    </ProtectedRoute>
  }
/>

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-report"
          element={
            <ProtectedRoute>
              <ResumeReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applicants/:jobId"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proctor-report/:candidateId"
          element={
            <ProtectedRoute>
              <ProctorReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin"
  element={
    <RecruiterRoute>
      <Admin />
    </RecruiterRoute>
  }
/>

        {/* 404 */}

        <Route
          path="*"
          element={
            <div className="container text-center py-5">
              <h1>404</h1>
              <h4>Page Not Found</h4>
            </div>
          }
        />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;