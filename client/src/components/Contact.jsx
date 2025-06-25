import React from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can also process form data here if needed

    // Redirect to home after submission
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-6 mt-10 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-indigo-400 mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          We'd love to hear from you. Whether you have a question or just want to say hello!
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              required
              className="p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-gray-300">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-2 text-sm text-gray-300">Subject</label>
            <input
              type="text"
              placeholder="How can we help you?"
              required
              className="p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-2 text-sm text-gray-300">Message</label>
            <textarea
              rows="5"
              placeholder="Type your message here..."
              required
              className="p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
