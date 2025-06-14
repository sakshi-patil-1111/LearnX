import React from "react";
import Navbar from "../../components/Navbar";

const Materials = () => {
  // Mock data 
  const materials = [
    {
      id: 1,
      title: "Algebra Notes",
      course: "Mathematics 101",
      type: "PDF",
      size: "2.4 MB",
      date: "1 day ago",
      downloads: 45,
    },
    {
      id: 2,
      title: "Physics Lab Manual",
      course: "Physics Advanced",
      type: "PDF",
      size: "4.1 MB",
      date: "2 days ago",
      downloads: 32,
    },
    {
      id: 3,
      title: "Chemical Reactions",
      course: "Chemistry Basics",
      type: "PDF",
      size: "1.8 MB",
      date: "4 days ago",
      downloads: 28,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-400">
              Course Materials
            </h1>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
              Upload New Material
            </button>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {materials.map((material) => (
                    <tr
                      key={material.id}
                      className="hover:bg-gray-700/30 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {material.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {material.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                          {material.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {material.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {material.downloads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {material.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="text-indigo-400 hover:text-indigo-300 transition">
                            Download
                          </button>
                          <button className="text-gray-400 hover:text-gray-300 transition">
                            Edit
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;