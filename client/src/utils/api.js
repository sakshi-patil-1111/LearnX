const API_BASE = "http://localhost:8080/api";
import { auth } from "../firebase";

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
  const res = await fetch(`${API_BASE}/courses/${courseId}/material/${materialId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete material");
  return await res.json();
};
