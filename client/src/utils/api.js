export const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
import { auth } from "../firebase";
import axios from "axios";

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");
  return await user.getIdToken();
};

export const fetchMyCourses = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE}/courses/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch courses");
  return await res.json();
};

export const createCourse = async (courseData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create course");
  }

  return res.json();
};

export const getCourseById = async (courseId) => {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Fetching course", courseId, "with token:", token);

  if (!res.ok) throw new Error("Failed to fetch course");
  return await res.json();
};
export const addMaterialToCourse = async (courseId, materialData) => {
  const token = await getAuthToken();
  const res = await axios.post(
    `${API_BASE}/courses/${courseId}/material`,
    materialData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const updateCourse = async (courseId, courseData) => {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update course");
  }

  return await res.json();
};

export const deleteCourseById = async (courseId) => {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete course");
  return await res.json();
};

export const deleteMaterialFromCourse = async (courseId, materialId) => {
  const token = await getAuthToken();
  const res = await fetch(
    `${API_BASE}/courses/${courseId}/material/${materialId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to delete material");
  return await res.json();
};

export const updateMaterialInCourse = async (
  courseId,
  materialId,
  materialData
) => {
  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await axios.put(
    `${API_BASE}/courses/${courseId}/materials/${materialId}`,
    materialData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const fetchAllCourses = async () => {
  const res = await axios.get(`${API_BASE}/courses`);
  return res.data;
};

export const enrollInCourse = async (courseId) => {
  const token = await getAuthToken();
  const res = await axios.post(
    `${API_BASE}/courses/enroll/${courseId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getUserEnrolledCourses = async () => {
  const token = await auth.currentUser.getIdToken(true);
  const res = await axios.get(`${API_BASE}/courses/enrolled`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchStudentAssignments = async () => {
  const token = await auth.currentUser.getIdToken();
  const res = await axios.get(`${API_BASE}/assignments/student`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const submitAssignment = async (assignmentId, file) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_BASE}/assignments/${assignmentId}/submit`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

//for grading
export const gradeAssignmentSubmission = async (
  assignmentId,
  studentId,
  gradeData
) => {
  const token = await getAuthToken();
  const res = await axios.post(
    `${API_BASE}/assignments/${assignmentId}/grade/${studentId}`,
    gradeData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Fetch assignments created by the teacher
export const fetchTeacherAssignments = async () => {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE}/assignments/teacher`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Placeholder for fetching teacher announcements (implement endpoint if available)
export const fetchTeacherAnnouncements = async () => {
  // TODO: Implement actual API call when endpoint is available
  return [];
};

// Announcements API
export const fetchAllAnnouncements = async () => {
  const res = await axios.get(`${API_BASE}/announcements`);
  return res.data;
};

export const fetchAnnouncementsByCourse = async (course) => {
  const res = await axios.get(`${API_BASE}/announcements/course/${course}`);
  return res.data;
};

export const createAnnouncement = async (announcementData) => {
  const token = await getAuthToken();
  const res = await axios.post(`${API_BASE}/announcements`, announcementData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateAnnouncement = async (id, announcementData) => {
  const token = await getAuthToken();
  const res = await axios.put(
    `${API_BASE}/announcements/${id}`,
    announcementData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteAnnouncement = async (id) => {
  const token = await getAuthToken();
  const res = await axios.delete(`${API_BASE}/announcements/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchAssignmentsByCourse = async (courseId) => {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE}/assignments/course/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Attendance API functions
export const markAttendance = async (attendanceData) => {
  const token = await getAuthToken();
  const res = await axios.post(`${API_BASE}/attendance/mark`, attendanceData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markBulkAttendance = async (bulkAttendanceData) => {
  const token = await getAuthToken();
  const res = await axios.post(
    `${API_BASE}/attendance/mark-bulk`,
    bulkAttendanceData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getAttendanceByDate = async (courseId, date) => {
  const token = await getAuthToken();
  const res = await axios.get(
    `${API_BASE}/attendance/course/${courseId}/date/${date}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getAttendanceReport = async (
  courseId,
  startDate,
  endDate,
  studentId
) => {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (studentId) params.append("studentId", studentId);

  const res = await axios.get(
    `${API_BASE}/attendance/course/${courseId}/report?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getCourseStudents = async (courseId) => {
  const token = await getAuthToken();
  const res = await axios.get(
    `${API_BASE}/attendance/course/${courseId}/students`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Get attendance statistics for all courses of a student
export const getStudentAttendanceStats = async () => {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE}/attendance/student/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchCurrentStudentProfile = async () => {
  const token = await getAuthToken();
  // console.log(API_BASE);
  const res = await axios.get(`${API_BASE}/users/student/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.student;
};

export const fetchCurrentTeacherProfile = async () => {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE}/users/teacher/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.teacher;
};

//all enrolled announcements
export const fetchEnrolledAnnouncements = async () => {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE}/announcements/enrolled`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
