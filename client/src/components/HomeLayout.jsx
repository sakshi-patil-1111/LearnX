import React from "react";
import { NavLink } from "react-router-dom";

const HomeLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-gray-900 text-white overflow-hidden font-sans">

      {/* Blurred Background Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800/80 backdrop-blur-md shadow-md z-10 relative">
        <h1 className="text-2xl font-bold text-indigo-400">LearnX</h1>
        <nav className="space-x-6 hidden md:flex">
          <NavLink to="/" className="hover:text-indigo-300 transition">Home</NavLink>
          <NavLink to="/contact" className="hover:text-indigo-300 transition">Contact</NavLink>
          <NavLink to="/about" className="hover:text-indigo-300 transition">About Us</NavLink>
          <NavLink to="/login" className="hover:text-indigo-300 transition">Login</NavLink>
          <NavLink to="/signup" className="hover:bg-indigo-400 px-4 py-2 bg-white text-gray-900 rounded-md transition">Sign Up</NavLink>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
        {children}
      </main>
    </div>
  );
};

export default HomeLayout;
