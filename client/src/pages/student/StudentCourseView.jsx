import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCourseById,
  fetchAnnouncementsByCourse,
  fetchAssignmentsByCourse,
  fetchAllAnnouncements,
  submitAssignment,
} from "../../utils/api";
import Navbar from "../../components/Navbar";
import StudentsTab from "../Teacher/CourseTabs/StudentsTab";
import StudentAttendanceView from "./StudentAttendanceView";
import { getAuth } from "firebase/auth";

const getPriorityColor = (priority) => {
  switch ((priority || "").toLowerCase()) {
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

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const currentUserId = getAuth().currentUser?.uid;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        setCourse(res.course);
        // Announcements: fallback to fetchAllAnnouncements and filter by code, title, or id
        let annRes;
        try {
          annRes = await fetchAnnouncementsByCourse(courseId);
        } catch {
          annRes = await fetchAllAnnouncements();
        }
        let filtered = (annRes.announcements || []).filter(
          (a) =>
            a.course === res.course.code ||
            a.course === res.course.title ||
            a.course === courseId
        );
        setAnnouncements(filtered);
        // Fetch assignments for this course
        const assignRes = await fetchAssignmentsByCourse(courseId);
        setAssignments(assignRes.assignments || []);
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
    return (
      <div className="text-white p-10">Course not found or access denied.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Course Info */}
        <h1 className="text-3xl font-bold text-indigo-400">{course.title}</h1>
        <p className="text-gray-400 mb-4">Course Code: {course.code}</p>
        {/* Tabs */}
        <div className="flex space-x-6 mb-6 border-b border-gray-700">
          {[
            "overview",
            "students",
            "materials",
            "attendance",
            "announcements",
            "assignments",
          ].map((tab) => (
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
              <h2 className="text-xl font-bold text-indigo-400">
                Course Description
              </h2>
              <p className="text-gray-300">{course.description}</p>
              <p className="text-sm text-gray-500">
                Instructor: {course.instructorName || "Unknown"} | Created on{" "}
                {new Date(course.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {activeTab === "students" && (
            <StudentsTab students={course.enrolledStudents} />
          )}
          {activeTab === "materials" && (
            <div className="space-y-6">
              <div className="bg-gray-800/80 backdrop-blur-md rounded-lg overflow-hidden">
                {course.materials?.length === 0 ? (
                  <p className="p-4 text-gray-400">
                    No materials available yet.
                  </p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="p-4">Title</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Topic</th>
                        <th className="p-4">URL</th>
                        <th className="p-4">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.materials.map((material, index) => (
                        <tr key={index} className="border-t border-gray-700">
                          <td className="p-4 text-white">{material.title}</td>
                          <td className="p-4 text-gray-400">
                            {material.materialType}
                          </td>
                          <td className="p-4 text-gray-400">
                            {material.topic || "—"}
                          </td>
                          <td className="p-4 text-blue-400">
                            <a
                              href={material.materialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open
                            </a>
                          </td>
                          <td className="p-4 text-gray-400">
                            {material.uploadedAt
                              ? new Date(
                                  material.uploadedAt
                                ).toLocaleDateString()
                              : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activeTab === "attendance" && (
            <StudentAttendanceView courseId={courseId} />
          )}
          {activeTab === "announcements" && (
            <div className="space-y-4 bg-gray-800 p-6 rounded-md">
              <h2 className="text-xl font-bold text-indigo-400 mb-4">
                Announcements
              </h2>
              {announcements.length === 0 ? (
                <p className="text-gray-400">
                  No announcements for this course.
                </p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div
                      key={a._id}
                      className="bg-gray-900/80 rounded-lg p-4 shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold text-indigo-300">
                          {a.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 ${getPriorityColor(
                            a.priority
                          )}`}
                        >
                          {a.priority}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mb-1">
                        {a.course} •{" "}
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleString()
                          : ""}
                      </div>
                      <div className="text-gray-300">{a.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "assignments" && (
            <div className="space-y-12 bg-gray-800 p-6 rounded-md">
              <h2 className="text-xl font-bold text-indigo-400 mb-4">
                Assignments
              </h2>
              {assignments.length === 0 ? (
                <p className="text-gray-400">No assignments for this course.</p>
              ) : (
                assignments.map((assignment) => {
                  const submission = assignment.submissions?.find(
                    (s) => s.studentId === currentUserId
                  );
                  const isLate = new Date() > new Date(assignment.dueDate);
                  return (
                    <div
                      key={assignment._id}
                      className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-2xl p-8 backdrop-blur-lg hover:shadow-indigo-500/20 transition duration-300"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left: Assignment Info */}
                        <div className="col-span-2 space-y-3">
                          <h3 className="text-2xl font-bold text-indigo-300">
                            {assignment.title}
                          </h3>
                          <p className="text-gray-200">
                            {assignment.description}
                          </p>
                          <div className="text-sm text-gray-400">
                            <strong>Due:</strong>{" "}
                            {new Date(assignment.dueDate).toLocaleString()}
                          </div>
                        </div>
                        {/* Right: Actions */}
                        <div className="space-y-4 flex flex-col justify-between">
                          <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium text-center transition"
                          >
                            📥 Download File
                          </a>
                          {submission ? (
                            <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 text-sm">
                              <p className="text-green-400 font-semibold">
                                ✅ Submitted on{" "}
                                {new Date(
                                  submission.submittedAt
                                ).toLocaleString()}
                              </p>
                              <p className="text-gray-300 break-all mt-1">
                                📄{" "}
                                <a
                                  href={submission.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-400 underline"
                                >
                                  {
                                    submission.fileUrl
                                      .split("/")
                                      .pop()
                                      .split("?")[0]
                                  }
                                </a>
                              </p>
                            </div>
                          ) : isLate ? (
                            <div className="text-red-400 font-semibold text-sm mt-2">
                              ❌ Deadline passed
                            </div>
                          ) : (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const file = e.target.file.files[0];
                                if (!file)
                                  return alert("Please select a file.");
                                try {
                                  setSubmittingId(assignment._id);
                                  await submitAssignment(assignment._id, file);
                                  setSelectedFiles((prev) => ({
                                    ...prev,
                                    [assignment._id]: null,
                                  }));
                                  // Refresh assignments
                                  const assignRes =
                                    await fetchAssignmentsByCourse(courseId);
                                  setAssignments(assignRes.assignments || []);
                                } catch (err) {
                                  alert(
                                    err?.response?.data?.message ||
                                      "Submission failed"
                                  );
                                } finally {
                                  setSubmittingId(null);
                                }
                              }}
                              className="space-y-3"
                            >
                              <label className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium text-sm cursor-pointer border border-gray-600 hover:bg-white/20 transition block text-center">
                                📁 Choose File
                                <input
                                  type="file"
                                  name="file"
                                  accept=".pdf,.txt"
                                  className="hidden"
                                  required
                                  onChange={(e) =>
                                    setSelectedFiles((prev) => ({
                                      ...prev,
                                      [assignment._id]:
                                        e.target.files[0]?.name || "",
                                    }))
                                  }
                                />
                              </label>
                              {selectedFiles[assignment._id] && (
                                <div className="text-sm text-gray-300 font-mono break-all">
                                  📄 {selectedFiles[assignment._id]}
                                </div>
                              )}
                              <button
                                type="submit"
                                disabled={submittingId === assignment._id}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium w-full transition"
                              >
                                {submittingId === assignment._id
                                  ? "Submitting..."
                                  : "Submit Assignment"}
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetail;
