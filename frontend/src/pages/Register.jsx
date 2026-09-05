import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  FaRobot,
  FaUser,
  FaEnvelope,
  FaLock,
  FaGraduationCap,
  FaUniversity,
  FaBriefcase,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    targetRole: "",
    graduationYear: "",
    college: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", formData);

      toast.success("Registration Successful!");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        <div className="flex flex-col items-center mb-8">

          <div className="bg-cyan-500/20 p-5 rounded-full">
            <FaRobot className="text-cyan-400 text-5xl" />
          </div>

          <h1 className="text-4xl font-bold text-white mt-5">
            Create Account
          </h1>

          <p className="text-slate-300 mt-2">
            Join SpeakSmart AI
          </p>

        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <Input
            icon={<FaUser />}
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            icon={<FaEnvelope />}
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="flex items-center bg-slate-800 rounded-xl px-4">

            <FaLock className="text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent p-4 text-white outline-none"
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

          <Input
            icon={<FaBriefcase />}
            name="targetRole"
            placeholder="Target Role"
            value={formData.targetRole}
            onChange={handleChange}
          />

          <Input
            icon={<FaGraduationCap />}
            name="graduationYear"
            placeholder="Graduation Year"
            value={formData.graduationYear}
            onChange={handleChange}
          />

          <Input
            icon={<FaUniversity />}
            name="college"
            placeholder="College Name"
            value={formData.college}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 transition duration-300 text-white py-4 rounded-xl font-semibold"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-slate-300 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

function Input({
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center bg-slate-800 rounded-xl px-4">

      <div className="text-slate-400">
        {icon}
      </div>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent p-4 text-white outline-none"
      />

    </div>
  );
}

export default Register;