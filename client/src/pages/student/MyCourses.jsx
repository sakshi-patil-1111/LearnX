import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";

const myCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Covers HTML, CSS, JS, and responsive design.",
  },
  {
    id: 2,
    title: "Advanced DSA",
    description: "Deep dive into sorting, trees, graphs and dynamic programming.",
  },
  {
    id: 3,
    title: "Machine Learning Intro",
    description: "Supervised/unsupervised learning, evaluation and implementation.",
  },
];

const MyCourses = () => {
  const navigate = useNavigate();

  const handleViewCourse = (id) => {
    navigate(`/student/course/${id}/view`);
  };

  return (
    <>
      <Navbar userType="student" />
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
        My Courses
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-md hover:shadow-indigo-500/30 transition"
          >
            <h3 className="text-xl font-semibold text-indigo-300 mb-2">
              {course.title}
            </h3>
            <p className="text-gray-300 mb-4">{course.description}</p>
            <button
              onClick={() => handleViewCourse(course.id)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 hover:scale-105 transition"
            >
              View Course
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default MyCourses;
