import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  getCourseById,
  fetchAnnouncementsByCourse,
  fetchAssignmentsByCourse,
  fetchAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  fetchCurrentTeacherProfile,
} from "../../utils/api";
import { auth } from "../../firebase";
import MaterialsTab from "./CourseTabs/MaterialsTab";
import StudentsTab from "./CourseTabs/StudentsTab";
import AttendanceTab from "./CourseTabs/AttendanceTab";
import axios from "axios";
import Chat from "../../components/Chat";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [gradingData, setGradingData] = useState({});
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [annForm, setAnnForm] = useState({
    title: "",
    content: "",
    course: "",
    priority: "Low",
  });
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignForm, setAssignForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    file: null,
  });
  const [assignLoading, setAssignLoading] = useState(false);
  const [activeAssignTab, setActiveAssignTab] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("Teacher");

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
        // Announcements: fallback to fetchAllAnnouncements and filter by code, title, or id
        let annRes;
        try {
          annRes = await fetchAnnouncementsByCourse(data.course.code);
        } catch {
          annRes = await fetchAllAnnouncements();
        }
        let filtered = (annRes.announcements || []).filter(
          (a) =>
            a.course === data.course.code ||
            a.course === data.course.title ||
            a.course === courseId
        );
        setAnnouncements(filtered);
        // Fetch assignments for this course
        const assignRes = await fetchAssignmentsByCourse(courseId);
        setAssignments(assignRes.assignments || []);
      } catch (err) {
        console.error("Failed to fetch course:", err.message);
        navigate("/teacher/courses");
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const profile = await fetchCurrentTeacherProfile();
        setCurrentUserId(profile._id);
        setCurrentUserName(profile.name || "Teacher");
      } catch (err) {
        setCurrentUserId(null);
        setCurrentUserName("Teacher");
      }
    };

    fetchCourse();
    fetchProfile();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <p className="text-center text-white mt-10">Loading course details...</p>
    );
  }

  if (!course) {
    return <p className="text-center text-red-400 mt-10">Course not found.</p>;
  }

  const tabs = [
    "overview",
    "students",
    "materials",
    "attendance",
    "announcements",
    "assignments",
    "chat",
  ];

  const handleAnnInputChange = (e) => {
    setAnnForm({ ...annForm, [e.target.name]: e.target.value });
  };

  const handleAnnCreate = () => {
    setAnnForm({
      title: "",
      content: "",
      course: course.title,
      priority: "Low",
    });
    setEditingAnnouncement(null);
    setShowAnnForm(true);
  };

  const handleAnnEdit = (announcement) => {
    setAnnForm({
      title: announcement.title,
      content: announcement.content,
      course: announcement.course,
      priority: announcement.priority,
    });
    setEditingAnnouncement(announcement);
    setShowAnnForm(true);
  };

  const handleAnnDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    await deleteAnnouncement(id);
    // Refresh
    let annRes;
    try {
      annRes = await fetchAnnouncementsByCourse(course.code);
    } catch {
      annRes = await fetchAllAnnouncements();
    }
    let filtered = (annRes.announcements || []).filter(
      (a) =>
        a.course === course.code ||
        a.course === course.title ||
        a.course === courseId
    );
    setAnnouncements(filtered);
  };

  const handleAnnSubmit = async (e) => {
    e.preventDefault();
    if (editingAnnouncement) {
      await updateAnnouncement(editingAnnouncement._id, annForm);
    } else {
      await createAnnouncement({ ...annForm, course: course.title });
    }
    setShowAnnForm(false);
    setEditingAnnouncement(null);
    // Refresh
    let annRes;
    try {
      annRes = await fetchAnnouncementsByCourse(course.code);
    } catch {
      annRes = await fetchAllAnnouncements();
    }
    let filtered = (annRes.announcements || []).filter(
      (a) =>
        a.course === course.code ||
        a.course === course.title ||
        a.course === courseId
    );
    setAnnouncements(filtered);
  };

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

  const handleAssignInputChange = (e) => {
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  };

  const handleAssignFileChange = (e) => {
    setAssignForm({ ...assignForm, file: e.target.files[0] });
  };

  const handleAssignCreate = () => {
    setAssignForm({ title: "", description: "", dueDate: "", file: null });
    setShowAssignForm(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("title", assignForm.title);
      formData.append("description", assignForm.description);
      formData.append("dueDate", assignForm.dueDate);
      formData.append("courseId", courseId);
      formData.append("file", assignForm.file);
      await axios.post("http://localhost:8080/api/assignments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowAssignForm(false);
      // Refresh assignments
      const assignRes = await fetchAssignmentsByCourse(courseId);
      setAssignments(assignRes.assignments || []);
    } catch (error) {
      alert("Failed to create assignment.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAssignTabChange = async (assignmentId, tab) => {
    setActiveAssignTab((prev) => ({ ...prev, [assignmentId]: tab }));
    if (tab === "submissions" && !submissions[assignmentId]) {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        const res = await axios.get(
          `http://localhost:8080/api/assignments/${assignmentId}/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions((prev) => ({
          ...prev,
          [assignmentId]: res.data.submissions,
        }));
      } catch (err) {
        alert("Failed to fetch submissions");
      }
    }
  };

  const handleGradeChange = (assignmentId, uid, grade) => {
    setGradingData(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [uid]: {
          ...prev[assignmentId]?.[uid],
          grade,
        },
      },
    }));
  };


  const handleFeedbackChange = (assignmentId, uid, feedback) => {
    setGradingData(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [uid]: {
          ...prev[assignmentId]?.[uid],
          feedback,
        },
      },
    }));
  };

  const handleSubmitGrade = async (assignmentId, uid) => {
    const data = gradingData[assignmentId]?.[uid];
    if (!data || data.grade === "") {
      toast.error("Please enter a valid grade");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();

      await axios.patch(
        `http://localhost:8080/api/assignments/${assignmentId}/grade/${uid}`,
        {
          grade: data.grade,
          feedback: data.feedback || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: prev[assignmentId].map((s) =>
          s.uid === uid ? { ...s, grade: data.grade, feedback: data.feedback } : s
        ),
      }));

      // Clear input after submit
      setGradingData((prev) => {
        const newState = { ...prev };
        if (newState[assignmentId]) {
          delete newState[assignmentId][uid];
          if (Object.keys(newState[assignmentId]).length === 0) {
            delete newState[assignmentId];
          }
        }
        return newState;
      });

      toast.success("Grade submitted");
    } catch (err) {
      toast.error("Error submitting grade");
      console.error("Error submitting grade:", err);
    }
  };


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
                <h2 className="text-xl font-bold text-indigo-400">
                  Course Description
                </h2>
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
              <MaterialsTab
                courseId={courseId}
                materials={course.materials}
                onUpdated={setCourse}
              />
            )}

            {activeTab === "attendance" && (
              <AttendanceTab courseId={courseId} />
            )}

            {activeTab === "announcements" && (
              <div className="space-y-4 bg-gray-800 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-indigo-400">
                    Announcements
                  </h2>
                  <button
                    onClick={handleAnnCreate}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                  >
                    + Add Announcement
                  </button>
                </div>
                {showAnnForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-8 w-full max-w-lg">
                      <h2 className="text-2xl font-bold text-indigo-400 mb-4">
                        {editingAnnouncement
                          ? "Edit Announcement"
                          : "Create New Announcement"}
                      </h2>
                      <form onSubmit={handleAnnSubmit} className="space-y-4">
                        <input
                          name="title"
                          value={annForm.title}
                          onChange={handleAnnInputChange}
                          placeholder="Title"
                          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                          required
                        />
                        <select
                          name="priority"
                          value={annForm.priority}
                          onChange={handleAnnInputChange}
                          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <textarea
                          name="content"
                          value={annForm.content}
                          onChange={handleAnnInputChange}
                          placeholder="Content"
                          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                          required
                        />
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                            onClick={() => {
                              setShowAnnForm(false);
                              setEditingAnnouncement(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                          >
                            {editingAnnouncement ? "Update" : "Create"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {announcements.length === 0 ? (
                  <p className="text-gray-400">
                    No announcements for this course.
                  </p>
                ) : (
                  announcements.map((a) => (
                    <div
                      key={a._id}
                      className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 mb-6 transition-transform duration-300 hover:transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-indigo-400 mb-2">
                            {a.title}
                          </h2>
                          <p className="text-gray-400">{a.course}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(
                            a.priority
                          )}`}
                        >
                          {a.priority}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{a.content}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Posted {new Date(a.createdAt).toLocaleString()}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                            onClick={() => handleAnnEdit(a)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition"
                            onClick={() => handleAnnDelete(a._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {activeTab === "assignments" && (
                <div className="space-y-12 bg-gray-800 p-6 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-indigo-400">Assignments</h2>
                    <button
                      onClick={handleAssignCreate}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                    >
                      + Add Assignment
                    </button>
                  </div>

                  {showAssignForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                      <div className="bg-gray-900 rounded-lg p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Create Assignment</h2>
                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                          <input name="title" value={assignForm.title} onChange={handleAssignInputChange} placeholder="Title" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" required />
                          <textarea name="description" value={assignForm.description} onChange={handleAssignInputChange} placeholder="Description" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" required />
                          <input name="dueDate" type="date" value={assignForm.dueDate} onChange={handleAssignInputChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" required />
                          <input name="file" type="file" accept=".pdf,.txt" onChange={handleAssignFileChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" required />
                          <div className="flex justify-end gap-2 mt-4">
                            <button type="button" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" onClick={() => setShowAssignForm(false)}>Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white" disabled={assignLoading}>{assignLoading ? "Uploading..." : "Create"}</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {assignments.length === 0 ? (
                    <p className="text-gray-400">No assignments for this course.</p>
                  ) : (
                    assignments.map((assignment) => (
                      <div key={assignment._id} className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md">
                        <div className="flex justify-between items-center mb-5">
                          <h3 className="text-2xl font-semibold text-indigo-300">{assignment.title}</h3>
                          <div className="flex space-x-3">
                            <button onClick={() => handleAssignTabChange(assignment._id, "details")} className={`px-4 py-1.5 text-sm rounded-full font-medium transition ${activeAssignTab[assignment._id] === "details" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-indigo-600"}`}>View Details</button>
                            <button onClick={() => handleAssignTabChange(assignment._id, "submissions")} className={`px-4 py-1.5 text-sm rounded-full font-medium transition ${activeAssignTab[assignment._id] === "submissions" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-indigo-600"}`}>Submissions</button>
                            <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 text-sm bg-gray-800 hover:bg-indigo-600 rounded-full font-medium transition text-white">📄 View File</a>
                          </div>
                        </div>

                        {!activeAssignTab[assignment._id] || activeAssignTab[assignment._id] === "details" ? (
                          <div className="text-base text-gray-300 space-y-2 ml-1">
                            <p><span className="font-semibold text-white">Description:</span> {assignment.description || "N/A"}</p>
                            <p><span className="font-semibold text-white">Due Date:</span> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                          </div>
                        ) : null}

                        {activeAssignTab[assignment._id] === "submissions" && (
                          <div className="mt-3 space-y-3">
                            {submissions[assignment._id]?.length > 0 ? (
                              submissions[assignment._id].map((sub) => (
                                <div key={sub.uid} className="bg-gray-800/50 border border-white/10 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                                  <div className="mb-2 md:mb-0">
                                    <p className="text-white font-medium">{sub.name} ({sub.email})</p>
                                    <p className="text-sm text-gray-300">
                                      {sub.submitted ? `Submitted on ${new Date(sub.submittedAt).toLocaleString()}` : "Not submitted yet"}
                                    </p>
                                    {sub.grade !== null && sub.grade !== undefined ? (
                                      <p className="text-sm text-green-400 mt-1">
                                        Grade: {sub.grade}/10 {sub.feedback && <span>— {sub.feedback}</span>}
                                      </p>
                                    ) : (
                                      sub.submitted && (
                                        <p className="text-sm text-yellow-400 italic mt-1">Not graded yet</p>
                                      )
                                    )}
                                  </div>
                                  {sub.submitted && (
                                    <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-medium">📥 View Submission</a>
                                      {sub.grade === null || sub.grade === undefined ? (
                                        <>
                                          <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            placeholder="Grade"
                                            value={gradingData[assignment._id]?.[sub.uid]?.grade ?? ""}
                                            onChange={(e) =>
                                              handleGradeChange(assignment._id, sub.uid, e.target.value)
                                            }
                                            className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 w-20"
                                          />

                                          <input
                                            type="text"
                                            placeholder="Feedback"
                                            value={gradingData[assignment._id]?.[sub.uid]?.feedback ?? ""}
                                            onChange={(e) =>
                                              handleFeedbackChange(assignment._id, sub.uid, e.target.value)
                                            }
                                            className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
                                          />

                                          <button
                                            onClick={() => handleSubmitGrade(assignment._id, sub.uid)}
                                            className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                          >
                                            Submit
                                          </button>
                                        </>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-300">No submissions found for this assignment.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

            {activeTab === "chat" && (
              <div className="space-y-4 bg-gray-800 p-6 rounded-md">
                <Chat
                  courseId={courseId}
                  userId={currentUserId}
                  userName={currentUserName}
                  userRole="teacher"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
