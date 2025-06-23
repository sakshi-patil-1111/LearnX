import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCourseById, getCourseById, updateCourse } from "../../utils/api"; 
import { auth } from "../../firebase";

const CourseEdit = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        const currentUser = auth.currentUser;
        if (currentUser?.uid !== data.course.createdBy) {
          alert("You are not authorized to edit this course.");
          navigate("/teacher/courses");
          return;
        }
        setCourseData(data.course);
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(courseId, courseData);
      alert("Course updated successfully!");
      navigate(`/teacher/courses/${courseId}`);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };
  const handleDeleteCourse = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this course and all its materials?");
    if (!confirmed) return;

    try {
      await deleteCourseById(courseId); 
      alert("Course deleted successfully");
      navigate("/teacher/courses"); 
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("Failed to delete course.");
    }
  };

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="code"
            value={courseData.code}
            onChange={handleChange}
            placeholder="Course Code"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="category"
            value={courseData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="thumbnail"
            value={courseData.thumbnail}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="tags"
            value={courseData.tags?.join(", ") || ""}
            onChange={(e) =>
              setCourseData({ ...courseData, tags: e.target.value.split(",").map((t) => t.trim()) })
            }
            placeholder="Tags (comma separated)"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
            >
              Update Course
            </button>

            <button
              type="button"
              onClick={handleDeleteCourse}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Delete Course
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CourseEdit;
