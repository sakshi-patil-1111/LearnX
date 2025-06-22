import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";

const StudentEditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await axios.get("http://localhost:8080/api/users/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data.student);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return alert("User not authenticated");

      const token = await user.getIdToken();

      await axios.put(
        "http://localhost:8080/api/users/student/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

  if (!formData) return <div className="text-center text-white mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          Edit Student Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Avatar Preview */}
          <div className="md:col-span-2 flex flex-col items-center">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-indigo-400 shadow-md mb-3 hover:scale-105 transition"
            />
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full md:w-1/2 px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>

          {/* Other Inputs */}
          {[
            ["Name", "name"],
            ["Email", "email"],
            ["Roll Number", "rollNo"],
            ["Semester", "semester"],
            ["Course", "course"],
          ].map(([label, name]) => (
            <div key={name} className={name === "course" ? "md:col-span-2" : ""}>
              <label className="block text-sm mb-1 text-gray-300">{label}</label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
              />
            </div>
          ))}

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-gray-300">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
            ></textarea>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md transition hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEditProfile;
