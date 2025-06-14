import React from "react";
import Navbar from "../../components/Navbar";

const Assignments = () => {
  // Mock data 
  const assignments = [
    {
      id: 1,
      title: "Algebra Quiz",
      course: "Mathematics 101",
      dueDate: "2024-03-20",
      submissions: 38,
      totalStudents: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      course: "Physics Advanced",
      dueDate: "2024-03-22",
      submissions: 25,
      totalStudents: 32,
      status: "Active",
    },
    {
      id: 3,
      title: "Chemical Equations",
      course: "Chemistry Basics",
      dueDate: "2024-03-25",
      submissions: 20,
      totalStudents: 28,
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
            <h1 className="text-3xl font-bold text-indigo-400">Assignments</h1>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
              Create New Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-indigo-400">
                    {assignment.title}
                  </h2>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                    {assignment.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-400">Course: {assignment.course}</p>
                  <p className="text-gray-400">
                    Due Date: {assignment.dueDate}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (assignment.submissions / assignment.totalStudents) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {assignment.submissions} of {assignment.totalStudents}{" "}
                    students submitted
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
                    View Submissions
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

export default Assignments;