import React from "react";
import Navbar from "../../components/Navbar";

const Announcements = () => {
  // Mock data for announcements
  const announcements = [
    {
      id: 1,
      title: "New Module Available",
      content:
        "We've just added a new module on Advanced Data Structures. Please complete it before the upcoming quiz.",
      course: "Data Structures and Algorithms",
      instructor: "Prof. Michael Chen",
      date: "2 hours ago",
      priority: "High",
    },
    {
      id: 2,
      title: "Assignment Deadline Extended",
      content:
        "Due to technical issues, the deadline for the Web Development project has been extended by 2 days.",
      course: "Web Development Fundamentals",
      instructor: "Dr. Emily Brown",
      date: "1 day ago",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Course Schedule Update",
      content:
        "The next live session for Introduction to Programming will be held on Friday at 2 PM instead of the regular time.",
      course: "Introduction to Programming",
      instructor: "Dr. Sarah Johnson",
      date: "2 days ago",
      priority: "Low",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-400">
              Announcements
            </h1>
          </div>

          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-1"
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
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">
                      Posted by {announcement.instructor}
                    </span>
                    <span className="text-sm text-gray-400">
                      {announcement.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
