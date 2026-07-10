import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import PrimaryButton from "../components/PrimaryButton";

function StartInterview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleGenerateInterview = async () => {
    if (!company || !role || !type || !difficulty) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await API.post("/interviews/start", {
        company,
        role,
        type,
        difficulty,
      });

      alert("Interview Generated Successfully!");

      navigate(`/interview/${res.data.interview._id}`);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to generate interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Start AI Interview
        </h1>

        <InputField
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Google"
        />

        <InputField
          label="Job Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Full Stack Developer"
        />

        <SelectField
          label="Interview Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={["Technical", "HR", "Mixed"]}
        />

        <SelectField
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          options={["Easy", "Medium", "Hard"]}
        />

        <PrimaryButton
          title={loading ? "Generating..." : "Generate Interview"}
          onClick={handleGenerateInterview}
        />
      </div>
    </div>
  );
}

export default StartInterview;
