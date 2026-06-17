# SmartHire AI 🚀

SmartHire AI is an AI-powered Resume Screening, Job Matching, and Proctoring Assessment Platform built using the MERN Stack. It helps job seekers calculate ATS scores, match resumes to open roles, and practice realistic mock interviews under webcam proctor monitoring. It also enables recruiters to publish job openings, rank applicants, and review candidate assessment transcripts and security violation logs.

---

## ✨ Features

### 👨‍💼 Candidate Features
* **Resume Upload & AI Parsing**: Scan resumes to extract technical skills and recommend matching developer roles.
* **ATS Compatibility Score**: Compute fit percentages matching backgrounds against job description requirements.
* **AI Mock Interview Sandbox**:
  * Practice Technical, DSA, System Design, Behavioral, or HR questions.
  * Live camera/mic test panels preloading client-side TensorFlow.js libraries.
  * Split-screen video interview portal with live timers and real-time Speech-to-Text transcriptions.
  * **Integrity Proctoring system**: Automatically logs warning events (cell phone usage, candidate out-of-frame, tab switching, copy-paste) and captures evidence screenshots.
  * **Cumulative Scorecard**: Play recorded mock videos, view AI performance feedback, and review proctor violation galleries.

### 🏢 Recruiter Features
* **Requisition Workspace**: Post developer vacancies and manage candidates.
* **ATS-Based Applicant Rankings**: Rank applicants by suitability scores.
* **Proctor Assessment Scorecards**: Inspect candidate responses, violation counts, and proctoring screenshots side-by-side.

---

## 🛠 Tech Stack

* **Frontend**: React.js, React Router DOM, Bootstrap 5, TensorFlow.js (COCO-SSD), MediaRecorder API, Web Speech API, Recharts, Axios, React Icons
* **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, PDF-Parse, Google Generative AI (Gemini)

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

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Tejaswimadastu/SmartHireAI.git
cd SmartHireAI
```

### 2. Backend Server Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```
Start the server:
```bash
npm start
```

### 3. Frontend Client Setup
```bash
cd ../client
npm install
npm run dev
```
Access the client application at `http://localhost:5173`.

---

## 👨‍💻 Author

**Tejaswi Madastu**  
GitHub: [https://github.com/Tejaswimadastu](https://github.com/Tejaswimadastu)

---

## 📜 License

This project is developed for educational and learning purposes.
