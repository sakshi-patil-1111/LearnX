import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LoginSelector from "./components/LoginSelector";
import RoleSelect from "./components/RoleSelect";
import PrivateRoute from "./components/PrivateRoute";
import { useAppContext } from "./context/AppContext";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentEditProfile from "./pages/student/StudentEditProfile";
import AllCourses from "./pages/student/AllCourses";
import StudentCourseView from "./pages/student/StudentCourseView";
import MyCourses from "./pages/student/MyCourses";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentMaterial from "./pages/student/StudentMaterial";
import AllAnnouncements from "./pages/student/AllAnnouncements";

// Teacher Pages
import TeacherDashboard from "./pages/Teacher/Dashboard";
import Courses from "./pages/Teacher/Courses";
import CourseDetail from "./pages/Teacher/CourseDetail";
import Materials from "./pages/Teacher/Materials";
import Assignments from "./pages/Teacher/Assignments";
import Profile from "./pages/Teacher/Profile";
import TeacherAnnouncements from "./pages/Teacher/Announcements";
import TeacherEditProfile from "./pages/Teacher/TeacherEditProfile";
import CourseEdit from "./pages/Teacher/CourseEdit";

import AddAssignment from "./pages/Teacher/AddAssignment";
import Contact from "./components/Contact";
import About from "./components/About";

const App = () => {
  const { loading } = useAppContext();

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center text-lg font-medium text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/select-role" element={<RoleSelect />} />
        <Route path="/auth/:role" element={<LoginSelector />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute allowedRole="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <PrivateRoute allowedRole="student">
              <StudentProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/assignments"
          element={
            <PrivateRoute allowedRole="student">
              <StudentAssignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/edit/profile"
          element={
            <PrivateRoute allowedRole="student">
              <StudentEditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/All-Courses"
          element={
            <PrivateRoute allowedRole="student">
              <AllCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <PrivateRoute allowedRole="student">
              <MyCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/courses/:courseId"
          element={
            <PrivateRoute allowedRole="student">
              <StudentCourseView />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/announcements"
          element={
            <PrivateRoute allowedRole="student">
              <AllAnnouncements />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/materials"
          element={
            <PrivateRoute allowedRole="student">
              <StudentMaterial />
            </PrivateRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute allowedRole="teacher">
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/courses"
          element={
            <PrivateRoute allowedRole="teacher">
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId"
          element={
            <PrivateRoute allowedRole="teacher">
              <CourseDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId/edit"
          element={
            <PrivateRoute allowedRole="teacher">
              <CourseEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/edit/profile"
          element={
            <PrivateRoute allowedRole="teacher">
              <TeacherEditProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/create-assignment"
          element={
            <PrivateRoute allowedRole="teacher">
              <AddAssignment />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/materials"
          element={
            <PrivateRoute allowedRole="teacher">
              <Materials />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <PrivateRoute allowedRole="teacher">
              <Assignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <PrivateRoute allowedRole="teacher">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/announcements"
          element={
            <PrivateRoute allowedRole="teacher">
              <TeacherAnnouncements />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
