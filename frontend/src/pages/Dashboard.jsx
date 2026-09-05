import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { FaFilePdf } from "react-icons/fa";

import {
  FaPlay,
  FaSignOutAlt,
  FaChartLine,
  FaClipboardList,
  FaCheckCircle,
  FaTrophy,
  FaArrowRight,
} from "react-icons/fa";

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchInterviews();
    fetchStats();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await API.get("/interviews/my-interviews");
      setInterviews(res.data.interviews);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/interviews/dashboard-stats");
      setStats(res.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      <Navbar />
      {/* Header */}

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div>
          <h1 className="text-4xl font-bold">SpeakSmart AI</h1>

          <p className="text-gray-300 mt-2">
            Welcome back! Ready for your next interview?
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-wrap gap-5 mb-10">
          <button
            onClick={() => navigate("/start-interview")}
            className="flex-1 min-w-[250px] flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl shadow-xl font-semibold text-lg"
          >
            <FaPlay />
            Start Interview
          </button>

          <button
            onClick={() => navigate("/resume-analyzer")}
            className="flex-1 min-w-[250px] flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl shadow-xl font-semibold text-lg"
          >
            <FaFilePdf />
            Resume Analyzer
          </button>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaClipboardList size={26} />}
            title="Total Interviews"
            value={stats.totalInterviews || 0}
          />

          <StatCard
            icon={<FaCheckCircle size={26} />}
            title="Completed"
            value={stats.completedInterviews || 0}
          />

          <StatCard
            icon={<FaChartLine size={26} />}
            title="Average Score"
            value={stats.averageScore || 0}
          />

          <StatCard
            icon={<FaTrophy size={26} />}
            title="Best Score"
            value={stats.bestScore || 0}
          />
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-8">Recent Interviews</h2>

        <div className="grid gap-6">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex justify-between items-center hover:scale-[1.02] transition"
            >
              <div>
                <h3 className="text-2xl font-bold">{item.company}</h3>

                <p className="text-gray-300 mt-2">{item.role}</p>

                <div className="flex gap-3 mt-4">
                  <span className="bg-blue-600 px-4 py-1 rounded-full">
                    {item.type}
                  </span>

                  <span className="bg-purple-600 px-4 py-1 rounded-full">
                    {item.difficulty}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/result/${item._id}`)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl transition"
              >
                View Result
                <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:scale-105 transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-300">{title}</p>

          <h2 className="text-4xl font-bold mt-3">{value}</h2>
        </div>

        <div className="text-cyan-400">{icon}</div>
      </div>
    </div>
  );
}

export default Dashboard;
