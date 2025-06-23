import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getCourseById } from "../../utils/api";
import { auth } from "../../firebase";
import MaterialsTab from "./CourseTabs/MaterialsTab";
import StudentsTab from "./CourseTabs/StudentsTab";

const CourseDetail = () => {
  const { courseId } = useParams(); 
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        const currentUser = auth.currentUser;
        console.log("Current Firebase UID:", currentUser?.uid);
        console.log("Course createdBy:", data.course.createdBy);


        //Check if the logged-in teacher is the creator
        if (currentUser?.uid !== data.course.createdBy) {
        alert("You are not authorized to view this course.");
        navigate("/teacher/courses");
        return;
      }


        setCourse(data.course);
      } catch (err) {
        console.error("Failed to fetch course:", err.message);
        navigate("/teacher/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (loading) {
    return <p className="text-center text-white mt-10">Loading course details...</p>;
  }

  if (!course) {
    return <p className="text-center text-red-400 mt-10">Course not found.</p>;
  }

  const tabs = ["overview", "students", "materials"];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-400">{course.title}</h1>
          <p className="text-gray-400 mb-4">
            Code: {course.code} | Category: {course.category}
          </p>

          {/* Tabs */}
          <div className="flex space-x-6 mb-6 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 font-medium ${
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
          <div>
            {activeTab === "overview" && (
              <div className="space-y-4 bg-gray-800 p-6 rounded-md">
                <h2 className="text-xl font-bold text-indigo-400">Course Description</h2>
                <p className="text-gray-300">{course.description}</p>
                <p className="text-sm text-gray-500">
                  Created on {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {activeTab === "students" && (
              <StudentsTab students={course.enrolledStudents} />
            )}

            {activeTab === "materials" && (
              <MaterialsTab courseId={courseId} materials={course.materials} onUpdated={setCourse} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
