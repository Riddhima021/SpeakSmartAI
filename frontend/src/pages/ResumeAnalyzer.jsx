import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { FaFilePdf, FaRobot } from "react-icons/fa";

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState("Full Stack Developer");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!resume) {
      return toast.error("Please upload your resume.");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("role", role);

      const res = await API.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(res.data.analysis);

      toast.success("Resume analyzed successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Resume analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex justify-center items-center px-6 py-16">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-500/20 mb-6">
              <FaRobot className="text-cyan-400 text-5xl" />
            </div>

            <h1 className="text-4xl font-bold text-white">
              AI Resume Analyzer
            </h1>

            <p className="text-slate-300 mt-3">
              Upload your resume and receive AI-powered feedback.
            </p>
          </div>

          <label className="block text-slate-300 mb-2">Target Role</label>

          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-800 text-white p-4 rounded-xl mb-6"
          />

          <label className="block text-slate-300 mb-2">
            Upload Resume (PDF)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full bg-slate-800 text-white p-4 rounded-xl"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-xl text-white font-bold"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {analysis && (
            <div className="mt-10 space-y-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-cyan-400">
                  Resume Score
                </h2>

                <p className="text-5xl font-bold text-white mt-2">
                  {analysis.resumeScore}/100
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-400">ATS Score</h2>

                <p className="text-5xl font-bold text-white mt-2">
                  {analysis.atsScore}/100
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white">AI Summary</h2>

                <p className="text-slate-300 mt-3">{analysis.summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResumeAnalyzer;
