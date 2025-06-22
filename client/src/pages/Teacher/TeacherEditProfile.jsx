import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import axios from "axios";

const TeacherEditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    qualification: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await axios.get("http://localhost:8080/api/users/teacher/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const t = res.data.teacher;
      setFormData({
        name: t.name || "",
        email: t.email || "",
        experience: t.experience || "",
        qualification: t.qualification || "",
        bio: t.bio || "",
        avatar: t.imageUrl || "",
      });
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      await axios.put(
        "http://localhost:8080/api/users/teacher/profile",
        {
          ...formData,
          imageUrl: formData.avatar,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
      navigate("/teacher/dashboard");
    } catch (error) {
      console.error("Error updating teacher profile:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          Edit Teacher Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex flex-col items-center">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-indigo-400 shadow-md mb-3 hover:scale-105 transition"
            />
            <input
              type="text"
              name="avatar"
              placeholder="Avatar URL"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full md:w-1/2 px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm mb-1 text-gray-300 block">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm mb-1 text-gray-300 block">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
          </div>

          <div>
            <label className="text-sm mb-1 text-gray-300 block">Experience</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm mb-1 text-gray-300 block">Qualification</label>
            <input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm mb-1 text-gray-300 block">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
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

export default TeacherEditProfile;
