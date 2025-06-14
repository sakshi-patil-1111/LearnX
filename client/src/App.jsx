import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

// Teacher Pages
import Dashboard from "./pages/Teacher/Dashboard";
import Courses from "./pages/Teacher/Courses";
import Materials from "./pages/Teacher/Materials";
import Assignments from "./pages/Teacher/Assignments";
import Profile from "./pages/Teacher/Profile";
import Announcements from "./pages/Teacher/Announcements";
import CourseDetail from "./pages/Teacher/CourseDetail";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import StudentAnnouncements from "./pages/student/Announcements";
import StudentProfile from "./pages/student/StudentProfile";
import CourseView from "./pages/student/StudentCourseView";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/courses" element={<Courses />} />
        <Route path="/teacher/courses/:courseId" element={<CourseDetail />} />
        <Route path="/teacher/materials" element={<Materials />} />
        <Route path="/teacher/assignments" element={<Assignments />} />
        <Route path="/teacher/profile" element={<Profile />} />
        <Route path="/teacher/announcements" element={<Announcements />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCourses />} />
        <Route path="/student/course/:courseId/view" element={<CourseView />} />
        <Route path="/student/course/:courseId" element={<CourseView />} />
        <Route
          path="/student/announcements"
          element={<StudentAnnouncements />}
        />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Routes>
    </div>
  );
};

export default App;
