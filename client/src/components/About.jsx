import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-10">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-6 text-center">
          About LearnX
        </h1>

        <p className="text-lg text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          At <span className="text-white font-semibold">LearnX</span>, our mission is to revolutionize learning
          by making high-quality education accessible to everyone. Whether you're a student,
          a teacher, or a curious learner, LearnX is your platform to grow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-md transition hover:scale-[1.02]">
            <h2 className="text-xl font-semibold text-indigo-300 mb-2">🌍 Our Vision</h2>
            <p className="text-gray-400">
              We aim to bridge the gap between ambition and education with expert content,
              modern tools, and community-driven motivation.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md transition hover:scale-[1.02]">
            <h2 className="text-xl font-semibold text-indigo-300 mb-2">👨‍🏫 Expert Educators</h2>
            <p className="text-gray-400">
              Our teachers are passionate mentors who simplify complex concepts
              and guide you through practical learning paths.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md transition hover:scale-[1.02]">
            <h2 className="text-xl font-semibold text-indigo-300 mb-2">🚀 What We Offer</h2>
            <p className="text-gray-400">
              Courses, assignments, community discussions, and tools
              tailored to boost your learning journey.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center space-y-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-base font-medium transition"
          >
            ← Back to Home
          </button>

          <div className="text-sm text-gray-400 text-center">
            Built with ❤️ by the LearnX Team. <br />
            © {new Date().getFullYear()} LearnX. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
