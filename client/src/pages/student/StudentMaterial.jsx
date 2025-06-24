import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getUserEnrolledCourses } from "../../utils/api";

const StudentMaterial = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getUserEnrolledCourses();
        setCourses(res.courses || []);
      } catch (err) {
        setError("Failed to load courses or materials.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="p-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold text-indigo-400 mb-8">
            All Course Materials
          </h1>
          {loading ? (
            <p>Loading materials...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-400">
              You are not enrolled in any courses.
            </p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="mb-10 bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-bold text-indigo-300 mb-4">
                  {course.title}
                </h2>
                {course.materials && course.materials.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="p-2">Title</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Topic</th>
                        <th className="p-2">Link</th>
                        <th className="p-2">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.materials.map((mat, i) => (
                        <tr key={i} className="border-t border-gray-700">
                          <td className="p-2 text-white">{mat.title}</td>
                          <td className="p-2 text-gray-400">
                            {mat.materialType}
                          </td>
                          <td className="p-2 text-gray-400">{mat.topic}</td>
                          <td className="p-2 text-blue-400">
                            <a
                              href={mat.materialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              Open
                            </a>
                          </td>
                          <td className="p-2 text-gray-500">
                            {new Date(
                              mat.uploadedAt || Date.now()
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-400">No materials uploaded yet.</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMaterial;
