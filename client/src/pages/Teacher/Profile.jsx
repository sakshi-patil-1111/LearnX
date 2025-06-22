import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { auth } from "../../firebase"; // your firebase config

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");

        const token = await user.getIdToken();
        const res = await axios.get("http://localhost:8080/api/users/teacher/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeacher(res.data.teacher);
      } catch (err) {
        console.error("Error fetching teacher profile:", err.message);
      }
    };

    fetchTeacherProfile();
  }, []);

  if (!teacher) {
    return <div className="text-center text-white mt-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 overflow-hidden">
                  <img
                    src={teacher.imageUrl || "https://api.dicebear.com/8.x/thumbs/svg?seed=Teacher"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-20 px-8 pb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-indigo-400">{teacher.name}</h1>
                  <p className="text-gray-400">{teacher.email}</p>
                </div>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Experience</h3>
                    <p className="text-white">{teacher.experience || "Not Provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Qualification</h3>
                    <p className="text-white">{teacher.qualification || "Not Provided"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Created Courses</h3>
                    <p className="text-white">{teacher.createdCourses?.length || 0}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Status</h3>
                    <p className="text-green-400">Active</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Bio</h3>
                <p className="text-gray-300">{teacher.bio || "No bio provided."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
