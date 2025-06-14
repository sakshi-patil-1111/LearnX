import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from "./pages/student/StudentProfile";
import StudentEditProfile from "./pages/student/StudentEditProfile";
import AllCourses from "./pages/student/AllCourses";
import StudentCourseView from "./pages/student/StudentCourseView";
import MyCourses from "./pages/student/MyCourses";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/edit/profile" element={<StudentEditProfile />} />
        <Route path="/student/All-Courses" element={<AllCourses />} />
        <Route path="/student/course/:courseId/view" element={<StudentCourseView />} />
        <Route path="/student/courses" element={<MyCourses />} />

        
      </Routes>
    </div>
  );
};

export default App;
