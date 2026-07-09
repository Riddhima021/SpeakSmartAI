import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen p-10">

      <h1 className="text-4xl font-bold">

        Welcome to SpeakSmart AI 🚀

      </h1>

      <button
        onClick={logout}
        className="mt-8 bg-red-500 text-white px-5 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}

export default Dashboard;