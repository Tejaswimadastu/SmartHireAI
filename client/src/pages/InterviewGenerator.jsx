import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  FaRobot, 
  FaSpinner, 
  FaQuestionCircle, 
  FaChevronRight,
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaStop,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaShieldAlt,
  FaDesktop,
  FaExclamationCircle,
  FaClock,
  FaDownload,
  FaArrowLeft,
  FaHistory
} from "react-icons/fa";

// Predefined Categories & Questions
const PREDEFINED_QUESTIONS = {
  Technical: [
    "Explain the difference between the Virtual DOM and the Real DOM in React. How does reconciliation work?",
    "What is the difference between SQL and NoSQL databases? When would you use MongoDB over PostgreSQL?",
    "Explain the Event Loop in Node.js. How does it handle asynchronous execution and I/O operations?"
  ],
  Behavioral: [
    "Tell me about a time when you had a conflict with a team member. How did you handle and resolve it?",
    "Describe a challenging technical project you worked on. What was the problem and how did you solve it?"
  ],
  HR: [
    "Why do you want to join our organization, and what makes you a good fit for this role?",
    "Where do you see yourself in five years? What are your professional growth goals?"
  ],
  DSA: [
    "How does a Hash Map handle collisions? Describe Chaining and Open Addressing techniques.",
    "Explain the difference between Depth First Search (DFS) and Breadth First Search (BFS) on graphs."
  ],
  "System Design": [
    "How would you design a rate limiter for a high-traffic public API?",
    "Explain horizontal vs vertical scaling. How does load balancing distribute client requests?"
  ]
};

function InterviewGenerator() {
  // Navigation Flow: "config", "test", "active", "report", "history"
  const [step, setStep] = useState("config");
  
  // Seeker config options
  const [category, setCategory] = useState("Technical");
  const [useAIQuestions, setUseAIQuestions] = useState(false);
  const [autoTerminate, setAutoTerminate] = useState(true);

  // Core Data
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(false);

  // Speech and Transcription states
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Hardware Verification & Proctoring states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [proctorModelLoaded, setProctorModelLoaded] = useState(false);
  const [proctorModelLoading, setProctorModelLoading] = useState(false);
  const [violationsList, setViolationsList] = useState([]);
  const [activePracticeIndex, setActivePracticeIndex] = useState(null);
  
  // Real-time metrics
  const [suspicionScore, setSuspicionScore] = useState(0);
  const [timer, setTimer] = useState(90); // 90 seconds per question
  const [sessionDuration, setSessionDuration] = useState(0);

  // Final Reports State
  const [finalReport, setFinalReport] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Multimedia Chunks
  const [recordingUrl, setRecordingUrl] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const detectionLoopRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const lastViolationTimeRef = useRef({});

  // 1. Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      
      rec.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript && step === "active") {
          setAnswers(prev => ({
            ...prev,
            [currentIndex]: (prev[currentIndex] || "") + finalTranscript
          }));
        } else if (finalTranscript && step === "test") {
          const testEl = document.getElementById("mic-test-text");
          if (testEl) testEl.innerText = `Speech detected: "${finalTranscript.trim()}"`;
        }
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      stopCamera();
      stopSpeech();
      stopDetectionLoop();
      stopTimer();
    };
  }, [currentIndex, step]);

  // Handle detection loop based on step change
  useEffect(() => {
    if (step === "active" && proctorModelLoaded && isCameraActive) {
      startDetectionLoop();
    } else {
      stopDetectionLoop();
    }
  }, [step, proctorModelLoaded, isCameraActive]);

  // Monitor violations list to adjust suspicion score
  useEffect(() => {
    setSuspicionScore(Math.min(violationsList.length * 15, 100));
  }, [violationsList]);

  // Active question timer countdown
  useEffect(() => {
    if (step === "active") {
      setTimer(90);
      stopTimer();
      
      countdownIntervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Time expired: Auto advance
            handleAutoAdvance();
            return 90;
          }
          return prev - 1;
        });
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [currentIndex, step]);

  // 2. Global Proctoring Listeners (Tab Switching & Fullscreen check)
  useEffect(() => {
    if (step !== "active") return;

    // A. Detect Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation("Tab Switch / External Window Access");
      }
    };

    // B. Detect Fullscreen Exits
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        triggerViolation("Exited Enforced Fullscreen Mode");
      }
    };

    // C. Detect Copy & Paste
    const handleCopyPaste = (e) => {
      e.preventDefault();
      triggerViolation("Copy-Paste Integrity Infraction");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
    };
  }, [step, currentIndex, autoTerminate]);

  const stopTimer = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    countdownIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          handleAutoAdvance();
          return 90;
        }
        return prev - 1;
      });
      setSessionDuration(prev => prev + 1);
    }, 1000);
  };

  // Auto advance on timeout
  const handleAutoAdvance = () => {
    stopSpeech();
    // Evaluate current response
    evaluateCurrentResponse(currentIndex);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      completeInterview("Completed");
    }
  };

  // 3. Dynamic Script Loading for TensorFlow & COCO-SSD
  const loadTensorFlowScripts = () => {
    if (window.cocoSsd) {
      setProctorModelLoaded(true);
      return;
    }

    setProctorModelLoading(true);
    const tfScript = document.createElement("script");
    tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";
    tfScript.async = true;
    tfScript.onload = () => {
      const cocoScript = document.createElement("script");
      cocoScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd";
      cocoScript.async = true;
      cocoScript.onload = async () => {
        try {
          await window.cocoSsd.load();
          setProctorModelLoaded(true);
        } catch (err) {
          console.error("Error loading model weights:", err);
        } finally {
          setProctorModelLoading(false);
        }
      };
      document.body.appendChild(cocoScript);
    };
    document.body.appendChild(tfScript);
  };

  // 4. Proctor Detection Loop
  const startDetectionLoop = async () => {
    if (!window.cocoSsd || !videoRef.current) return;
    
    stopDetectionLoop();
    let model;
    try {
      model = await window.cocoSsd.load();
    } catch (e) {
      console.error(e);
      return;
    }

    const runDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || video.paused || video.ended) return;

      try {
        const predictions = await model.detect(video);
        
        // Draw predictions to canvas
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          predictions.forEach(pred => {
            if (["person", "cell phone"].includes(pred.class)) {
              ctx.strokeStyle = pred.class === "cell phone" ? "#ef4444" : "#10b981";
              ctx.lineWidth = 3;
              ctx.strokeRect(pred.bbox[0], pred.bbox[1], pred.bbox[2], pred.bbox[3]);
              
              ctx.fillStyle = pred.class === "cell phone" ? "#ef4444" : "#10b981";
              ctx.font = "bold 14px sans-serif";
              ctx.fillText(
                `${pred.class.toUpperCase()} (${Math.round(pred.score * 100)}%)`,
                pred.bbox[0],
                pred.bbox[1] > 15 ? pred.bbox[1] - 5 : 10
              );
            }
          });
        }

        // Proctoring Checks
        // A. Cell phone check
        const hasPhone = predictions.some(p => p.class === "cell phone" && p.score > 0.6);
        if (hasPhone) {
          triggerViolation("Cell Phone Usage Detected");
        }

        // B. Person count check
        const people = predictions.filter(p => p.class === "person" && p.score > 0.55);
        if (people.length === 0) {
          triggerViolation("User Left the Frame");
        } else if (people.length > 1) {
          triggerViolation("Multiple People in Frame");
        }

        // C. Looking away check (Simple gaze heuristic using face box movement)
        if (people.length === 1) {
          const person = people[0];
          const [x, y, w, h] = person.bbox;
          const videoWidth = video.videoWidth || 320;
          const centerX = x + w / 2;
          
          // If candidate offsets too far to edges (e.g. reading prompts)
          if (centerX < videoWidth * 0.15 || centerX > videoWidth * 0.85) {
            triggerViolation("Suspicious Head Movement / Looking Away");
          }
        }

      } catch (err) {
        console.error(err);
      }

      detectionLoopRef.current = requestAnimationFrame(runDetection);
    };

    runDetection();
  };

  const stopDetectionLoop = () => {
    if (detectionLoopRef.current) {
      cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }
  };

  // Cooldown-restricted violation logging
  const triggerViolation = (type) => {
    const now = Date.now();
    const lastTime = lastViolationTimeRef.current[type] || 0;
    if (now - lastTime < 5000) return; // 5 seconds cooldown

    lastViolationTimeRef.current[type] = now;
    captureScreenshotEvidence(type);
  };

  const captureScreenshotEvidence = (violationType) => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");

      const newViolation = {
        violationType,
        timestamp: new Date(),
        screenshot: dataUrl
      };

      setViolationsList(prev => {
        const updated = [...prev, newViolation];
        
        // BEEP Alert Warning Sound
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, audioCtx.currentTime);
          osc.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.15);
        } catch(e){}

        // Termination validation
        if (updated.length >= 3 && autoTerminate) {
          completeInterview("Terminated", updated);
        }
        return updated;
      });

    } catch (err) {
      console.error("Error capturing screenshot evidence:", err);
    }
  };

  // Start hardware test wizard
  const proceedToHardwareTest = async () => {
    setLoading(true);
    try {
      if (useAIQuestions) {
        // Fetch AI customized questions
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "/api/interview/questions",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setQuestions(res.data.questions || []);
      } else {
        // Use Predefined Questions
        setQuestions(PREDEFINED_QUESTIONS[category]);
      }

      setStep("test");
      loadTensorFlowScripts();
      await requestCameraMicAccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load interview requirements");
    } finally {
      setLoading(false);
    }
  };

  const requestCameraMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Proctoring requires active Webcam and Microphone permissions to proceed.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Enforced Fullscreen Start
  const startEnforcedInterview = async () => {
    if (!isCameraActive) {
      alert("Please enable camera and mic access first.");
      return;
    }

    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) await docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) await docEl.webkitRequestFullscreen();
      
      setViolationsList([]);
      setAnswers({});
      setEvaluations({});
      setCurrentIndex(0);
      setSessionDuration(0);
      setStep("active");

      // Start video recording
      startMediaRecording();
    } catch (err) {
      console.error("Fullscreen error:", err);
      alert("Fullscreen mode is mandatory to ensure proctor compliance.");
    }
  };

  // Media Recorder functions
  const startMediaRecording = () => {
    if (!streamRef.current) return;
    try {
      recordedChunksRef.current = [];
      const options = { mimeType: "video/webm;codecs=vp8" };
      const recorder = new MediaRecorder(streamRef.current, options);
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.error("Error setting up MediaRecorder:", err);
    }
  };

  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // Speech Controllers
  const startSpeech = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Evaluate single question in background
  const evaluateCurrentResponse = async (index) => {
    const qText = questions[index];
    const ansText = answers[index];
    
    if (!ansText || !ansText.trim()) {
      setEvaluations(prev => ({
        ...prev,
        [index]: { score: 0, feedback: "No response was recorded.", modelAnswer: "Draft complete response details." }
      }));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/interview/evaluate",
        { question: qText, answer: ansText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEvaluations(prev => ({
        ...prev,
        [index]: res.data
      }));
    } catch (error) {
      console.error("Question grading failed:", error);
    }
  };

  // End Interview and Submit
  const handleQuestionSaveAndNext = async () => {
    stopSpeech();
    await evaluateCurrentResponse(currentIndex);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      await completeInterview("Completed");
    }
  };

  const completeInterview = async (interviewStatus, forceViolations = null) => {
    stopTimer();
    stopSpeech();
    stopCamera();
    stopDetectionLoop();
    stopMediaRecording();

    // Exit fullscreen
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e){}

    setLoading(true);
    
    // Check final questions list
    const finalViolations = forceViolations || violationsList;
    const finalAnswers = answers;

    // Build questions payload
    const formattedQuestions = questions.map((qText, index) => {
      const grade = evaluations[index] || {};
      return {
        questionText: qText,
        transcribedAnswer: finalAnswers[index] || "",
        score: grade.score || 0,
        feedback: grade.feedback || "Awaiting grader sync.",
        modelAnswer: grade.modelAnswer || "Model answer template."
      };
    });

    const payload = {
      category,
      status: interviewStatus,
      questions: formattedQuestions,
      violations: finalViolations.map(v => ({
        violationType: v.violationType,
        timestamp: v.timestamp,
        screenshot: v.screenshot
      })),
      durationSeconds: sessionDuration
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/interview/session",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setFinalReport(res.data.session);
      setStep("report");
    } catch (error) {
      console.error("Error saving session report:", error);
      alert("Failed to submit and generate AI proctor reports.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "/api/interview/session/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUserSessions(res.data.sessions || []);
      setStep("history");
    } catch (err) {
      console.error("History loading failed:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const viewHistoricReport = (session) => {
    setFinalReport(session);
    setStep("report");
  };

  // Component UI Builders
  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: "100vh" }}>
      
      {/* 1. CONFIGURATION VIEW */}
      {step === "config" && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="p-3 bg-primary-glow text-primary rounded-circle mb-3" style={{ width: "70px", height: "70px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                  <FaShieldAlt />
                </div>
                <h1 className="fw-bold mb-2 text-main">AI Proctoring & Mock Interview</h1>
                <p className="text-muted small">Realistic split-screen video assessment portal with behavioral anti-cheating tracking.</p>
              </div>

              <div className="row g-4 mt-2">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Select Question Track</label>
                  <select 
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={useAIQuestions}
                  >
                    <option value="Technical">Technical (React, Node, DB)</option>
                    <option value="Behavioral">Behavioral (STAR Method)</option>
                    <option value="HR">HR & Fitment</option>
                    <option value="DSA">Data Structures & Algorithms</option>
                    <option value="System Design">System Design & Scaling</option>
                  </select>
                </div>

                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check form-switch mb-2 p-0 w-100">
                    <label className="form-check-label fw-bold d-block mb-1">AI Personalized Track</label>
                    <div className="d-flex align-items-center gap-2">
                      <input 
                        type="checkbox"
                        className="form-check-input"
                        id="aiSwitch"
                        checked={useAIQuestions}
                        onChange={(e) => setUseAIQuestions(e.target.checked)}
                        style={{ cursor: "pointer", width: "40px", height: "20px" }}
                      />
                      <span className="small text-muted">Use resume-tailored questions</span>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card p-3 border rounded-3 bg-light">
                    <h6 className="fw-bold mb-2 text-main d-flex align-items-center gap-2">
                      🔒 Enforced Proctor Integrity Settings
                    </h6>
                    <div className="form-check">
                      <input 
                        type="checkbox"
                        className="form-check-input" 
                        id="termCheck"
                        checked={autoTerminate}
                        onChange={(e) => setAutoTerminate(e.target.checked)}
                      />
                      <label className="form-check-label small text-muted" style={{ cursor: "pointer" }}>
                        Terminate and reject session instantly upon committing 3 violations.
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4 pt-2">
                <button 
                  className="btn btn-outline-primary d-flex align-items-center gap-2 py-2.5 px-4"
                  onClick={fetchSessionHistory}
                >
                  <FaHistory /> Practice History
                </button>
                <button 
                  className="btn btn-primary flex-grow-1 py-2.5 d-flex align-items-center justify-content-center gap-2 shadow"
                  onClick={proceedToHardwareTest}
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="spinner-border spinner-border-sm me-2" style={{ borderRightColor: "transparent" }} /> : "Proceed to Equipment Test"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EQUIPMENT AND MODEL TESTING VIEW */}
      {step === "test" && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm p-4 p-md-5">
              <h3 className="fw-bold mb-3 text-main text-center">Equipment Setup & Verification</h3>
              <p className="text-muted text-center small mb-4">Please verify your audio and video signals. We are loading the client-side proctor models.</p>

              <div className="row g-4">
                {/* Camera preview */}
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <div className="w-100 bg-black rounded-4 overflow-hidden position-relative border" style={{ height: "200px" }}>
                    <video 
                      ref={videoRef}
                      muted
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                    {!isCameraActive && (
                      <div className="position-absolute inset-0 d-flex align-items-center justify-content-center bg-dark text-white-50">
                        Camera access required
                      </div>
                    )}
                  </div>
                  <button 
                    className={`btn btn-sm mt-3 ${isCameraActive ? "btn-outline-danger" : "btn-primary"} d-flex align-items-center gap-2`}
                    onClick={requestCameraMicAccess}
                  >
                    <FaVideo /> {isCameraActive ? "Restart Feed" : "Grant Feed Access"}
                  </button>
                </div>

                {/* Mic and Model Status */}
                <div className="col-md-6">
                  <div className="d-flex flex-column gap-3 h-100 justify-content-between">
                    <div className="p-3 border rounded-3">
                      <h6 className="fw-bold text-main mb-2">🎤 Voice Input Check</h6>
                      <div className="d-flex gap-2 align-items-center">
                        <button 
                          className={`btn btn-sm ${isRecording ? "btn-danger" : "btn-success"}`}
                          onClick={isRecording ? stopSpeech : startSpeech}
                          disabled={!speechSupported}
                        >
                          {isRecording ? "Stop Audio" : "Test Audio"}
                        </button>
                        <span id="mic-test-text" className="small text-muted">
                          {isRecording ? "Listening..." : "Click Test and speak to verify."}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-3">
                      <h6 className="fw-bold text-main mb-2">🤖 AI Proctor Model weights</h6>
                      <div className="d-flex align-items-center gap-2">
                        {proctorModelLoaded ? (
                          <span className="badge bg-success-glow text-success fw-bold py-2 px-3">
                            COCO-SSD Ready
                          </span>
                        ) : proctorModelLoading ? (
                          <span className="small text-muted d-flex align-items-center gap-2">
                            <FaSpinner className="spinner-border spinner-border-sm me-2" style={{ borderRightColor: "transparent" }} /> Loading libraries (1.2MB)...
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark py-2 px-3">
                            Awaiting Setup
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fullscreen warnings */}
              <div className="mt-4 p-3 rounded-4 border border-warning" style={{ background: "rgba(245, 158, 11, 0.05)" }}>
                <h6 className="fw-bold text-warning d-flex align-items-center gap-2 mb-1">
                  <FaDesktop /> Fullscreen Mode Requirement
                </h6>
                <p className="small text-muted mb-0">
                  This mock session enforces fullscreen. Moving focus to other tabs, exiting fullscreen, or using external clipboard functions triggers immediate violations.
                </p>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-outline-secondary py-2.5 px-4" onClick={() => setStep("config")}>
                  Cancel
                </button>
                <button 
                  className="btn btn-success flex-grow-1 py-2.5 d-flex align-items-center justify-content-center gap-2 shadow"
                  onClick={startEnforcedInterview}
                  disabled={!isCameraActive || !proctorModelLoaded}
                >
                  <FaCheckCircle /> Enter Fullscreen & Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE SIMULATION VIEW */}
      {step === "active" && (
        <div className="row g-4">
          
          {/* A. Left Proctor HUD */}
          <div className="col-lg-4 col-md-5">
            <div className="card border-0 shadow-sm p-4 sticky-lg-top" style={{ top: "90px" }}>
              <h5 className="fw-bold mb-3 text-main d-flex align-items-center gap-2">
                <FaShieldAlt className="text-danger" /> Proctor Monitoring Panel
              </h5>

              {/* Camera Frame Box */}
              <div className="w-100 position-relative bg-black rounded-4 overflow-hidden border" style={{ height: "200px" }}>
                <video 
                  ref={videoRef}
                  muted
                  className="w-100 h-100 position-absolute"
                  style={{ objectFit: "cover", zIndex: 1 }}
                />
                <canvas 
                  ref={canvasRef}
                  className="w-100 h-100 position-absolute"
                  style={{ top: 0, left: 0, zIndex: 2, pointerEvents: "none" }}
                  width="320"
                  height="240"
                />
              </div>

              {/* Integrity status list */}
              <div className="mt-3 d-flex flex-column gap-2.5">
                
                {/* Timer display */}
                <div className="d-flex justify-content-between align-items-center p-2.5 border rounded-3 bg-light">
                  <span className="small text-muted d-flex align-items-center gap-2"><FaClock /> Time Remaining</span>
                  <span className={`fw-bold ${timer <= 20 ? "text-danger animate-pulse" : "text-main"}`} style={{ fontSize: "17px" }}>
                    {timer}s
                  </span>
                </div>

                {/* Violation Counter */}
                <div className="d-flex justify-content-between align-items-center p-2.5 border rounded-3 bg-light">
                  <span className="small text-muted d-flex align-items-center gap-2"><FaExclamationCircle /> Violations Registered</span>
                  <span className={`badge ${violationsList.length > 0 ? "bg-danger text-white" : "bg-success text-white"} py-1.5 px-3 fw-bold`}>
                    {violationsList.length} / 3
                  </span>
                </div>

                {/* Suspicion score bar */}
                <div className="p-2.5 border rounded-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-muted">Cheating Suspicion Index</span>
                    <span className="small fw-bold text-main">{suspicionScore}%</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div 
                      className={`progress-bar ${suspicionScore >= 60 ? "bg-danger" : suspicionScore >= 30 ? "bg-warning" : "bg-success"}`} 
                      role="progressbar" 
                      style={{ width: `${suspicionScore}%` }} 
                    />
                  </div>
                </div>

                {/* Simulated alerts logs */}
                {violationsList.length > 0 && (
                  <div className="p-3 border rounded-3 border-danger-subtle bg-danger-glow">
                    <h6 className="fw-bold text-danger mb-1.5" style={{ fontSize: "13px" }}>Violations Log:</h6>
                    <div className="d-flex flex-column gap-1.5 overflow-y-auto" style={{ maxHeight: "100px" }}>
                      {violationsList.map((v, i) => (
                        <div key={i} className="small text-danger d-flex justify-content-between gap-2 border-bottom pb-1" style={{ fontSize: "11px" }}>
                          <span>• {v.violationType}</span>
                          <span className="text-muted">{new Date(v.timestamp).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* B. Right Active Question Panel */}
          <div className="col-lg-8 col-md-7">
            <div className="card border-0 shadow-sm p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-primary-glow text-primary text-uppercase px-3 py-2 fw-bold" style={{ letterSpacing: "1px" }}>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="small text-muted">{category} Track</span>
                </div>

                {/* Question bubble */}
                <h4 className="fw-bold text-main mb-4 py-2" style={{ lineHeight: "1.5" }}>
                  {questions[currentIndex]}
                </h4>

                {/* Transcript input */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-bold text-main mb-0">Speech Transcript Panel</label>
                    {isRecording ? (
                      <span className="small text-danger d-flex align-items-center gap-1.5 animate-pulse fw-semibold">
                        <span className="spinner-grow spinner-grow-sm text-danger" style={{ width: "8px", height: "8px" }} />
                        TRANSCRIPTION ACTIVE
                      </span>
                    ) : (
                      <span className="small text-muted">Audio inactive</span>
                    )}
                  </div>
                  <textarea
                    className="form-control font-monospace"
                    rows="8"
                    placeholder="Click 'Start Answering' and speak clearly. The proctoring system will transcribe your verbal answer here. You can edit the text before saving."
                    value={answers[currentIndex] || ""}
                    onChange={(e) => handleAnswerChange(currentIndex, e.target.value)}
                  />
                </div>
              </div>

              {/* Workflow buttons */}
              <div className="d-flex flex-wrap gap-2 pt-3 border-top">
                {isRecording ? (
                  <button className="btn btn-danger d-flex align-items-center gap-2" onClick={stopSpeech}>
                    <FaStop /> Stop Recording
                  </button>
                ) : (
                  <button className="btn btn-success d-flex align-items-center gap-2" onClick={startSpeech}>
                    <FaMicrophone /> Start Answering
                  </button>
                )}

                <button className="btn btn-outline-secondary" onClick={() => handleAnswerChange(currentIndex, "")}>
                  <FaTrash /> Clear
                </button>

                <button 
                  className="btn btn-primary ms-auto d-flex align-items-center gap-2 px-4 shadow"
                  onClick={handleQuestionSaveAndNext}
                  disabled={!answers[currentIndex]?.trim()}
                >
                  {currentIndex === questions.length - 1 ? "Complete Interview" : "Save & Next"} <FaChevronRight />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. POST-INTERVIEW EVALUATION REPORT */}
      {step === "report" && finalReport && (
        <div className="row justify-content-center">
          <div className="col-md-10">
            
            <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
              
              {/* Scorecard Header */}
              <div className="d-flex flex-wrap justify-content-between align-items-center pb-4 border-bottom mb-4 gap-3">
                <div>
                  <h2 className="fw-bold mb-1 text-main">AI Evaluation Scorecard</h2>
                  <p className="text-muted small mb-0">Candidate: <strong className="text-main">{finalReport.candidateName}</strong> | Track: {finalReport.category}</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => window.print()}>
                    Download Report PDF
                  </button>
                  <button className="btn btn-primary px-4" onClick={() => setStep("config")}>
                    Exit Sandbox
                  </button>
                </div>
              </div>

              {/* Assessment Dials */}
              <div className="row g-4 mb-5 text-center">
                <div className="col-md-4">
                  <div className="p-4 rounded-4 border h-100 d-flex flex-column align-items-center justify-content-center bg-light">
                    <h5 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "1.5px" }}>Performance Grade</h5>
                    <div className="p-3 rounded-circle text-white fw-bold d-flex align-items-center justify-content-center"
                      style={{
                        width: "90px",
                        height: "90px",
                        fontSize: "24px",
                        background: finalReport.overallScore >= 80 ? "#10b981" : finalReport.overallScore >= 60 ? "#f59e0b" : "#ef4444"
                      }}
                    >
                      {finalReport.overallScore}/100
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-4 rounded-4 border h-100 d-flex flex-column align-items-center justify-content-center bg-light">
                    <h5 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "1.5px" }}>Hiring Recommendation</h5>
                    <span className={`badge px-4 py-2.5 fw-bold fs-5 ${
                      finalReport.hiringRecommendation === "Strong Hire" ? "bg-success text-white" :
                      finalReport.hiringRecommendation === "Hire" ? "bg-success text-white" :
                      finalReport.hiringRecommendation === "Maybe" ? "bg-warning text-dark" : "bg-danger text-white"
                    }`}>
                      {finalReport.hiringRecommendation}
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-4 rounded-4 border h-100 d-flex flex-column align-items-center justify-content-center bg-light">
                    <h5 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "1.5px" }}>Proctor Integrity Score</h5>
                    <div className="p-3 rounded-circle text-white fw-bold d-flex align-items-center justify-content-center"
                      style={{
                        width: "90px",
                        height: "90px",
                        fontSize: "24px",
                        background: finalReport.suspicionScore >= 60 ? "#ef4444" : finalReport.suspicionScore >= 30 ? "#f59e0b" : "#10b981"
                      }}
                    >
                      {100 - finalReport.suspicionScore}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Proctoring Assessment Report */}
              <div className="card border p-4 rounded-4 mb-5" style={{ background: "rgba(239, 68, 68, 0.02)" }}>
                <h5 className="fw-bold text-danger d-flex align-items-center gap-2 mb-3">
                  🛡️ Proctor Security Assessor
                </h5>
                <p className="text-muted mb-3">{finalReport.proctorFeedback}</p>
                <div className="small text-muted">
                  • Total violations: <strong>{finalReport.violations?.length || 0}</strong> <br />
                  • Session Status: <strong>{finalReport.status}</strong> <br />
                  • Active stopwatch: <strong>{finalReport.durationSeconds} seconds</strong>
                </div>

                {/* Screenshots evidence */}
                {finalReport.violations && finalReport.violations.length > 0 && (
                  <div className="mt-4">
                    <h6 className="fw-bold text-main mb-3">Captured Bounding Box Screenshot Evidence:</h6>
                    <div className="row g-3">
                      {finalReport.violations.map((v, i) => (
                        <div className="col-md-4 col-sm-6" key={i}>
                          <div className="border rounded-3 p-2 bg-white text-center">
                            {v.screenshot ? (
                              <img src={v.screenshot} alt="Evidence" className="img-fluid rounded mb-2" style={{ maxHeight: "150px" }} />
                            ) : (
                              <div className="w-100 bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: "120px" }}>No screenshot</div>
                            )}
                            <div className="fw-bold small text-danger mb-0 text-truncate">{v.violationType}</div>
                            <small className="text-muted" style={{ fontSize: "10px" }}>{new Date(v.timestamp).toLocaleTimeString()}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Video Playback download */}
              {recordingUrl && (
                <div className="p-4 border rounded-4 mb-5 bg-light d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <h6 className="fw-bold text-main mb-1">📼 Recorded Mock Interview Session WebM</h6>
                    <p className="small text-muted mb-0">Download your recorded session to review your facial postures and speech patterns.</p>
                  </div>
                  <a href={recordingUrl} download="interview-session.webm" className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <FaDownload /> Download Video
                  </a>
                </div>
              )}

              {/* Question by question feedback */}
              <div>
                <h4 className="fw-bold mb-4 text-primary">Question & Answer Log Feedback</h4>
                <div className="d-flex flex-column gap-4">
                  {finalReport.questions.map((q, i) => (
                    <div className="border rounded-4 p-4 bg-light" key={i}>
                      <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-2 flex-wrap gap-2">
                        <h6 className="fw-bold text-main mb-0" style={{ maxWidth: "80%" }}>#{i + 1} {q.questionText}</h6>
                        <span className="badge bg-primary px-3 py-1.5 fw-semibold">Graded: {q.score}/100</span>
                      </div>
                      
                      <div className="mb-3">
                        <strong className="small text-muted d-block mb-1">Your Speech Answer:</strong>
                        <p className="font-monospace small bg-white p-3 border rounded-3 text-main mb-0">{q.transcribedAnswer || "(No spoken response logged)"}</p>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <strong className="small text-muted d-block mb-1">AI Critique:</strong>
                          <p className="small text-main mb-0" style={{ whiteSpace: "pre-line" }}>{q.feedback}</p>
                        </div>
                        <div className="col-md-6">
                          <strong className="small text-success d-block mb-1">Model Recommended Answer:</strong>
                          <p className="small text-muted mb-0" style={{ whiteSpace: "pre-line" }}>{q.modelAnswer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. HISTORIC USER SESSIONS LIST */}
      {step === "history" && (
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card border-0 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0 text-main d-flex align-items-center gap-2">
                  <FaHistory className="text-primary" /> Completed Mock Session History
                </h4>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setStep("config")}>
                  <FaArrowLeft /> Back to Setup
                </button>
              </div>

              {loadingHistory ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading history...</span>
                  </div>
                </div>
              ) : userSessions.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <h5>No completed sessions found</h5>
                  <p className="small mb-0">Your completed assessments list will appear here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Category</th>
                        <th className="text-center">Score</th>
                        <th className="text-center">Integrity Score</th>
                        <th>Hiring Recommendation</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userSessions.map((session) => (
                        <tr key={session._id}>
                          <td>{new Date(session.createdAt).toLocaleString()}</td>
                          <td><span className="badge bg-primary-glow text-primary">{session.category}</span></td>
                          <td className="text-center fw-bold">{session.overallScore}%</td>
                          <td className="text-center">{100 - session.suspicionScore}%</td>
                          <td>
                            <span className={`badge ${
                              session.hiringRecommendation === "Strong Hire" ? "bg-success" :
                              session.hiringRecommendation === "Hire" ? "bg-success" :
                              session.hiringRecommendation === "Maybe" ? "bg-warning text-dark" : "bg-danger"
                            }`}>
                              {session.hiringRecommendation}
                            </span>
                          </td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => viewHistoricReport(session)}
                            >
                              View Scorecard
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default InterviewGenerator;
