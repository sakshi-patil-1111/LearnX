import React from 'react';
import HomeLayout from './HomeLayout';

const Front = () => {
  return (
    <HomeLayout>
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-center">
        Learn<span className="text-indigo-400"> From The </span><br />Best Educators
      </h2>
      <p className="text-gray-400 max-w-xl mb-8 text-lg text-center">
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
    </HomeLayout>
  );
};

export default Front;
