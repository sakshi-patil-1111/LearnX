import React, { useState } from "react";
import Navbar from "../../components/Navbar";

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - Replace with actual data from your backend
  const courseData = {
    id: 1,
    title: "Mathematics 101",
    code: "MATH101",
    description:
      "An introductory course covering fundamental mathematical concepts including algebra, calculus, and statistics.",
    teacher: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      specialization: "Applied Mathematics",
      experience: "15 years",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    students: [
      { id: 1, name: "John Doe", email: "john@student.edu", progress: 85 },
      { id: 2, name: "Jane Smith", email: "jane@student.edu", progress: 92 },
      { id: 3, name: "Mike Johnson", email: "mike@student.edu", progress: 78 },
      {
        id: 4,
        name: "Sarah Williams",
        email: "sarah@student.edu",
        progress: 88,
      },
    ],
    announcements: [
      {
        id: 1,
        title: "Mid-term Schedule",
        content: "The mid-term examination will be held on March 25th, 2024.",
        date: "1 day ago",
        priority: "High",
      },
      {
        id: 2,
        title: "Assignment Deadline Extended",
        content:
          "The deadline for the calculus assignment has been extended to next Friday.",
        date: "3 days ago",
        priority: "Medium",
      },
    ],
    materials: [
      {
        id: 1,
        title: "Calculus Fundamentals",
        type: "PDF",
        size: "2.4 MB",
        downloads: 45,
        date: "2 days ago",
      },
      {
        id: 2,
        title: "Algebra Practice Problems",
        type: "PDF",
        size: "1.8 MB",
        downloads: 38,
        date: "1 week ago",
      },
    ],
    assignments: [
      {
        id: 1,
        title: "Calculus Quiz",
        dueDate: "2024-03-20",
        submissions: 28,
        totalStudents: 30,
        status: "Active",
      },
      {
        id: 2,
        title: "Algebra Assignment",
        dueDate: "2024-03-15",
        submissions: 25,
        totalStudents: 30,
        status: "Graded",
      },
    ],
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
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

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-indigo-400 mb-4">
          Course Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Course Code</p>
            <p className="text-white">{courseData.code}</p>
          </div>
          <div>
            <p className="text-gray-400">Description</p>
            <p className="text-white">{courseData.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-indigo-400 mb-4">
          Teacher Information
        </h3>
        <div className="flex items-center space-x-4">
          <img
            src={courseData.teacher.image}
            alt={courseData.teacher.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h4 className="text-lg font-semibold text-white">
              {courseData.teacher.name}
            </h4>
            <p className="text-gray-400">{courseData.teacher.email}</p>
            <p className="text-gray-400">
              Specialization: {courseData.teacher.specialization}
            </p>
            <p className="text-gray-400">
              Experience: {courseData.teacher.experience}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-indigo-400">Enrolled Students</h3>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
          Add Student
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-4">Name</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Progress</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseData.students.map((student) => (
              <tr key={student.id} className="border-t border-gray-700">
                <td className="py-4 text-white">{student.name}</td>
                <td className="py-4 text-gray-400">{student.email}</td>
                <td className="py-4">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-4">
                  <button className="text-indigo-400 hover:text-indigo-300">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-400">Announcements</h3>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
          Create Announcement
        </button>
      </div>
      {courseData.announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {announcement.title}
              </h4>
              <p className="text-gray-400">{announcement.content}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(
                announcement.priority
              )}`}
            >
              {announcement.priority}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              Posted {announcement.date}
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
                Edit
              </button>
              <button className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-400">Course Materials</h3>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
          Upload Material
        </button>
      </div>
      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Size</th>
              <th className="p-4">Downloads</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseData.materials.map((material) => (
              <tr key={material.id} className="border-t border-gray-700">
                <td className="p-4 text-white">{material.title}</td>
                <td className="p-4 text-gray-400">{material.type}</td>
                <td className="p-4 text-gray-400">{material.size}</td>
                <td className="p-4 text-gray-400">{material.downloads}</td>
                <td className="p-4 text-gray-400">{material.date}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className="text-indigo-400 hover:text-indigo-300">
                      Download
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-400">Assignments</h3>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
          Create Assignment
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courseData.assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6"
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {assignment.title}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Due Date:</span>
                <span className="text-white">{assignment.dueDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Submissions:</span>
                <span className="text-white">
                  {assignment.submissions}/{assignment.totalStudents}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    assignment.status === "Active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {assignment.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
                Edit
              </button>
              <button className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
                View Submissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-indigo-400 mb-2">
              {courseData.title}
            </h1>
            <p className="text-gray-400">Course Code: {courseData.code}</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-700">
            {[
              "overview",
              "students",
              "announcements",
              "materials",
              "assignments",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                  activeTab === tab
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "students" && renderStudents()}
            {activeTab === "announcements" && renderAnnouncements()}
            {activeTab === "materials" && renderMaterials()}
            {activeTab === "assignments" && renderAssignments()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
