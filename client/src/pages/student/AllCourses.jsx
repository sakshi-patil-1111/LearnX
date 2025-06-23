import React, { useEffect, useState } from "react";
import {
  fetchAllCourses,
  enrollInCourse,
  getCourseById,
  getUserEnrolledCourses,
} from "../../utils/api";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetchAllCourses();
        setCourses(res.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err.message);
      }
    };

    const loadEnrolledCourses = async () => {
      try {
        const res = await getUserEnrolledCourses();
        const ids = res.courses.map((course) => course._id);
        setEnrolledCourseIds(ids);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err.message);
      }
    };

    loadCourses();
    loadEnrolledCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!window.confirm("Do you want to enroll in this course?")) return;
    setEnrollingCourseId(courseId);
    try {
      await enrollInCourse(courseId);
      setEnrolledCourseIds((prev) => [...prev, courseId]);
      alert("Enrolled successfully!");
    } catch (err) {
      console.error("Enrollment failed:", err.message);
      alert("Enrollment failed.");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleViewDetails = async (courseId) => {
    try {
      await getCourseById(courseId); 
      navigate(`/student/courses/${courseId}`);
    } catch (err) {
      console.error("Access denied:", err.message);
      alert("Please enroll in the course to view details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-indigo-400 mb-8">All Available Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course._id);
            return (
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

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleViewDetails(course._id)}
                    className="px-4 py-2 bg-indigo-500 rounded text-white hover:bg-indigo-600"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    disabled={isEnrolled || enrollingCourseId === course._id}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isEnrolled
                      ? "Already Enrolled"
                      : enrollingCourseId === course._id
                      ? "Enrolling..."
                      : "Add Course"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
