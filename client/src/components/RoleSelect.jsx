import { useNavigate } from 'react-router-dom';
import HomeLayout from './HomeLayout';

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <HomeLayout>
      <div className="h-screen flex items-center justify-center bg-dark text-white px-4">
        <div className="bg-glass backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-accent mb-8 font-outfit">Select Your Role</h2>

          <div className="flex flex-col gap-6">
            <button
              onClick={() => navigate("/auth/student")}
              className="bg-primary hover:bg-accent text-white font-semibold text-xl py-4 px-6 rounded-2xl shadow-lg border border-accent transition-all duration-300 ease-in-out hover:scale-105"
            >
               Student
            </button>

            <button
              onClick={() => navigate("/auth/teacher")}
              className="bg-primary hover:bg-accent text-white font-semibold text-xl py-4 px-6 rounded-2xl shadow-lg border border-accent transition-all duration-300 ease-in-out hover:scale-105"
            >
               Teacher
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default RoleSelect;
