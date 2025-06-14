import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./pages/Teacher/Dashboard";
import Courses from "./pages/Teacher/Courses";
import Materials from "./pages/Teacher/Materials";
import Assignments from "./pages/Teacher/Assignments";
import Profile from "./pages/Teacher/Profile";
import Announcements from "./pages/Teacher/Announcements";
import CourseDetail from "./pages/Teacher/CourseDetail";
import LoginSelector from "./components/LoginSelector";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSelector type="login" />} />
        <Route path="/signup" element={<LoginSelector type="signup" />} />
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/courses" element={<Courses />} />
        <Route path="/teacher/courses/:courseId" element={<CourseDetail />} />
        <Route path="/teacher/materials" element={<Materials />} />
        <Route path="/teacher/assignments" element={<Assignments />} />
        <Route path="/teacher/profile" element={<Profile />} />
        <Route path="/teacher/announcements" element={<Announcements />} />
      </Routes>
    </div>
  );
};

export default App;
