import React, { useEffect, useState } from "react";
import { addMaterialToCourse, getCourseById, deleteMaterialFromCourse } from "../../../utils/api";

const MaterialsTab = ({ courseId }) => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    materialType: "pdf",
    materialUrl: "",
    topic: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch course materials on mount
  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        const data = await getCourseById(courseId);
        setMaterials(data.course.materials || []);
      } catch (err) {
        console.error("Error fetching materials:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseMaterials();
  }, [courseId]);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({ ...prev, [name]: value }));
  };

  // Upload material
  const handleUpload = async () => {
    if (!newMaterial.title || !newMaterial.materialUrl) {
      alert("Please fill in both title and material URL.");
      return;
    }

    try {
      setUploading(true);
      await addMaterialToCourse(courseId, newMaterial);

      // Refresh materials
      const updated = await getCourseById(courseId);
      setMaterials(updated.course.materials || []);

      // Reset form
      setNewMaterial({
        title: "",
        materialType: "pdf",
        materialUrl: "",
        topic: "",
      });

      alert("Material uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.message);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  //to delete materials
  const handleDeleteMaterial = async (materialId) => {
  if (!window.confirm("Are you sure you want to delete this material?")) return;

  try {
    const res = await deleteMaterialFromCourse(courseId, materialId);
    setMaterials(res.materials);
  } catch (err) {
    console.error("Failed to delete material:", err.message);
    alert("Failed to delete material.");
  }
};

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-indigo-400 mb-4">Upload New Material</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={newMaterial.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="materialUrl"
            value={newMaterial.materialUrl}
            onChange={handleInputChange}
            placeholder="Material URL"
            className="p-2 rounded bg-gray-700 text-white"
          />
          <select
            name="materialType"
            value={newMaterial.materialType}
            onChange={handleInputChange}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="note">Note</option>
            <option value="link">Link</option>
          </select>
          <input
            type="text"
            name="topic"
            value={newMaterial.topic}
            onChange={handleInputChange}
            placeholder="Topic (optional)"
            className="p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Material"}
        </button>
      </div>

      {/* Materials Table */}
      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg overflow-hidden">
        {materials.length === 0 ? (
          <p className="p-4 text-gray-400">No materials uploaded yet.</p>
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
              {materials.map((material, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-4 text-white">{material.title}</td>
                  <td className="p-4 text-gray-400">{material.materialType}</td>
                  <td className="p-4 text-gray-400">{material.topic || "—"}</td>
                  <td className="p-4 text-blue-400">
                    <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(material.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                  <button
                    onClick={() => handleDeleteMaterial(material._id)}
                    className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
                  >
                    Delete
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MaterialsTab;
