import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; 

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // student or teacher object
  const [isTeacher, setIsTeacher] = useState(false); // true if role is teacher


  useEffect(() => {
    const storedUser = localStorage.getItem("learnx_user");
    const storedRole = localStorage.getItem("learnx_role");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsTeacher(storedRole === "teacher");
    }
  }, []);

  // Save to localStorage whenever user or role changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("learnx_user", JSON.stringify(user));
      localStorage.setItem("learnx_role", isTeacher ? "teacher" : "student");
    } else {
      localStorage.removeItem("learnx_user");
      localStorage.removeItem("learnx_role");
    }
  }, [user, isTeacher]);


  const logout = async () => {
    try {
      await signOut(auth); 
      setUser(null);
      setIsTeacher(false);
      localStorage.removeItem("learnx_user");
      localStorage.removeItem("learnx_role");
      alert("Logged out successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed.");
    }
  };


  const value = {
    navigate,
    user,
    setUser,
    isTeacher,
    setIsTeacher,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
