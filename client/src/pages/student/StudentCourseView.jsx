import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";


const StudentCourseView = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock course data
  const course = {
    id: courseId,
    title: "Introduction to Machine Learning",
    code: "ML101",
    description:
      "This course covers the basics of supervised and unsupervised learning, model evaluation, and popular algorithms like linear regression, decision trees, and neural networks.",
    progress: 65,
    teacher: {
      name: "Dr. Arvind Nair",
      email: "arvind.nair@university.edu",
      bio: "PhD in AI | 10+ years in ML research | Passionate educator and Kaggle Grandmaster.",
      avatar:
        "https://api.dicebear.com/8.x/thumbs/svg?seed=Arvind&backgroundColor=f0f0f0&scale=90",
    },
    modules: [
      {
        id: 1,
        title: "Introduction to Machine Learning",
        duration: "2 hours",
        completed: true,
      },
      {
        id: 2,
        title: "Supervised Learning Basics",
        duration: "3 hours",
        completed: true,
      },
      {
        id: 3,
        title: "Linear Regression",
        duration: "2.5 hours",
        completed: false,
      },
      {
        id: 4,
        title: "Decision Trees",
        duration: "3 hours",
        completed: false,
      },
    ],
    materials: [
      {
        id: 1,
        title: "Course Syllabus",
        type: "PDF",
        size: "2.5 MB",
        downloads: 45,
        date: "2 days ago",
      },
      {
        id: 2,
        title: "Week 1 Lecture Slides",
        type: "PPT",
        size: "5.1 MB",
        downloads: 38,
        date: "1 week ago",
      },
      {
        id: 3,
        title: "Practice Problems",
        type: "PDF",
        size: "1.8 MB",
        downloads: 32,
        date: "3 days ago",
      },
    ],
    assignments: [
      {
        id: 1,
        title: "Linear Regression Implementation",
        dueDate: "2024-03-15",
        status: "Completed",
        grade: "A",
      },
      {
        id: 2,
        title: "Decision Tree Analysis",
        dueDate: "2024-03-22",
        status: "Pending",
      },
      {
        id: 3,
        title: "Final Project",
        dueDate: "2024-04-01",
        status: "Not Started",
      },
    ],
  };

  const handleStartModule = (moduleId) => {
    navigate(`/student/course/${courseId}/module/${moduleId}`);
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
            <p className="text-white">{course.code}</p>
          </div>
          <div>
            <p className="text-gray-400">Description</p>
            <p className="text-white">{course.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400 mb-2">Course Progress</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-indigo-500 h-2.5 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-right mt-1">
            {course.progress}% Complete
          </p>
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-indigo-400 mb-4">
          Instructor Information
        </h3>
        <div className="flex items-center space-x-4">
          <img
            src={course.teacher.avatar}
            alt={course.teacher.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h4 className="text-lg font-semibold text-white">
              {course.teacher.name}
            </h4>
            <p className="text-gray-400">{course.teacher.email}</p>
            <p className="text-gray-400">{course.teacher.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-400">Course Modules</h3>
      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-700">
          {course.modules.map((module) => (
            <div
              key={module.id}
              className="p-6 hover:bg-gray-700/50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {module.title}
                  </h4>
                  <p className="text-gray-400">Duration: {module.duration}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {module.completed && (
                    <span className="text-green-400">Completed</span>
                  )}
                  <button
                    onClick={() => handleStartModule(module.id)}
                    className={`px-4 py-2 rounded-md transition ${
                      module.completed
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                  >
                    {module.completed ? "Review" : "Start"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-400">Course Materials</h3>
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
            {course.materials.map((material) => (
              <tr key={material.id} className="border-t border-gray-700">
                <td className="p-4 text-white">{material.title}</td>
                <td className="p-4 text-gray-400">{material.type}</td>
                <td className="p-4 text-gray-400">{material.size}</td>
                <td className="p-4 text-gray-400">{material.downloads}</td>
                <td className="p-4 text-gray-400">{material.date}</td>
                <td className="p-4">
                  <button className="text-indigo-400 hover:text-indigo-300">
                    Download
                  </button>
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
      <h3 className="text-xl font-bold text-indigo-400">Assignments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {course.assignments.map((assignment) => (
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
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    assignment.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : assignment.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {assignment.status}
                </span>
              </div>
              {assignment.grade && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Grade:</span>
                  <span className="text-white">{assignment.grade}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className={`px-4 py-2 rounded-md transition ${
                  assignment.status === "Completed"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                {assignment.status === "Completed"
                  ? "View Submission"
                  : "Submit"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-indigo-400 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-400">Course Code: {course.code}</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-700">
            {["overview", "modules", "materials", "assignments"].map((tab) => (
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
            {activeTab === "modules" && renderModules()}
            {activeTab === "materials" && renderMaterials()}
            {activeTab === "assignments" && renderAssignments()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseView;
