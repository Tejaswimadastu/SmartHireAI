# SmartHireAI
# 🚀 SmartHire AI

SmartHire AI is an AI-powered Resume Screening and Job Matching Platform built using the MERN Stack. It helps job seekers analyze resumes, calculate ATS scores, find suitable jobs, generate interview questions, and enables recruiters to manage job postings and applicants efficiently.

---

## ✨ Features

### 👨‍💼 Job Seeker Features

* User Registration & Login
* Resume Upload (PDF)
* AI Resume Analysis
* ATS Score Calculation
* Resume-Based Job Matching
* AI Interview Question Generator
* Job Search & Applications
* Application Tracking Dashboard
* Candidate Ranking
* Personal Profile Management

### 🏢 Recruiter Features

* Recruiter Authentication
* Post New Jobs
* View Applicants
* ATS-Based Candidate Ranking
* Application Status Management
* Recruiter Dashboard

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router DOM
* Bootstrap 5
* Recharts
* Axios
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* PDF-Parse

### AI Features

* Resume Skill Extraction
* ATS Score Analysis
* Resume Matching
* Interview Question Generation

---

## 📂 Project Structure

```text
SmartHireAI/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   └── package.json
│
├── README.md
├── package.json
└── .gitignore
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Tejaswimadastu/SmartHireAI.git
cd SmartHireAI
```

---

### Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run Backend

```bash
npm start
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🎯 Core Modules

### Resume Analyzer

* Extracts skills from uploaded resumes
* Calculates Resume Score
* Suggests missing skills
* Recommends suitable job roles

### ATS Matcher

* Compares resume skills with job requirements
* Calculates ATS Match Percentage
* Provides hiring recommendations

### AI Interview Generator

* Generates interview questions based on resume skills
* Helps candidates prepare for technical interviews

### Recruiter Dashboard

* Create job postings
* View applicants
* Manage candidate status
* ATS-based ranking system

---

## 📊 Future Enhancements

* Gemini/OpenAI Integration
* Resume Improvement Suggestions
* Real-time Notifications
* Mock Interview System
* Email Alerts
* Advanced Analytics Dashboard

---

## 👨‍💻 Author

**Tejaswi Madastu**

GitHub: https://github.com/Tejaswimadastu

---

## 📜 License

This project is developed for educational and learning purposes.
