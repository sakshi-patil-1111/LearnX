import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
const StudentProfile = () => {
  const studentData = {
    name: "Sweta Sharma",
    email: "sweta123@learnx.edu.in",
    rollNo: "CSE2023-0421",
    bio: "Final year Computer Science student passionate about AI, web development, and contributing to open-source.",
    joined: "August 2022",
    avatar:
      "https://api.dicebear.com/8.x/thumbs/svg?seed=Sweta&backgroundColor=f0f0f0&scale=90",
    course: "B.Tech in Computer Science",
    semester: "6th Semester",
  };

  return (
    <>
      <Navbar userType="student" />
      <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start p-6 gap-6">
            {/* Profile Image */}
            <img
              src={studentData.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-400 shadow-md hover:scale-105 transition duration-300"
            />

            {/* Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-indigo-400 mb-1">
                {studentData.name}
              </h2>
              <p className="text-sm text-gray-400 font-medium mb-4">Student</p>

              <p className="text-gray-300">{studentData.bio}</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                <p>
                  <span className="text-muted">📧 Email:</span>{" "}
                  {studentData.email}
                </p>
                <p>
                  <span className="text-muted">🎓 Roll No:</span>{" "}
                  {studentData.rollNo}
                </p>
                <p>
                  <span className="text-muted">📘 Course:</span>{" "}
                  {studentData.course}
                </p>
                <p>
                  <span className="text-muted">📅 Semester:</span>{" "}
                  {studentData.semester}
                </p>
                <p>
                  <span className="text-muted">🕓 Joined:</span>{" "}
                  {studentData.joined}
                </p>
              </div>
              <div className="mt-6">
                <Link to="/student/edit/profile">
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 hover:scale-105 transition">
                    Edit Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
