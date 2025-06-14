import React from "react";
import Navbar from "../../components/Navbar";

const Profile = () => {
  // Mock data - Replace with actual data from your backend
  const teacherProfile = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@learnx.com",
    department: "Mathematics",
    specialization: "Advanced Calculus",
    experience: "15 years",
    courses: 5,
    students: 150,
    bio: "Passionate educator with expertise in mathematics and a strong focus on student success. Dedicated to creating engaging learning experiences and fostering academic growth.",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="teacher" />

      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 overflow-hidden">
                  <img
                    src="https://via.placeholder.com/128"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-indigo-400">
                    {teacherProfile.name}
                  </h1>
                  <p className="text-gray-400">{teacherProfile.email}</p>
                </div>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Department
                    </h3>
                    <p className="text-white">{teacherProfile.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Specialization
                    </h3>
                    <p className="text-white">
                      {teacherProfile.specialization}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Experience
                    </h3>
                    <p className="text-white">{teacherProfile.experience}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Active Courses
                    </h3>
                    <p className="text-white">{teacherProfile.courses}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Total Students
                    </h3>
                    <p className="text-white">{teacherProfile.students}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Bio</h3>
                <p className="text-gray-300">{teacherProfile.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
