import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Welcome to SpeakSmart AI 🚀
      </h1>

      <div className="flex gap-4 mb-8">

        <button
          onClick={() => navigate("/start-interview")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          🎤 Start AI Interview
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold">
          Previous Interviews
        </h2>

        <p className="text-gray-500 mt-2">
          Your interview history will appear here.
        </p>
      </div>

    </div>
  );
}

export default Dashboard;