import React from "react";
import Navbar from "../../components/Navbar";

const Courses = () => {
  // Mock data - Replace with actual data from your backend
  const courses = [
    {
      id: 1,
      title: "Mathematics 101",
      description: "Introduction to basic mathematical concepts",
      students: 45,
      lastUpdated: "2 days ago",
      status: "Active",
    },
    {
      id: 2,
      title: "Physics Advanced",
      description: "Advanced physics concepts and applications",
      students: 32,
      lastUpdated: "1 week ago",
      status: "Active",
    },
    {
      id: 3,
      title: "Chemistry Basics",
      description: "Fundamental concepts in chemistry",
      students: 28,
      lastUpdated: "3 days ago",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-400">My Courses</h1>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
              Create New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-indigo-400">
                    {course.title}
                  </h2>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                    {course.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{course.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>👥 {course.students} Students</span>
                  <span>🕒 {course.lastUpdated}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
