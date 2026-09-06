import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaRobot, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token);

      toast.success("Login Successful!");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-cyan-500/20 p-5 rounded-full">
            <FaRobot className="text-cyan-400 text-5xl" />
          </div>

          <h1 className="text-4xl font-bold text-white mt-5">SpeakSmart AI</h1>

          <p className="text-slate-300 mt-2 text-center">
            Practice interviews with AI and boost your confidence.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="text-slate-300 font-medium">Email</label>

          <div className="flex items-center bg-slate-800 rounded-xl px-4 mt-2 mb-5">
            <FaEnvelope className="text-slate-400" />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent p-4 text-white outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label className="text-slate-300 font-medium">Password</label>

          <div className="flex items-center bg-slate-800 rounded-xl px-4 mt-2">
            <FaLock className="text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-transparent p-4 text-white outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-slate-400" />
              ) : (
                <FaEye className="text-slate-400" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 transition-all duration-300 text-white py-4 rounded-xl font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-slate-300 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
