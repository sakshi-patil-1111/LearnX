import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getUserEnrolledCourses,
  fetchStudentAssignments,
} from "../../utils/api";
import axios from "axios";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Announcements are still mock data
  const announcements = [
    {
      id: 1,
      title: "New Module Available",
      course: "Data Structures and Algorithms",
      content:
        "We've just added a new module on Advanced Data Structures. Please complete it before the upcoming quiz.",
      instructor: "Prof. Michael Chen",
      date: "2 hours ago",
      priority: "High",
    },
    {
      id: 2,
      title: "Assignment Deadline Extended",
      course: "Web Development Fundamentals",
      content:
        "Due to technical issues, the deadline for the Web Development project has been extended by 2 days.",
      instructor: "Dr. Emily Brown",
      date: "1 day ago",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Course Schedule Update",
      course: "Introduction to Programming",
      content:
        "The next live session for Introduction to Programming will be held on Friday at 2 PM instead of the regular time.",
      instructor: "Dr. Sarah Johnson",
      date: "2 days ago",
      priority: "Low",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const token = await user.getIdToken();
        const profileRes = await axios.get(
          "http://localhost:8080/api/users/student/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(profileRes.data.student);

        // Fetch courses and materials
        const coursesRes = await getUserEnrolledCourses();
        setCourses(coursesRes.courses || []);
        // Flatten and sort all materials from all courses
        const allMaterials = (coursesRes.courses || [])
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
        const assignmentsRes = await fetchStudentAssignments();
        // If assignmentsRes is an array, use it directly; if it's an object, use assignments property
        const assignmentsArr = Array.isArray(assignmentsRes)
          ? assignmentsRes
          : assignmentsRes.assignments || [];
        // Sort by due date ascending
        assignmentsArr.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setAssignments(assignmentsArr.slice(0, 3));
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <Navbar userType="student" />
      <div className="p-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold text-indigo-400 mb-8">
            Student Dashboard
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
                      "https://api.dicebear.com/8.x/thumbs/svg?seed=Student"
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
                  viewAllLink="/student/courses"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        Instructor: {item.instructorName || "Unknown"}
                      </div>
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Materials"
                  items={materials}
                  viewAllLink="/student/materials"
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
                  viewAllLink="/student/assignments"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        {item.course?.title || "Unknown Course"} • Due:{" "}
                        {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 text-sm hover:underline"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Announcements"
                  items={announcements}
                  viewAllLink="/student/announcements"
                  renderItem={(item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        {item.course} • {item.date}
                      </div>
                      <div className="text-gray-300 text-sm">
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
