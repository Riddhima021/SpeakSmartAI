import { useNavigate } from "react-router-dom";
import { FaRobot, FaArrowRight } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <div className="max-w-3xl text-center">

        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-500/20 mb-8">
          <FaRobot className="text-cyan-400 text-5xl" />
        </div>

        <h1 className="text-6xl font-bold text-white">
          SpeakSmart AI
        </h1>

        <p className="mt-6 text-xl text-slate-300 leading-8">
          Practice HR, Technical, and Behavioral interviews with AI-generated
          questions and receive instant feedback to improve your interview
          skills.
        </p>

        <div className="flex justify-center gap-5 mt-10">

          <button
            onClick={() => navigate("/login")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2"
          >
            Get Started
            <FaArrowRight />
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-semibold">
              AI Questions
            </h3>

            <p className="text-slate-300 mt-2 text-sm">
              Generate interview questions based on your target company and role.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-semibold">
              Instant Feedback
            </h3>

            <p className="text-slate-300 mt-2 text-sm">
              Receive AI-generated scores, feedback, and ideal answers.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-semibold">
              Track Progress
            </h3>

            <p className="text-slate-300 mt-2 text-sm">
              View previous interviews and monitor your improvement over time.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;