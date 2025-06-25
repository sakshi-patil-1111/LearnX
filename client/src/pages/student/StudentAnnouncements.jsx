import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchAllAnnouncements } from "../../utils/api";
import { useAppContext } from "../../context/appContext"; 

const Announcements = () => {
  const { user } = useAppContext(); 
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await fetchAllAnnouncements();

        // Filter announcements by enrolled course titles
        const enrolledTitles = user?.enrolledCourses?.map((c) => c.title) || [];
        const filtered = res.announcements?.filter((a) =>
          enrolledTitles.includes(a.course)
        );

        setAnnouncements(filtered || []);
      } catch (err) {
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    if (user?.enrolledCourses?.length) {
      loadAnnouncements();
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar userType="student" />
      <div className="p-6">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-400">
              Announcements
            </h1>
          </div>

          {loading ? (
            <div className="text-center text-white">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : announcements.length === 0 ? (
            <div className="text-gray-400">
              No announcements for your enrolled courses.
            </div>
          ) : (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-indigo-400 mb-2">
                        {announcement.title}
                      </h2>
                      <p className="text-gray-400">{announcement.course}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">{announcement.content}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400">
                        {new Date(announcement.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
