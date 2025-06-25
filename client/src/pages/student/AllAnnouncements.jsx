import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchEnrolledAnnouncements } from "../../utils/api";
import { useAppContext } from "../../context/appContext";

const AllAnnouncements = () => {
  const { user } = useAppContext();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchEnrolledAnnouncements();
        setAnnouncements(res.announcements);
      } catch (err) {
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
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
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6">
          Announcements
        </h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="text-gray-400">No announcements available.</div>
        ) : (
          <div className="space-y-6">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="bg-gray-800/80 p-6 rounded-lg shadow-md transition-transform hover:-translate-y-1"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <h2 className="text-xl text-indigo-400 font-semibold">
                      {a.title}
                    </h2>
                    <p className="text-gray-400 text-sm">{a.course}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                      a.priority
                    )}`}
                  >
                    {a.priority}
                  </span>
                </div>
                <p className="text-gray-300">{a.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAnnouncements;
