import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
  SpeechRecognition,
  useSpeechRecognition,
} from "../services/speechService";
import { initializeFaceDetector, detectFace } from "../services/faceDetection";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [idealAnswer, setIdealAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [faceDetected, setFaceDetected] = useState(false);
  const [lookingAway, setLookingAway] = useState(false);
  const [warning, setWarning] = useState(false);
  const [expression, setExpression] = useState("Neutral");
  const awayTimer = useRef(null);
  const noFaceFrames = useRef(0);
  const animationFrameRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // useEffect(() => {
  //   console.log("Transcript:", transcript);
  // }, [transcript]);

  const videoRef = useRef(null);

  const fetchInterview = async () => {
    try {
      const res = await API.get("/interviews/my-interviews");

      const currentInterview = res.data.interviews.find(
        (item) => item._id === id,
      );

      setInterview(currentInterview);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      await initializeFaceDetector();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const video = videoRef.current;

      video.srcObject = stream;

      video.onloadedmetadata = async () => {
        await video.play();
        animationFrameRef.current = requestAnimationFrame(monitorFace);
      };
    } catch (err) {
      console.log(err);
    }
  };

  const monitorFace = () => {
    const video = videoRef.current;

    if (!video) {
      animationFrameRef.current = requestAnimationFrame(monitorFace);
      return;
    }

    if (
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      animationFrameRef.current = requestAnimationFrame(monitorFace);
      return;
    }

    const results = detectFace(video);

    if (results?.faceLandmarks?.length > 0) {
      noFaceFrames.current = 0;

      setFaceDetected(true);

      const landmarks = results.faceLandmarks[0];

      // Detect basic facial expression from MediaPipe blendshapes
      if (results.faceBlendshapes?.length > 0) {
        const categories = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
          categories.find((item) => item.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browInnerUp = getScore("browInnerUp");

        if (smileLeft > 0.45 && smileRight > 0.45) {
          setExpression("Smiling");
        } else if (jawOpen > 0.45) {
          setExpression("Surprised");
        } else if (browInnerUp > 0.45) {
          setExpression("Attentive");
        } else {
          setExpression("Neutral");
        }
      }

      // Eye center is much more stable than nose
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];

      if (leftEye && rightEye) {
        const centerX = (leftEye.x + rightEye.x) / 2;

        if (centerX < 0.35 || centerX > 0.65) {
          setLookingAway(true);

          if (!awayTimer.current) {
            awayTimer.current = setTimeout(() => {
              setWarning(true);
            }, 2000);
          }
        } else {
          setLookingAway(false);
          setWarning(false);

          clearTimeout(awayTimer.current);
          awayTimer.current = null;
        }
      }
    } else {
      noFaceFrames.current++;

      // Wait a few frames before declaring "No Face"
      if (noFaceFrames.current > 10) {
        setFaceDetected(false);
        setLookingAway(false);
        setWarning(false);
        setExpression("No Face");

        clearTimeout(awayTimer.current);
        awayTimer.current = null;
      }
    }

    animationFrameRef.current = requestAnimationFrame(monitorFace);
  };

  useEffect(() => {
    fetchInterview();
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      clearTimeout(awayTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!interview) return;

    const question = interview.questions[currentQuestion];

    setAnswer(question.answer || "");
    setScore(question.score || null);
    setFeedback(question.feedback || "");
    setIdealAnswer(question.idealAnswer || "");
    setSubmitted(question.answer && question.answer.trim() !== "");
  }, [currentQuestion, interview]);

  useEffect(() => {
    if (!submitted) {
      setAnswer(transcript);
    }
  }, [transcript, submitted]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-slate-400">Loading Interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Interview Not Found
      </div>
    );
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      return toast.error("Please enter your answer");
    }

    setSubmitting(true);

    try {
      const res = await API.post("/interviews/evaluate", {
        interviewId: interview._id,
        questionIndex: currentQuestion,
        answer,
      });

      const result = res.data.result;

      setScore(result.score);
      setFeedback(result.feedback);
      setIdealAnswer(result.idealAnswer);
      setSubmitted(true);

      const updatedInterview = { ...interview };

      updatedInterview.questions[currentQuestion].answer = answer;
      updatedInterview.questions[currentQuestion].score = result.score;
      updatedInterview.questions[currentQuestion].feedback = result.feedback;
      updatedInterview.questions[currentQuestion].idealAnswer =
        result.idealAnswer;

      setInterview(updatedInterview);
      if (currentQuestion === interview.questions.length - 1) {
        setTimeout(() => {
          navigate(`/result/${interview._id}`);
        }, 1500);
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Evaluation Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <h2>Your browser doesn't support Speech Recognition.</h2>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 px-6">
        <h1 className="text-4xl font-bold mb-4">{interview.company}</h1>

        <h2 className="text-xl text-slate-300 mb-8">{interview.role}</h2>

        <p className="mb-6 text-slate-300">
          Question {currentQuestion + 1} of {interview.questions.length}
        </p>

        <div className="w-full bg-gray-300 rounded-full h-3 mb-8">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{
              width: `${((currentQuestion + 1) / interview.questions.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className="flex justify-center mb-10">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-80 rounded-2xl border-4 border-cyan-500 shadow-2xl"
            />

            {/* Face Status */}
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-sm font-semibold shadow ${
                faceDetected ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {faceDetected ? "🟢 Face Detected" : "🔴 No Face"}
            </div>

            {/* Attention */}
            {faceDetected && (
              <div
                className={`absolute top-14 right-3 px-3 py-1 rounded-full text-white text-sm font-semibold shadow ${
                  lookingAway ? "bg-yellow-500" : "bg-blue-600"
                }`}
              >
                {lookingAway ? "⚠ Looking Away" : "Looking Forward"}
              </div>
            )}

            {faceDetected && (
              <div className="absolute top-26 right-3 px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-semibold shadow">
                😊 {expression}
              </div>
            )}
          </div>
        </div>
        {warning && (
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-500/20 border border-yellow-500 px-6 py-3 rounded-xl">
              <p className="text-yellow-300 font-semibold">
                ⚠ Please keep your attention on the interview.
              </p>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-10">
          <h2 className="text-3xl font-bold text-cyan-400 mb-6">
            Question {currentQuestion + 1}
          </h2>

          <p className="text-xl leading-8 text-slate-200">
            {interview.questions[currentQuestion].question}
          </p>

          <div className="mt-6">
            <label className="block font-semibold mb-2">Your Answer</label>

            <p className="mb-3 text-sm font-medium text-blue-600">
              {listening ? "🎙 Listening..." : "🎤 Microphone Off"}
            </p>

            <div className="flex gap-3 mb-4">
              <button
                type="button"
                disabled={submitted}
                onClick={() => {
                  resetTranscript();
                  setAnswer("");

                  SpeechRecognition.startListening({
                    continuous: true,
                    language: "en-IN",
                  });
                }}
                className="px-5 py-2 rounded-lg bg-blue-400 hover:bg-cyan-500 transition text-white"
              >
                🎤 Start Speaking
              </button>

              <button
                type="button"
                disabled={submitted}
                onClick={() => {
                  SpeechRecognition.stopListening();
                }}
                className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-600 text-white transition"
              >
                ⏹ Stop
              </button>
            </div>

            <textarea
              disabled={submitted}
              rows="6"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full mt-4 p-5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
              placeholder="Type your answer here..."
            />

            {submitted && (
              <div className="mt-10 border-t border-slate-700 pt-8">
                <h3 className="text-2xl text-cyan-400 font-bold mb-6">
                  AI Evaluation
                </h3>

                <p className="text-green-400 text-xl font-bold mb-5">
                  ⭐ Score: {score}/10
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold">Feedback</h4>
                  <p>{feedback}</p>
                </div>

                <div>
                  <h4 className="font-semibold">Ideal Answer</h4>
                  <p>{idealAnswer}</p>
                </div>
              </div>
            )}

            <button
              disabled={submitted || submitting}
              onClick={handleSubmitAnswer}
              className={`mt-6 px-6 py-3 rounded-lg text-white font-semibold ${
                submitted || submitting
                  ? "bg-gray-500"
                  : "bg-green-500 hover:bg-green-700"
              }`}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Evaluating...
                </div>
              ) : (
                "Submit Answer"
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            className="bg-slate-700 hover:bg-slate-600 transition px-6 py-3 rounded-xl disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => {
              if (currentQuestion === interview.questions.length - 1) {
                navigate(`/result/${interview._id}`);
              } else {
                setCurrentQuestion(currentQuestion + 1);
              }
            }}
            disabled={currentQuestion === interview.questions.length - 1}
            className="bg-cyan-600 hover:bg-cyan-700 transition px-6 py-3 rounded-xl disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Interview;
