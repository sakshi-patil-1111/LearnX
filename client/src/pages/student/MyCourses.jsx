import React, { useEffect, useState } from "react";
import { getUserEnrolledCourses, getCourseById } from "../../utils/api";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await getUserEnrolledCourses();
        setCourses(res.courses || []);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err.message);
      }
    };

    loadCourses();
  }, []);

  const handleViewDetails = async (courseId) => {
    try {
      await getCourseById(courseId);
      navigate(`/student/courses/${courseId}`);
    } catch (err) {
      console.error("Access denied:", err.message);
      alert("You are not authorized to view this course.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-indigo-400 mb-8">My Enrolled Courses</h1>

        {courses.length === 0 ? (
          <p className="text-gray-400">You are not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
              >
                <h2 className="text-xl font-bold text-white">{course.title}</h2>
                <p className="text-gray-400">{course.description}</p>
                <div className="flex justify-between text-sm text-gray-400 mt-4">
                  <span>Instructor: {course.instructorName || "Unknown"}</span>
                  <span>Code: {course.code}</span>
                </div>

                <div className="flex justify-start items-center mt-4">
                  <button
                    onClick={() => handleViewDetails(course._id)}
                    className="px-4 py-2 bg-indigo-500 rounded text-white hover:bg-indigo-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
