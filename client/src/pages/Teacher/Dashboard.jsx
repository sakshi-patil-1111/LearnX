import React from "react";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  // Mock data - Replace with actual data from your backend
  const recentCourses = [
    {
      id: 1,
      title: "Mathematics 101",
      students: 45,
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      title: "Physics Advanced",
      students: 32,
      lastUpdated: "1 week ago",
    },
    {
      id: 3,
      title: "Chemistry Basics",
      students: 28,
      lastUpdated: "3 days ago",
    },
  ];

  const recentMaterials = [
    {
      id: 1,
      title: "Algebra Notes",
      course: "Mathematics 101",
      date: "1 day ago",
    },
    {
      id: 2,
      title: "Physics Lab Manual",
      course: "Physics Advanced",
      date: "2 days ago",
    },
    {
      id: 3,
      title: "Chemical Reactions",
      course: "Chemistry Basics",
      date: "4 days ago",
    },
  ];

  const recentAssignments = [
    {
      id: 1,
      title: "Algebra Quiz",
      course: "Mathematics 101",
      dueDate: "2024-03-20",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      course: "Physics Advanced",
      dueDate: "2024-03-22",
    },
    {
      id: 3,
      title: "Chemical Equations",
      course: "Chemistry Basics",
      dueDate: "2024-03-25",
    },
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "Mid-term Schedule",
      course: "Mathematics 101",
      date: "1 day ago",
    },
    {
      id: 2,
      title: "Lab Safety Guidelines",
      course: "Physics Advanced",
      date: "2 days ago",
    },
    {
      id: 3,
      title: "Course Materials Update",
      course: "Chemistry Basics",
      date: "3 days ago",
    },
  ];

  const DashboardSection = ({ title, items, viewAllLink }) => (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 h-full transition-transform duration-300 hover:transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-400">{title}</h2>
        <a
          href={viewAllLink}
          className="text-white hover:text-indigo-300 transition-colors duration-200"
        >
          View All →
        </a>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
          >
            <div className="text-white font-medium">{item.title}</div>
            <div className="text-gray-400 text-sm">
              {item.course && `${item.course} • `}
              {item.date || item.dueDate || item.lastUpdated}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      {/* Main Content */}
      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold text-indigo-400 mb-8">
            Teacher Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardSection
              title="Recent Courses"
              items={recentCourses}
              viewAllLink="/teacher/courses"
            />

            <DashboardSection
              title="Recent Materials"
              items={recentMaterials}
              viewAllLink="/teacher/materials"
            />

            <DashboardSection
              title="Recent Assignments"
              items={recentAssignments}
              viewAllLink="/teacher/assignments"
            />

            <DashboardSection
              title="Recent Announcements"
              items={recentAnnouncements}
              viewAllLink="/teacher/announcements"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
