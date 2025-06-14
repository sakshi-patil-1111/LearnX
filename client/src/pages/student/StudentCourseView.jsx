import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar";


const StudentCourseView = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Dummy course and teacher data
  const course = {
    id: courseId,
    title: "Introduction to Machine Learning",
    description:
      "This course covers the basics of supervised and unsupervised learning, model evaluation, and popular algorithms like linear regression, decision trees, and neural networks.",
    teacher: {
      name: "Dr. Arvind Nair",
      bio: "PhD in AI | 10+ years in ML research | Passionate educator and Kaggle Grandmaster.",
      avatar:
        "https://api.dicebear.com/8.x/thumbs/svg?seed=Arvind&backgroundColor=f0f0f0&scale=90",
    },
  };

  const handleAddCourse = () => {
    alert(`Course "${course.title}" added to your dashboard!`);
    navigate("/student/dashboard");
  };

  return (
    <>
      <Navbar userType="student" />
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-400 mb-4 text-center">
          {course.title}
        </h1>

        <p className="text-gray-300 text-lg mb-6">{course.description}</p>

        <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-800 p-6 rounded-lg shadow-inner">
          <img
            src={course.teacher.avatar}
            alt="Teacher Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-md hover:scale-105 transition"
          />
          <div>
            <h3 className="text-xl font-semibold text-indigo-300">
              {course.teacher.name}
            </h3>
            <p className="text-gray-400 mt-1">{course.teacher.bio}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleAddCourse}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 hover:scale-105 transition text-white rounded-md"
          >
            Add Course
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default StudentCourseView;
