import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// create context
const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

// provider component
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(true);

  // listen to firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken(true);

          //Fetch user from your backend
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/verify`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: firebaseUser.displayName }),
              credentials: "include",
            }
          );

          const data = await res.json();

          if (data.success && data.user) {
            setUser(data.user);
            setIsTeacher(data.user.role === "teacher");

            localStorage.setItem("learnx_user", JSON.stringify(data.user));
            localStorage.setItem("learnx_role", data.user.role);
          } else {
            console.error("Backend verification failed");
            setUser(null);
          }
        } catch (err) {
          console.error("Auto-login fetch failed:", err);
          setUser(null);
        }
      } else {
        setUser(null);
        setIsTeacher(false);
        localStorage.removeItem("learnx_user");
        localStorage.removeItem("learnx_role");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // save to localStorage
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
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
};
