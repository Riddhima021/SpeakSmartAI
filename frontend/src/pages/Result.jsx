import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import ScoreChart from "../components/ScoreChart";
import downloadReport from "../utils/downloadReport";

function Result() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

//   const scoreColor =
//     interview.overallScore >= 80
//       ? "text-green-400"
//       : interview.overallScore >= 60
//         ? "text-yellow-400"
//         : "text-red-400";



  const fetchResult = async () => {
    try {
      const res = await API.get(`/interviews/result/${id}`);
      setInterview(res.data.interview);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">Loading Result...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Result Not Found
      </div>
    );
  }

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10">
        <h1 className="text-5xl font-bold text-center text-white mb-4">
          Interview Completed
        </h1>

        <h2 className="text-3xl font-semibold text-cyan-400 text-center mb-2">
          {interview.company}
        </h2>

        <p className="text-center text-slate-300 mb-8">{interview.role}</p>

        <div className="bg-slate-900/60 rounded-2xl p-8 text-center mb-10 border border-slate-700">
          <p className={`text-6xl font-bold`}>
            {interview.overallScore}%
          </p>

          <p className="text-slate-300 mt-3 text-lg">Overall Score</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            AI Performance Summary
          </h2>

          <p className="text-slate-300 leading-7">
            {interview.overallScore >= 80
              ? "Excellent performance! Your answers were well-structured and demonstrated a strong understanding of the concepts. Keep practicing to maintain this level."
              : interview.overallScore >= 60
                ? "Good performance. You have a solid foundation, but improving the depth and clarity of your answers will help you score higher."
                : "Your interview shows room for improvement. Focus on strengthening your technical knowledge, communication, and structured answering approach."}
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Performance by Question
          </h2>

          <div className="bg-white rounded-2xl p-6">
            <ScoreChart questions={interview.questions} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-300">Questions</h3>
            <p className="text-4xl text-cyan-400 font-bold mt-2">
              {interview.questions.length}
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-300">Average Score</h3>
            <p className="text-4xl text-green-400 font-bold mt-2">
              {(
                interview.questions.reduce((sum, q) => sum + q.score, 0) /
                interview.questions.length
              ).toFixed(1)}
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-300">Best Score</h3>
            <p className="text-4xl text-yellow-400 font-bold mt-2">
              {Math.max(...interview.questions.map((q) => q.score))}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-10 mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => downloadReport(interview)}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            📄 Download PDF
          </button>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Question-wise Performance
          </h2>

          <div className="space-y-5">
            {interview.questions.map((q, index) => (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6"
              >
                <h3 className="text-cyan-400 text-xl font-bold">
                  Question {index + 1}
                </h3>

                <p className="text-slate-300 mt-3">{q.question}</p>

                <p className="mt-4 text-green-400 font-bold text-lg">
                  ⭐ Score: {q.score}/10
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Result;
