const API_BASE = "http://localhost:8080/api";
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

  const res = await fetch("http://localhost:8080/api/courses", {
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
  const res = await fetch(`${API_BASE}/courses/${courseId}/material`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(materialData),
  });

  if (!res.ok) throw new Error("Failed to add material");
  return await res.json();
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
  const res = await axios.get("http://localhost:8080/api/announcements");
  return res.data;
};

export const fetchAnnouncementsByCourse = async (course) => {
  const res = await axios.get(
    `http://localhost:8080/api/announcements/course/${course}`
  );
  return res.data;
};

export const createAnnouncement = async (announcementData) => {
  const token = await getAuthToken();
  const res = await axios.post(
    "http://localhost:8080/api/announcements",
    announcementData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateAnnouncement = async (id, announcementData) => {
  const token = await getAuthToken();
  const res = await axios.put(
    `http://localhost:8080/api/announcements/${id}`,
    announcementData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteAnnouncement = async (id) => {
  const token = await getAuthToken();
  const res = await axios.delete(
    `http://localhost:8080/api/announcements/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchAssignmentsByCourse = async (courseId) => {
  const token = await getAuthToken();
  const res = await axios.get(`${API_BASE}/assignments/course/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
