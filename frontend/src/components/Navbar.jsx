import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaRobot, FaHome, FaUser, FaPlay, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 text-2xl font-bold text-white"
        >
          <FaRobot className="text-cyan-400 text-3xl" />
          <span>SpeakSmart AI</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition"
          >
            <FaHome />
            Dashboard
          </Link>

          <Link
            to="/start-interview"
            className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition"
          >
            <FaPlay />
            Interview
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition"
          >
            <FaUser />
            Profile
          </Link>

          <Link
            to="/resume-analyzer"
            className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition"
          >
            Resume AI
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-blue-300 hover:bg-slate-400 px-4 py-2 rounded-xl transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
