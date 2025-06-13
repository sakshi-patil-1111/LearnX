import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Front = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative bg-gray-900 text-white overflow-hidden font-sans">

      {/* Blurred Background Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800/80 backdrop-blur-md shadow-md z-10 relative">
        <h1 className="text-2xl font-bold text-indigo-400">LearnX</h1>

        {/* Desktop Nav */}
        <nav className="space-x-6 hidden md:flex">
          <NavLink to="/" className="hover:text-indigo-300 transition">Home</NavLink>
          <NavLink to="/contact" className="hover:text-indigo-300 transition">Contact</NavLink>
          <NavLink to="/about" className="hover:text-indigo-300 transition">About Us</NavLink>
          <NavLink to="/login" className="hover:text-indigo-300 transition">Login</NavLink>
          <NavLink to="/signup" className="hover:bg-indigo-400 px-4 py-2 bg-white text-gray-900 rounded-md transition">Sign Up</NavLink>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white border px-2 py-1 rounded"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 translate-x-0">
            <div className="flex flex-col px-6 py-8 space-y-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-right text-white font-bold mb-4"
              >
                
              </button>
              <NavLink to="/" className="hover:text-indigo-300" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/contact" className="hover:text-indigo-300" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
              <NavLink to="/about" className="hover:text-indigo-300" onClick={() => setIsMobileMenuOpen(false)}>About Us</NavLink>
              <NavLink to="/login" className="hover:text-indigo-300" onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink>
              <NavLink to="/signup" className="bg-white text-gray-900 rounded-md px-4 py-2 hover:bg-indigo-400 transition" onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </NavLink>
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center z-10 relative mt-20">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
          Learn<span className="text-indigo-400"> From The </span><br />Best Educators
        </h2>
        <p className="text-gray-400 max-w-xl mb-8 text-lg">
          Dive into a world of knowledge with top educators to enhance your skills.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="bg-indigo-400 text-white font-medium px-6 py-2 rounded-md shadow hover:bg-indigo-500 transition">
            Join Now
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-gray-900 transition">
            Know More
          </button>
        </div>
        <div className="flex gap-6 text-gray-400 text-sm">
          <span>🎓 30K+ Students Enrolled</span>
          <span>|</span>
          <span>👨‍🏫 50+ Instructors</span>
        </div>
      </main>
    </div>
  );
};

export default Front;
