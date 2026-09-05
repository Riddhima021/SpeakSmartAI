import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import PrimaryButton from "../components/PrimaryButton";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
  FaRobot,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";

function StartInterview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleGenerateInterview = async () => {
    if (!company || !role || !type || !difficulty) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await API.post("/interviews/start", {
        company,
        role,
        type,
        difficulty,
      });

      toast.success("Interview Generated Successfully!");

      navigate(`/interview/${res.data.interview._id}`);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to generate interview",
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-500/20 mb-6">
            <FaRobot className="text-cyan-400 text-5xl" />
          </div>

          <h1 className="text-5xl font-extrabold text-white">
            Start Your AI Interview
          </h1>

          <p className="text-slate-300 mt-4 text-lg max-w-xl mx-auto">
            Generate personalized interview questions tailored to your dream
            company and role.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">
            ✨ What you'll get
          </h2>

          <div className="grid grid-cols-2 gap-4 text-slate-300">
            <p>✅ 10 AI Questions</p>

            <p>⭐ Instant Score</p>

            <p>💬 Detailed Feedback</p>

            <p>🎯 Ideal Answers</p>
          </div>
        </div>

        <InputField
          icon={<FaBuilding />}
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Google"
        />

        <InputField
          icon={<FaBriefcase />}
          label="Job Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Full Stack Developer"
        />

        <SelectField
          label="Interview Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={["Technical", "HR", "Behavioral", "Mixed"]}
        />

        <SelectField
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          options={["Easy", "Medium", "Hard"]}
        />

        <button
          onClick={handleGenerateInterview}
          disabled={loading}
          className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg text-white transition-all ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Questions...
            </div>
          ) : (
            " Generate Interview"
          )}
        </button>
      </div>
    </div>
    </>
  );
}

export default StartInterview;
