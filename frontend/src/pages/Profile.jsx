import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    targetRole: "",
    college: "",
    graduationYear: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      await API.put("/users/profile", {
        name: user.name,
        targetRole: user.targetRole,
        college: user.college,
        graduationYear: user.graduationYear,
      });

      toast.success("Profile Updated");
    } catch (err) {
      console.log(err);
      toast.error("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-10 px-5">

      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10">

        <div className="flex flex-col items-center">

          <FaUserCircle className="text-cyan-400 text-8xl mb-4" />

          <h1 className="text-4xl font-bold text-white">
            My Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account information
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div>
            <label className="text-slate-300">Name</label>

            <input
              className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-slate-300">Email</label>

            <input
              disabled
              className="w-full mt-2 p-4 rounded-xl bg-slate-700 text-gray-400 border border-slate-700"
              value={user.email}
            />
          </div>

          <div>
            <label className="text-slate-300">Target Role</label>

            <input
              className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
              value={user.targetRole}
              onChange={(e) =>
                setUser({
                  ...user,
                  targetRole: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-300">College</label>

            <input
              className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
              value={user.college}
              onChange={(e) =>
                setUser({
                  ...user,
                  college: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-300">
              Graduation Year
            </label>

            <input
              className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
              value={user.graduationYear}
              onChange={(e) =>
                setUser({
                  ...user,
                  graduationYear: e.target.value,
                })
              }
            />
          </div>

        </div>

        <div className="text-center mt-10">

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>

    </>
  );
}

export default Profile;