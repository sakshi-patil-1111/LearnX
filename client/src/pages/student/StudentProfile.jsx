import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { auth } from "../../firebase"; // import your firebase config

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");

        const token = await user.getIdToken();
        console.log("Firebase Token:", token);

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/student/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(res.data.student);
      } catch (err) {
        console.error("Error fetching student profile:", err.message);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="text-center text-white mt-10">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="p-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 overflow-hidden">
                  <img
                    src={
                      profile.imageUrl ||
                      "https://api.dicebear.com/8.x/thumbs/svg?seed=Student"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="pt-20 px-8 pb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-indigo-400">
                    {profile.name}
                  </h1>
                  <p className="text-gray-400">{profile.email}</p>
                </div>
                <Link to="/student/edit/profile">
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition transform hover:scale-105 duration-300">
                    Edit Profile
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Roll Number
                    </h3>
                    <p className="text-white">
                      {profile.rollNo || "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Course
                    </h3>
                    <p className="text-white">
                      {profile.course || "Not Assigned"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Semester
                    </h3>
                    <p className="text-white">{profile.semester || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Joined
                    </h3>
                    <p className="text-white">{profile.joined || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Status
                    </h3>
                    <p className="text-green-400">Active</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Bio</h3>
                <p className="text-gray-300">
                  {profile.bio || "No bio provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
