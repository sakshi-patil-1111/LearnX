import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const Navbar = ({ userType = "teacher" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAppContext();

  const getNavLinks = () => {
    if (userType === "teacher") {
      return [
        { to: "/teacher/dashboard", label: "Dashboard" },
        { to: "/teacher/courses", label: "Courses" },
        { to: "/teacher/materials", label: "Materials" },
        { to: "/teacher/assignments", label: "Assignments" },
        { to: "/teacher/profile", label: "Profile" },
      ];
    } else if (userType === "student") {
      return [
        { to: "/student/dashboard", label: "Dashboard" },
        { to: "/student/All-Courses", label: "All Courses" },
        { to: "/student/courses", label: "My Courses" },
        { to: "/student/assignments", label: "Assignments" },
        { to: "/student/downloads", label: "Downloads" },
        { to: "/student/profile", label: "Profile" },
      ];
    }
    throw new Error("Invalid userType provided to Navbar component");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-gray-800/90 backdrop-blur-md shadow-md z-50">
        <NavLink
          to={
            userType === "teacher" ? "/teacher/dashboard" : "/student/dashboard"
          }
          className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition"
        >
          LearnX
        </NavLink>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {getNavLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-2 py-1 rounded-md transition ${
                  isActive
                    ? "text-indigo-400 font-medium"
                    : "text-gray-300 hover:text-indigo-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button onClick={logout}
           className="ml-4 px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-indigo-400 hover:text-white transition">
            Logout
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white border border-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-700 transition"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>

      {/* Mobile Slide-in Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-72 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 translate-x-0">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-indigo-400">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {getNavLinks().map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-md transition ${
                        isActive
                          ? "bg-indigo-400/10 text-indigo-400 font-medium"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-indigo-300"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="p-6 border-t border-gray-700">
                <button 
                  className="w-full px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-indigo-400 hover:text-white transition"
                  onClick={() =>{ setIsMobileMenuOpen(false); logout();}}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
