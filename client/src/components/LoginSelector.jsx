import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import HomeLayout from "./HomeLayout";
import googleLogo from "../assets/google-logo.png";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider
} from "firebase/auth";
import { auth} from "../firebase";
import { useAppContext } from "../context/appContext";

const LoginSelector = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { setUser, setIsTeacher } = useAppContext();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleFirebaseLogin = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken(true); 

    const res = await axios.post(
      "http://localhost:8080/api/users/verify",
      { role ,name: firebaseUser.displayName}, 
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      setUser(res.data.user);
      setIsTeacher(res.data.user.role === "teacher");
      alert("Login successful!");
      navigate(`/${role}/dashboard`);
    } else {
      alert(res.data.message || "User verification failed");
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name } = form;

    try {
      setLoading(true);

      let result;
      if (isSignup) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await result.user.getIdToken(true); 

      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      await handleFirebaseLogin(result.user);
      
    } catch (error) {
    const message = error.response?.data?.message ||error.message ||"Something went wrong. Please try again.";

    console.error("Auth error:", message);
    alert(message);

  }finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      console.log("Full Google user:", result.user);
      await handleFirebaseLogin(result.user);

    } catch (error) {
    const message = error.response?.data?.message ||error.message ||"Something went wrong. Please try again.";

    console.error("Google login error:", message);
    alert(message);

  } finally {
      setLoading(false);
    }
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
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500 text-black placeholder-gray-400 cursor-text"
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
          disabled={loading}
        >
          <img src={googleLogo} alt="Google" className="w-6 h-5" />
          Continue with Google
        </button>

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-2 rounded-md mt-2"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isSignup
            ? "Create Account"
            : "Login"}
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
