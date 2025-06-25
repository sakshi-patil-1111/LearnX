import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  getCourseStudents,
  getAttendanceByDate,
  markBulkAttendance,
  getAttendanceReport,
} from "../../../utils/api";

// Utility functions moved outside components for sharing
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

const AttendanceTab = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("mark"); // "mark" or "view"
  const [markingMode, setMarkingMode] = useState("single"); // "single" or "range"

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendanceForDate();
    }
  }, [selectedDate, students]);

  const fetchStudents = async () => {
    try {
      const response = await getCourseStudents(courseId);
      setStudents(response.students);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    }
  };

  const fetchAttendanceForDate = async () => {
    try {
      const response = await getAttendanceByDate(courseId, selectedDate);
      const attendanceMap = {};

      if (response.students) {
        response.students.forEach(({ student, attendance }) => {
          attendanceMap[student.uid] = {
            status: attendance?.status || "not marked",
            notes: attendance?.notes || "",
          };
        });
      }

      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      // If no attendance exists for this date, initialize with default values
      const defaultAttendance = {};
      students.forEach((student) => {
        defaultAttendance[student.uid] = { status: "not marked", notes: "" };
      });
      setAttendanceData(defaultAttendance);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes },
    }));
  };

  const markAttendance = async () => {
    setLoading(true);
    try {
      if (markingMode === "single") {
        // Mark attendance for single date
        const attendanceDataArray = Object.entries(attendanceData).map(
          ([studentId, data]) => ({
            studentId,
            status: data.status,
            notes: data.notes,
          })
        );

        await markBulkAttendance({
          courseId,
          attendanceData: attendanceDataArray,
          date: selectedDate,
        });
      } else {
        // Mark attendance for date range
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d).toISOString().split("T")[0]);
        }

        // Mark attendance for each date in the range
        for (const date of dates) {
          const attendanceDataArray = Object.entries(attendanceData).map(
            ([studentId, data]) => ({
              studentId,
              status: data.status,
              notes: data.notes,
            })
          );

          await markBulkAttendance({
            courseId,
            attendanceData: attendanceDataArray,
            date: date,
          });
        }
      }

      toast.success(
        markingMode === "single"
          ? "Attendance marked successfully!"
          : `Attendance marked for ${new Date(
              startDate
            ).toLocaleDateString()} to ${new Date(
              endDate
            ).toLocaleDateString()}!`
      );

      if (markingMode === "single") {
        fetchAttendanceForDate();
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-gray-800 p-6 rounded-md shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo-400">
          Attendance Management
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode("mark")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "mark"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setViewMode("view")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "view"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            View Reports
          </button>
        </div>
      </div>

      {viewMode === "mark" && (
        <>
          {/* Marking Mode Selection */}
          <div className="flex gap-4 items-center">
            <label className="text-gray-300">Marking Mode:</label>
            <button
              onClick={() => setMarkingMode("single")}
              className={`px-4 py-2 rounded-md ${
                markingMode === "single"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Single Date
            </button>
            <button
              onClick={() => setMarkingMode("range")}
              className={`px-4 py-2 rounded-md ${
                markingMode === "range"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Date Range
            </button>
          </div>

          {/* Date Selection */}
          <div className="flex gap-4 items-center">
            {markingMode === "single" ? (
              <>
                <label className="text-gray-300">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
                />
              </>
            ) : (
              <>
                <label className="text-gray-300">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
                />
                <label className="text-gray-300">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-indigo-500"
                />
              </>
            )}
            <button
              onClick={markAttendance}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : markingMode === "single"
                ? "Save Attendance"
                : "Save for Range"}
            </button>
          </div>

          {markingMode === "range" && (
            <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-md">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> This will mark the same attendance status
                for all students across all dates in the selected range.
                {startDate && endDate && (
                  <span className="block mt-1">
                    Dates: {new Date(startDate).toLocaleDateString()} to{" "}
                    {new Date(endDate).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          )}

          {students.length === 0 ? (
            <p className="text-gray-400">No students enrolled yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400 border border-gray-700">
                <thead className="text-xs uppercase bg-gray-700 text-white">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.uid}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">
                        <select
                          value={
                            attendanceData[student.uid]?.status || "not marked"
                          }
                          onChange={(e) =>
                            handleStatusChange(student.uid, e.target.value)
                          }
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="not marked">Not Marked</option>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={attendanceData[student.uid]?.notes || ""}
                          onChange={(e) =>
                            handleNotesChange(student.uid, e.target.value)
                          }
                          placeholder="Optional notes..."
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {viewMode === "view" && <AttendanceReport courseId={courseId} />}
    </div>
  );
};

// Attendance Report Component
const AttendanceReport = ({ courseId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceReport(courseId, startDate, endDate);
      setReport(response);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch attendance report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [courseId]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading report...</div>;
  }

  return (
    <div className="space-y-6">
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
          onClick={fetchReport}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Generate Report
        </button>
      </div>

      {report && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-white">
                {report.statistics.totalDays}
              </div>
              <div className="text-sm text-gray-400">Total Days</div>
            </div>
            <div className="bg-green-900/20 border border-green-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-green-400">
                {report.statistics.presentDays}
              </div>
              <div className="text-sm text-gray-400">Present</div>
            </div>
            <div className="bg-red-900/20 border border-red-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-red-400">
                {report.statistics.absentDays}
              </div>
              <div className="text-sm text-gray-400">Absent</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {report.statistics.lateDays}
              </div>
              <div className="text-sm text-gray-400">Late</div>
            </div>
            <div className="bg-gray-900/20 border border-gray-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-gray-400">
                {report.statistics.notMarkedDays || 0}
              </div>
              <div className="text-sm text-gray-400">Not Marked</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-blue-400">
                {report.statistics.attendancePercentage}%
              </div>
              <div className="text-sm text-gray-400">Attendance %</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400 border border-gray-700">
              <thead className="text-xs uppercase bg-gray-700 text-white">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {report.attendance.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{record.studentName}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
