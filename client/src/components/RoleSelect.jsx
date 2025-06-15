import { useNavigate } from 'react-router-dom';
import HomeLayout from './HomeLayout';

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <HomeLayout>
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-semibold">Select your Role</h2>
        <button
          onClick={() => navigate("/auth/student")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-8 py-3 rounded-md transition"
        >
          Student
        </button>
        <button
          onClick={() => navigate("/auth/teacher")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-8 py-3 rounded-md transition"
        >
          Teacher
        </button>
      </div>
    </HomeLayout>
  );
};

export default RoleSelect;
