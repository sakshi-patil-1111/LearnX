import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../../utils/api";
import Navbar from "../../components/Navbar";

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        setCourse(res.course);
      } catch (err) {
        console.error("Failed to load course:", err.message);
        alert("Unable to load course. Please check your enrollment.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (!course) {
    return <div className="text-white p-10">Course not found or access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Course Info */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-indigo-400">{course.title}</h1>
          <p className="text-gray-300 mt-2">{course.description}</p>
          <div className="text-sm text-white mt-4">
            <span className="font-medium">
              Instructor: {course.instructorName || "Unknown"} | Code: {course.code}
            </span>
          </div>
        </div>

        {/* Materials List */}
        <div>
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4">Course Materials</h2>
          {course.materials?.length === 0 ? (
            <p className="text-gray-400">No materials available yet.</p>
          ) : (
            <div className="space-y-4">
              {course.materials.map((mat) => (
                <div key={mat._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white">{mat.title}</h3>
                      <p className="text-sm text-gray-400">
                        Type: {mat.materialType} {mat.topic && `| Topic: ${mat.topic}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={mat.materialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
                      >
                        View
                      </a>
                      <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetail;
