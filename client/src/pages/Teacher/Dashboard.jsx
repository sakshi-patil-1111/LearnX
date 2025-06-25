import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  fetchMyCourses,
  fetchTeacherAssignments,
  fetchAllAnnouncements,
} from "../../utils/api";
import axios from "axios";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch teacher profile
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const token = await user.getIdToken();
        const profileRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/teacher/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(profileRes.data.teacher);

        // Fetch courses and materials
        const coursesRes = await fetchMyCourses();
        const courseArr = coursesRes.courses || [];
        setCourses(courseArr);
        // Flatten and sort all materials from all courses
        const allMaterials = courseArr
          .flatMap((course) =>
            (course.materials || []).map((mat) => ({
              ...mat,
              courseTitle: course.title,
            }))
          )
          .sort(
            (a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0)
          );
        setMaterials(allMaterials.slice(0, 3));

        // Fetch assignments
        const assignmentsRes = await fetchTeacherAssignments();
        const assignmentsArr = Array.isArray(assignmentsRes.assignments)
          ? assignmentsRes.assignments
          : assignmentsRes;
        assignmentsArr.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setAssignments(assignmentsArr.slice(0, 3));

        // Fetch announcements
        const announcementsRes = await fetchAllAnnouncements();
        setAnnouncements(
          (announcementsRes.announcements || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
        );
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const DashboardSection = ({ title, items, viewAllLink, renderItem }) => (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 h-full transition-transform duration-300 hover:transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-400">{title}</h2>
        <Link
          to={viewAllLink}
          className="text-white hover:text-indigo-300 transition-colors duration-200"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-gray-400">No data available.</div>
        ) : (
          items.map(renderItem)
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />
      <div className="p-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold text-indigo-400 mb-8">
            Teacher Dashboard
          </h1>
          {loading ? (
            <div className="text-center text-white">Loading dashboard...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            <>
              {profile && (
                <div className="mb-8 bg-gray-800/80 rounded-lg p-6 flex items-center gap-6">
                  <img
                    src={
                      profile.imageUrl ||
                      "https://api.dicebear.com/8.x/thumbs/svg?seed=Teacher"
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-indigo-400 object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-300">
                      Welcome, {profile.name}!
                    </h2>
                    <p className="text-gray-400">{profile.email}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardSection
                  title="Recent Courses"
                  items={courses.slice(0, 3)}
                  viewAllLink="/teacher/courses"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        {item.category || "No category"}
                      </div>
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Materials"
                  items={materials}
                  viewAllLink="/teacher/materials"
                  renderItem={(item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        {item.courseTitle} • {item.materialType} •{" "}
                        {item.topic || "No topic"}
                      </div>
                      <a
                        href={item.materialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 text-sm hover:underline"
                      >
                        Open
                      </a>
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Assignments"
                  items={assignments}
                  viewAllLink="/teacher/assignments"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        {item.courseTitle || "No course"} • Due:{" "}
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Announcements"
                  items={announcements}
                  viewAllLink="/teacher/announcements"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium flex items-center gap-2">
                        {item.title}
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {item.course} •{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : ""}
                      </div>
                      <div className="text-gray-300 text-sm mt-1">
                        {item.content}
                      </div>
                    </div>
                  )}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
