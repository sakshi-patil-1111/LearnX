import React from "react";

const StudentsTab = ({ students }) => {
  return (
    <div className="space-y-4 bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-xl font-bold text-indigo-400">Enrolled Students</h2>

      {students?.length === 0 ? (
        <p className="text-gray-400">No students enrolled yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400 border border-gray-700">
            <thead className="text-xs uppercase bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Semester</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3">{student.name || "N/A"}</td>
                  <td className="px-4 py-3">{student.email || "N/A"}</td>
                  <td className="px-4 py-3">{student.rollNo || "N/A"}</td>
                  <td className="px-4 py-3">{student.course || "N/A"}</td>
                  <td className="px-4 py-3">{student.semester || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsTab;
