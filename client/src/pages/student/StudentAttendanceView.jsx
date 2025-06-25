import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAttendanceReport } from "../../utils/api";

const StudentAttendanceView = ({ courseId }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceReport(courseId, startDate, endDate);
      setAttendance(response.attendance || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [courseId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "text-green-400";
      case "absent":
        return "text-red-400";
      case "late":
        return "text-yellow-400";
      case "excused":
        return "text-blue-400";
      case "not marked":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "present":
        return "bg-green-900/20 border-green-500";
      case "absent":
        return "bg-red-900/20 border-red-500";
      case "late":
        return "bg-yellow-900/20 border-yellow-500";
      case "excused":
        return "bg-blue-900/20 border-blue-500";
      case "not marked":
        return "bg-gray-900/20 border-gray-500";
      default:
        return "bg-gray-900/20 border-gray-500";
    }
  };

  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(
      (record) => record.status === "present"
    ).length;
    const absent = attendance.filter(
      (record) => record.status === "absent"
    ).length;
    const late = attendance.filter((record) => record.status === "late").length;
    const excused = attendance.filter(
      (record) => record.status === "excused"
    ).length;
    const notMarked = attendance.filter(
      (record) => record.status === "not marked"
    ).length;

    // Calculate percentage excluding "not marked" records
    const markedRecords = attendance.filter(
      (record) => record.status !== "not marked"
    );
    const percentage =
      markedRecords.length > 0
        ? ((present + late) / markedRecords.length) * 100
        : 0;

    return { total, present, absent, late, excused, notMarked, percentage };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6 bg-gray-800 p-6 rounded-md">
      <h2 className="text-xl font-bold text-indigo-400">My Attendance</h2>

      <div className="flex gap-4 items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={fetchAttendance}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading attendance...</div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Days</div>
            </div>
            <div className="bg-green-900/20 border border-green-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-green-400">
                {stats.present}
              </div>
              <div className="text-sm text-gray-400">Present</div>
            </div>
            <div className="bg-red-900/20 border border-red-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-red-400">
                {stats.absent}
              </div>
              <div className="text-sm text-gray-400">Absent</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {stats.late}
              </div>
              <div className="text-sm text-gray-400">Late</div>
            </div>
            <div className="bg-gray-900/20 border border-gray-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-gray-400">
                {stats.notMarked}
              </div>
              <div className="text-sm text-gray-400">Not Marked</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(stats.percentage * 100) / 100}%
              </div>
              <div className="text-sm text-gray-400">Attendance %</div>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400 border border-gray-700">
              <thead className="text-xs uppercase bg-gray-700 text-white">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Notes</th>
                  {/* <th className="px-4 py-3">Marked By</th> */}
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-center text-gray-400"
                    >
                      No attendance records found for the selected period.
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusBg(
                            record.status
                          )} ${getStatusColor(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{record.notes || "-"}</td>
                      {/* <td className="px-4 py-3">
                        {record.markedBy || "Teacher"}
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAttendanceView;
