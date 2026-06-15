require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// =============================
// Middleware
// =============================

app.use(cors());

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

// =============================
// Database
// =============================

connectDB();

// =============================
// Static Files
// =============================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =============================
// Routes
// =============================

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

// =============================
// Home Route
// =============================

app.get("/", (req, res) => {
  res.send("🚀 SmartHire AI API Running");
});

// =============================
// Health Check
// =============================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    server: "Running",
    timestamp: new Date()
  });
});

// =============================
// Test Route
// =============================

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server Working"
  });
});

// =============================
// Body Test
// =============================

app.put("/bodytest", (req, res) => {
  res.json({
    receivedData: req.body
  });
});

// =============================
// 404 Handler
// =============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// =============================
// Global Error Handler
// =============================

app.use(
  (err, req, res, next) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error"
    });
  }
);

// =============================
// Start Server
// =============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server Running on Port ${PORT}`
  );
});