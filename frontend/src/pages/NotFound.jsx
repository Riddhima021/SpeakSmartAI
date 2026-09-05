import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <div className="text-center">

        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-500/20 mb-8">
          <FaRobot className="text-cyan-400 text-5xl" />
        </div>

        <h1 className="text-7xl font-bold text-white">
          404
        </h1>

        <h2 className="text-3xl font-semibold text-slate-200 mt-4">
          Page Not Found
        </h2>

        <p className="text-slate-400 mt-4 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          Go to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default NotFound;