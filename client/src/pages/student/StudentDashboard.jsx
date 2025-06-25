import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getUserEnrolledCourses,
  fetchStudentAssignments,
  fetchAllAnnouncements,
  getStudentAttendanceStats,
} from "../../utils/api";
import axios from "axios";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const token = await user.getIdToken();
        const profileRes = await axios.get(
          "http://localhost:8080/api/users/student/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(profileRes.data.student);

        // Fetch courses and materials
        const coursesRes = await getUserEnrolledCourses();
        setCourses(coursesRes.courses || []);
        // Flatten and sort all materials from all courses
        const allMaterials = (coursesRes.courses || [])
          .flatMap((course) =>
            (course.materials || []).map((mat) => ({
              ...mat,
              courseTitle: course.title,
            }))
          )
          .sort(
            (a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0)
          );
        setMaterials(allMaterials.slice(0, 3));

        // Fetch assignments
        const assignmentsRes = await fetchStudentAssignments();
        const assignmentsArr = Array.isArray(assignmentsRes)
          ? assignmentsRes
          : assignmentsRes.assignments || [];
        assignmentsArr.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setAssignments(assignmentsArr.slice(0, 3));

        // Fetch announcements
        const announcementsRes = await fetchAllAnnouncements();
        setAnnouncements(
          (announcementsRes.announcements || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
        );

        // Fetch attendance statistics
        try {
          const attendanceRes = await getStudentAttendanceStats();
          // console.log("Attendance API Response:", attendanceRes);
          setAttendanceStats(attendanceRes);
        } catch (attendanceError) {
          console.error("Failed to fetch attendance stats:", attendanceError);
          console.error(
            "Attendance Error Details:",
            attendanceError.response?.data
          );
          // Don't fail the entire dashboard if attendance stats fail
        }
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const DashboardSection = ({ title, items, viewAllLink, renderItem }) => (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 h-full transition-transform duration-300 hover:transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-400">{title}</h2>
        <Link
          to={viewAllLink}
          className="text-white hover:text-indigo-300 transition-colors duration-200"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-gray-400">No data available.</div>
        ) : (
          items.map(renderItem)
        )}
      </div>
    </div>
  );

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

  // Simple SVG Pie Chart Component
  const PieChart = ({ data }) => {
    // console.log("PieChart received data:", data);

    // Ensure data exists and has valid numbers - use the correct property names from API
    const present = data?.totalPresent || 0;
    const absent = data?.totalAbsent || 0;
    const late = data?.totalLate || 0;
    const excused = data?.totalExcused || 0;
    const notMarked = data?.totalNotMarked || 0;

    // console.log("PieChart processed values:", {
    //   present,
    //   absent,
    //   late,
    //   excused,
    //   notMarked,
    // });

    const total = present + absent + late + excused + notMarked;
    // console.log("PieChart total:", total);

    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          No attendance data available
        </div>
      );
    }

    const radius = 90;
    const centerX = 100;
    const centerY = 100;
    const strokeWidth = 4;

    // Colors for different attendance statuses
    const colors = {
      present: "#22C55E", // Bright green
      absent: "#F43F5E", // Bright red
      late: "#F59E0B", // Amber
      excused: "#8B5CF6", // Purple
      notMarked: "#94A3B8", // Slate gray
    };

    // Create pie segments
    const createPieSegment = (value, startAngle, color, label) => {
      if (value === 0) return null;

      const percentage = value / total;
      const endAngle = startAngle + percentage * 2 * Math.PI;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = percentage > 0.5 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      return (
        <g key={label} className="group">
          <path
            d={pathData}
            fill={color}
            stroke="#1b2635"
            strokeWidth={strokeWidth}
            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.transformOrigin = "center";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          />
          {/* Tooltip */}
          <title>{`${label}: ${value} (${(percentage * 100).toFixed(
            1
          )}%)`}</title>
        </g>
      );
    };

    let currentAngle = -Math.PI / 2; // Start from top

    const segments = [
      { value: present, color: colors.present, label: "Present" },
      { value: absent, color: colors.absent, label: "Absent" },
      { value: late, color: colors.late, label: "Late" },
      { value: excused, color: colors.excused, label: "Excused" },
      { value: notMarked, color: colors.notMarked, label: "Not Marked" },
    ].map((segment) => {
      const segmentElement = createPieSegment(
        segment.value,
        currentAngle,
        segment.color,
        segment.label
      );
      if (segment.value > 0) {
        currentAngle += (segment.value / total) * 2 * Math.PI;
      }
      return { ...segment, element: segmentElement };
    });

    // Legend - only show segments with values > 0
    const legendItems = segments
      .filter((segment) => segment.value > 0)
      .map((segment) => (
        <div key={segment.label} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: segment.color }}
          ></div>
          <span className="text-sm text-gray-400">
            {segment.label}: {segment.value}
          </span>
        </div>
      ));

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg width="200" height="200" className="drop-shadow-lg">
            {segments.map((segment) => segment.element).filter(Boolean)}
            {/* Center circle for better appearance */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.75}
              fill="#1b2635"
              stroke="#1b2635"
              strokeWidth={1}
            />
            {/* Center text */}
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-semibold bg-black"
              fill="white"
            >
              {data?.attendancePercentage || 0}%
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4">{legendItems}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="p-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold text-indigo-400 mb-8">
            Student Dashboard
          </h1>
          {loading ? (
            <div className="text-center text-white">Loading dashboard...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            <>
              {profile && (
                <div className="mb-8 bg-gray-800/80 rounded-lg p-6 flex items-center gap-6">
                  <img
                    src={
                      profile.imageUrl ||
                      "https://api.dicebear.com/8.x/thumbs/svg?seed=Student"
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-indigo-400 object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-300">
                      Welcome, {profile.name}!
                    </h2>
                    <p className="text-gray-400">{profile.email}</p>
                  </div>
                </div>
              )}

              {/* Attendance Statistics Section */}
              <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Attendance Pie Chart */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-indigo-400 mb-4">
                    Overall Attendance
                  </h2>
                  {/* {console.log("Rendering attendance stats:", attendanceStats)} */}
                  <div className="flex items-center justify-between">
                    {attendanceStats && attendanceStats.overallStats ? (
                      <>
                        <PieChart data={attendanceStats.overallStats} />
                        <div className="text-center">
                          <div className="text-3xl font-bold text-indigo-400">
                            {attendanceStats.overallStats
                              .attendancePercentage || 0}
                            %
                          </div>
                          <div className="text-gray-400 text-sm">
                            Attendance Rate
                          </div>
                          <div className="text-gray-400 text-sm mt-2">
                            Total Days:{" "}
                            {attendanceStats.overallStats.totalDays || 0}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-gray-400">
                        {attendanceStats
                          ? "No attendance data available"
                          : "Loading attendance data..."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Course-wise Attendance */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-indigo-400 mb-4">
                    Course-wise Attendance
                  </h2>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {!attendanceStats ? (
                      <div className="text-gray-400">
                        Loading attendance data...
                      </div>
                    ) : !attendanceStats.courseStats ||
                      attendanceStats.courseStats.length === 0 ? (
                      <div className="text-gray-400">
                        {courses.length === 0
                          ? "You are not enrolled in any courses yet."
                          : "No attendance has been marked for your courses yet."}
                      </div>
                    ) : (
                      attendanceStats.courseStats.map((course) => (
                        <div
                          key={course.courseId}
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="text-white font-medium">
                              {course.courseTitle || "Unknown Course"}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {course.totalDays || 0} days •{" "}
                              {course.presentDays || 0} present
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${
                                (course.attendancePercentage || 0) >= 80
                                  ? "text-green-400"
                                  : (course.attendancePercentage || 0) >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {course.attendancePercentage || 0}%
                            </div>
                            <div className="text-gray-400 text-xs">
                              Attendance
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardSection
                  title="Recent Courses"
                  items={courses.slice(0, 3)}
                  viewAllLink="/student/courses"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        Instructor: {item.instructorName || "Unknown"}
                      </div>
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Materials"
                  items={materials}
                  viewAllLink="/student/materials"
                  renderItem={(item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        {item.courseTitle} • {item.materialType} •{" "}
                        {item.topic || "No topic"}
                      </div>
                      <a
                        href={item.materialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 text-sm hover:underline"
                      >
                        Open
                      </a>
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Assignments"
                  items={assignments}
                  viewAllLink="/student/assignments"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-sm">
                        {item.course?.title || "Unknown Course"} • Due:{" "}
                        {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 text-sm hover:underline"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  )}
                />
                <DashboardSection
                  title="Recent Announcements"
                  items={announcements}
                  viewAllLink="/student/announcements"
                  renderItem={(item) => (
                    <div
                      key={item._id}
                      className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-white font-medium flex items-center gap-2">
                        {item.title}
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {item.course} •{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : ""}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {item.content}
                      </div>
                    </div>
                  )}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
