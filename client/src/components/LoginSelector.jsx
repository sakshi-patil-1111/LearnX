import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import HomeLayout from './HomeLayout';

const LoginSelector = () => {
  const { role } = useParams();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${isSignup ? "Signup" : "Login"} successful as ${role}`);
    navigate(`/${role}/dashboard`);
  };

  const handleGoogleLogin = () => {
    alert(`Logged in with Google as ${role}`);
    navigate(`/${role}/dashboard`);
  };

  return (
    <HomeLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white mt-6"
      >
        <p className="text-2xl font-medium m-auto mb-4">
          <span className="text-indigo-400 capitalize">{role}</span>{" "}
          <span className="text-black">{isSignup ? "Sign Up" : "Login"}</span>
        </p>

        {isSignup && (
          <div className="w-full">
            <p className="text-black">Name</p>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500 text-black placeholder-gray-400"
              type="text"
              placeholder="Enter name"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p className="text-black">Email</p>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500 text-black placeholder-gray-400"
            type="email"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-black">Password</p>
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500 text-black placeholder-gray-400"
            type="password"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-gray-100 text-black w-full py-2 rounded-md flex justify-center items-center gap-2 border mt-2"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-2 rounded-md mt-2"
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        <p className="text-sm text-center w-full text-black">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-indigo-400 ml-1 cursor-pointer font-medium"
          >
            {isSignup ? "Login here" : "Sign up"}
          </span>
        </p>
      </form>
    </HomeLayout>
  );
};

export default LoginSelector;
