import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentEditProfile from "./pages/student/StudentEditProfile";
import AllCourses from "./pages/student/AllCourses";
import StudentCourseView from "./pages/student/StudentCourseView";
import MyCourses from "./pages/student/MyCourses";
import StudentAnnouncements from "./pages/student/Announcements";

import Dashboard from "./pages/Teacher/Dashboard";
import Courses from "./pages/Teacher/Courses";
import Materials from "./pages/Teacher/Materials";
import Assignments from "./pages/Teacher/Assignments";
import Profile from "./pages/Teacher/Profile";
import TeacherAnnouncements from "./pages/Teacher/Announcements";
import CourseDetail from "./pages/Teacher/CourseDetail";
import LoginSelector from "./components/LoginSelector";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSelector type="login" />} />
        <Route path="/signup" element={<LoginSelector type="signup" />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/edit/profile" element={<StudentEditProfile />} />
        <Route path="/student/All-Courses" element={<AllCourses />} />
        <Route
          path="/student/course/:courseId"
          element={<StudentCourseView />}
        />
        <Route path="/student/courses" element={<MyCourses />} />
        <Route
          path="/student/announcements"
          element={<StudentAnnouncements />}
        />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/courses" element={<Courses />} />
        <Route path="/teacher/courses/:courseId" element={<CourseDetail />} />
        <Route path="/teacher/materials" element={<Materials />} />
        <Route path="/teacher/assignments" element={<Assignments />} />
        <Route path="/teacher/profile" element={<Profile />} />
        <Route
          path="/teacher/announcements"
          element={<TeacherAnnouncements />}
        />
      </Routes>
    </div>
  );
};

export default App;
