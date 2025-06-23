import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import axios from "axios";
import Navbar from "../../components/Navbar";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();

        const res = await axios.get("http://localhost:8080/api/assignments/teacher", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetched = res.data.assignments || [];
        setAssignments(fetched);
        const tabState = {};
        fetched.forEach((a) => (tabState[a._id] = "details"));
        setActiveTab(tabState);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        alert("Error fetching assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleTabChange = async (assignmentId, tab) => {
    setActiveTab((prev) => ({ ...prev, [assignmentId]: tab }));

    if (tab === "submissions" && !submissions[assignmentId]) {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          `http://localhost:8080/api/assignments/${assignmentId}/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions((prev) => ({ ...prev, [assignmentId]: res.data.submissions }));
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-indigo-400">Your Assignments</h2>
          <button
            onClick={() => navigate("/teacher/create-assignment")}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-lg font-medium transition hover:scale-105"
          >
            + Upload Assignment
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-300">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-center text-gray-400">No assignments found.</p>
        ) : (
          <div className="space-y-8">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md"
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-2xl font-semibold text-indigo-300">{a.title}</h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleTabChange(a._id, "details")}
                      className={`px-4 py-1.5 text-sm rounded-full font-medium transition ${
                        activeTab[a._id] === "details"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-indigo-600"
                      }`}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleTabChange(a._id, "submissions")}
                      className={`px-4 py-1.5 text-sm rounded-full font-medium transition ${
                        activeTab[a._id] === "submissions"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-indigo-600"
                      }`}
                    >
                      Submissions
                    </button>
                    <a
                      href={a.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 text-sm bg-gray-800 hover:bg-indigo-600 rounded-full font-medium transition text-white"
                    >
                      📄 View File
                    </a>
                  </div>
                </div>

                {/* DETAILS TAB */}
                {activeTab[a._id] === "details" && (
                  <div className="text-base text-gray-300 space-y-2 ml-1">
                    <p><span className="font-semibold text-white">Description:</span> {a.description || "N/A"}</p>
                    <p><span className="font-semibold text-white">Due Date:</span> {new Date(a.dueDate).toLocaleDateString()}</p>
                    <p><span className="font-semibold text-white">Course:</span> {a.courseTitle || "Unknown"}</p>
                    <p><span className="font-semibold text-white">Uploaded By:</span> {a.createdByName || "You"}</p>
                  </div>
                )}

                {/* SUBMISSIONS TAB */}
                {activeTab[a._id] === "submissions" && (
                  <div className="mt-3 space-y-3">
                    {submissions[a._id]?.length > 0 ? (
                      submissions[a._id].map((sub) => (
                        <div
                          key={sub.uid}
                          className="flex justify-between items-center bg-gray-800/50 border border-white/10 p-3 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">{sub.name} ({sub.email})</p>
                            <p className="text-sm text-gray-300">
                              {sub.submitted
                                ? `Submitted on ${new Date(sub.submittedAt).toLocaleString()}`
                                : "Not submitted yet"}
                            </p>
                          </div>
                          {sub.submitted && (
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:underline font-medium"
                            >
                              📥 View Submission
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-300">No submissions found for this assignment.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
