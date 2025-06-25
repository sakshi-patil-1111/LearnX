import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  fetchMyCourses,
  getCourseById,
  addMaterialToCourse,
  deleteMaterialFromCourse,
  updateMaterialInCourse,
} from "../../utils/api";

const Materials = () => {
  const [courses, setCourses] = useState([]);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    materialType: "pdf",
    materialUrl: "",
    topic: "",
  });
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetchMyCourses();
        setCourses(res.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (
      !selectedCourseId ||
      !newMaterial.title ||
      (newMaterial.materialType !== "link" && !file && !newMaterial.materialUrl)
    ) {
      alert("Please complete all fields.");
      return;
    }

    try {
      let materialData;
      if (newMaterial.materialType === "link") {
        materialData = { ...newMaterial };
        await addMaterialToCourse(selectedCourseId, materialData);
      } else {
        const formData = new FormData();
        formData.append("title", newMaterial.title);
        formData.append("materialType", newMaterial.materialType);
        formData.append("topic", newMaterial.topic);
        if (file) formData.append("file", file);
        await addMaterialToCourse(selectedCourseId, formData, true);
      }
      const updated = await getCourseById(selectedCourseId);
      setCourses((prev) =>
        prev.map((c) =>
          c._id === selectedCourseId
            ? { ...c, materials: updated.course.materials || [] }
            : c
        )
      );
      setNewMaterial({
        title: "",
        materialType: "pdf",
        materialUrl: "",
        topic: "",
      });
      setFile(null);
      setSelectedCourseId("");
      setShowUploadForm(false);
      alert("Material uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.message);
      alert("Upload failed.");
    }
  };

  const handleDeleteMaterial = async (courseId, materialId) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      const res = await deleteMaterialFromCourse(courseId, materialId);
      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId ? { ...course, materials: res.materials } : course
        )
      );
    } catch (err) {
      console.error("Failed to delete material:", err.message);
    }
  };

  const handleUpdateMaterial = async (materialData) => {
    try {
      const { courseId, _id, ...updatedFields } = materialData;
      await updateMaterialInCourse(courseId, _id, updatedFields);
      const updated = await getCourseById(courseId);
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId ? { ...c, materials: updated.course.materials } : c
        )
      );
      setEditingMaterial(null);
      alert("Material updated.");
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("Failed to update material.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />
      <div className="p-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-400">All Course Materials</h1>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              {showUploadForm ? "Cancel" : "Upload New Material"}
            </button>
          </div>

          {showUploadForm && (
            <div className="bg-gray-800 rounded-lg p-6 mb-10">
              <h2 className="text-xl font-semibold text-indigo-300 mb-4">
                Upload New Material
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="p-2 bg-gray-700 rounded text-white"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="title"
                  value={newMaterial.title}
                  onChange={handleInputChange}
                  placeholder="Material Title"
                  className="p-2 bg-gray-700 rounded text-white"
                />
                {newMaterial.materialType === "link" ? (
                  <input
                    type="text"
                    name="materialUrl"
                    value={newMaterial.materialUrl}
                    onChange={handleInputChange}
                    placeholder="Material URL"
                    className="p-2 bg-gray-700 rounded text-white"
                  />
                ) : (
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="p-2 bg-gray-700 rounded text-white"
                  />
                )}
                <input
                  type="text"
                  name="topic"
                  value={newMaterial.topic}
                  onChange={handleInputChange}
                  placeholder="Topic (optional)"
                  className="p-2 bg-gray-700 rounded text-white"
                />
                <select
                  name="materialType"
                  value={newMaterial.materialType}
                  onChange={handleInputChange}
                  className="p-2 bg-gray-700 rounded text-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="note">Note</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Upload
              </button>
            </div>
          )}

          {loading ? (
            <p>Loading courses...</p>
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
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.materials.map((mat, i) => (
                        <React.Fragment key={i}>
                          <tr className="border-t border-gray-700">
                            <td className="p-2 text-white">{mat.title}</td>
                            <td className="p-2 text-gray-400">{mat.materialType}</td>
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
                              {new Date(mat.uploadedAt || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() =>
                                  setEditingMaterial({
                                    courseId: course._id,
                                    ...mat,
                                  })
                                }
                                className="px-3 py-1 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition duration-200"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                          {editingMaterial?.courseId === course._id &&
                            editingMaterial?._id === mat._id && (
                              <tr className="bg-gray-900">
                                <td colSpan="6" className="p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <input
                                      type="text"
                                      value={editingMaterial.title}
                                      onChange={(e) =>
                                        setEditingMaterial({
                                          ...editingMaterial,
                                          title: e.target.value,
                                        })
                                      }
                                      className="p-2 bg-gray-700 text-white rounded"
                                      placeholder="Title"
                                    />
                                    <input
                                      type="text"
                                      value={editingMaterial.materialUrl}
                                      onChange={(e) =>
                                        setEditingMaterial({
                                          ...editingMaterial,
                                          materialUrl: e.target.value,
                                        })
                                      }
                                      className="p-2 bg-gray-700 text-white rounded"
                                      placeholder="URL"
                                    />
                                    <input
                                      type="text"
                                      value={editingMaterial.topic}
                                      onChange={(e) =>
                                        setEditingMaterial({
                                          ...editingMaterial,
                                          topic: e.target.value,
                                        })
                                      }
                                      className="p-2 bg-gray-700 text-white rounded"
                                      placeholder="Topic"
                                    />
                                    <select
                                      value={editingMaterial.materialType}
                                      onChange={(e) =>
                                        setEditingMaterial({
                                          ...editingMaterial,
                                          materialType: e.target.value,
                                        })
                                      }
                                      className="p-2 bg-gray-700 text-white rounded"
                                    >
                                      <option value="pdf">PDF</option>
                                      <option value="note">Note</option>
                                      <option value="link">Link</option>
                                    </select>
                                  </div>
                                  <div className="flex space-x-4 mt-2">
                                    <button
                                      onClick={() => handleUpdateMaterial(editingMaterial)}
                                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteMaterial(
                                          editingMaterial.courseId,
                                          editingMaterial._id
                                        )
                                      }
                                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={() => setEditingMaterial(null)}
                                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
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

export default Materials;
