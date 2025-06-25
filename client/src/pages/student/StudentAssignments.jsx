import React, { useEffect, useState } from "react";
import { fetchStudentAssignments, submitAssignment } from "../../utils/api";
import Navbar from "../../components/Navbar";
import { getAuth } from "firebase/auth";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const currentUserId = getAuth().currentUser?.uid;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStudentAssignments();
        setAssignments(data);
      } catch (err) {
        console.error("Failed to load assignments:", err);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return alert("Please select a file.");

    try {
      setSubmittingId(assignmentId);
      await submitAssignment(assignmentId, file);
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      const updated = await fetchStudentAssignments();
      setAssignments(updated);
    } catch (err) {
      console.error("Submission error:", err);
      alert(err?.response?.data?.message || "Submission failed");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Navbar userType="student" />
      <div className="p-6">
        {/* Glowing background effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 opacity-10 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-indigo-400 mb-12 text-center">
            📚 My Assignments
          </h2>

          <div className="space-y-12">
            {assignments.map((assignment) => {
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
                      <p className="text-gray-200">{assignment.description}</p>
                      <div className="text-sm text-gray-400">
                        <strong>Course:</strong> {assignment.course?.title || "Unknown"}
                      </div>
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
                       <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-sm space-y-2">
                          <div className="text-green-400 font-semibold">
                            ✅ Submitted on{" "}
                            <span className="text-white">
                              {new Date(submission.submittedAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-gray-300">
                            📄 Submission File:{" "}
                            <a
                              href={submission.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:underline font-medium break-all"
                            >
                              {submission.fileUrl.split("/").pop().split("?")[0]}
                            </a>
                          </div>

                          {submission.grade !== null && submission.grade !== undefined ? (
                            <div className="bg-indigo-600/20 border border-indigo-500 text-indigo-200 px-3 py-2 rounded-md">
                              <p>
                                <span className="font-semibold">Grade:</span> {submission.grade}/10
                              </p>
                              {submission.feedback && (
                                <p>
                                  <span className="font-semibold">Feedback:</span>{" "}
                                  <span className="text-gray-200">{submission.feedback}</span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-yellow-400 italic font-medium">Not graded yet</p>
                          )}
                        </div>

                        ) : isLate ? (
                        <div className="text-red-400 font-semibold text-sm mt-2">
                          ❌ Deadline passed
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleSubmit(e, assignment._id)} className="space-y-3">
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
                                  [assignment._id]: e.target.files[0]?.name || "",
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
            })}

            {assignments.length === 0 && (
              <div className="text-gray-400 text-center mt-20 text-lg font-medium">
                No assignments available from your enrolled courses.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;
