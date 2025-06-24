import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  fetchAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  fetchMyCourses,
} from "../../utils/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    course: "",
    priority: "Low",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
    loadAnnouncements();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await fetchMyCourses();
      setCourses(res.courses || []);
    } catch (err) {
      setCourses([]);
    }
  };

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetchAllAnnouncements();
      setAnnouncements(res.announcements || []);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    setForm({ title: "", content: "", course: "", priority: "Low" });
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      content: announcement.content,
      course: announcement.course,
      priority: announcement.priority,
    });
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await deleteAnnouncement(id);
      loadAnnouncements();
    } catch (err) {
      alert("Failed to delete announcement");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement._id, form);
      } else {
        await createAnnouncement(form);
      }
      setShowForm(false);
      setEditingAnnouncement(null);
      loadAnnouncements();
    } catch (err) {
      alert("Failed to save announcement");
    }
  };

  const filteredAnnouncements = selectedCourse
    ? announcements.filter((a) => a.course === selectedCourse)
    : announcements;

  const getPriorityColor = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />
      <div className="p-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-400">
              Announcements
            </h1>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              Create New Announcement
            </button>
          </div>
          {/* Course filter */}
          <div className="mb-6 flex gap-4 items-center">
            <label htmlFor="courseFilter" className="text-gray-300">
              Filter by Course:
            </label>
            <select
              id="courseFilter"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="p-2 bg-gray-800 text-white rounded"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          {/* Popup Modal for Create/Edit Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-gray-900 rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-indigo-400 mb-4">
                  {editingAnnouncement
                    ? "Edit Announcement"
                    : "Create New Announcement"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    required
                  />
                  <select
                    name="course"
                    value={form.course}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleInputChange}
                    placeholder="Content"
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    required
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                      onClick={() => {
                        setShowForm(false);
                        setEditingAnnouncement(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                    >
                      {editingAnnouncement ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Announcements List */}
          {loading ? (
            <div className="text-center text-white">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-gray-400">No announcements found.</div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 mb-6 transition-transform duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-indigo-400 mb-2">
                      {announcement.title}
                    </h2>
                    <p className="text-gray-400">{announcement.course}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(
                      announcement.priority
                    )}`}
                  >
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{announcement.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Posted {new Date(announcement.createdAt).toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                      onClick={() => handleEdit(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition"
                      onClick={() => handleDelete(announcement._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
