import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../firebase";
import Navbar from "../../components/Navbar";

const CreateAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: "",
    file: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/courses/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("dueDate", form.dueDate);
      formData.append("courseId", form.courseId);
      formData.append("file", form.file);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Assignment created successfully!");
      navigate("/teacher/assignments"); // ✅ Redirect here after success
    } catch (error) {
      console.error("Error uploading assignment:", error);
      alert("Failed to create assignment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8 relative z-10">
          <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
            Create Assignment
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Course</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Upload File (PDF/Text)
              </label>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                required
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md transition hover:scale-105"
              >
                Upload Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
