import React, { useState } from "react";
import { createCourse } from "../utils/api";

const CourseForm = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createCourse(formData);
      onCreated(result.course); 
      onClose(); 
    } catch (err) {
      alert("Failed to create course: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Create New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Course Title"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            name="code"
            placeholder="Course Code (e.g. CS101)"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            value={formData.code}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category (e.g. Computer Science)"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Course Description"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
