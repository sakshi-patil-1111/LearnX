import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const dummyCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn HTML, CSS, and JavaScript from scratch.",
    instructor: "John Doe",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    description: "Master the core concepts of DSA for interviews.",
    instructor: "Jane Smith",
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description: "Understand ML concepts and implement models using Python.",
    instructor: "Alice Johnson",
  },
];

const AllCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();

  const handleAddCourse = (course) => {
    if (!myCourses.find((c) => c.id === course.id)) {
      setMyCourses((prev) => [...prev, course]);
      alert(`Course "${course.title}" added to My Courses!`);
    } else {
      alert("Course already added.");
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/student/course/${id}/view`);
  };

  return (
    <>
      <Navbar userType="student" />
      <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
        <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          All Available Courses
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dummyCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-md hover:shadow-indigo-500/30 transition"
            >
              <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-300 mb-2">{course.description}</p>
              <p className="text-sm text-gray-400 mb-4">
                Instructor: {course.instructor}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleViewDetails(course.id)}
                  className="px-4 py-2 bg-transparent border border-indigo-400 text-indigo-400 rounded-md hover:bg-indigo-400 hover:text-white hover:scale-105 transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddCourse(course)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 hover:scale-105 transition"
                >
                  Add Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllCourses;
