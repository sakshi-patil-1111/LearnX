import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // student or teacher
  const [isTeacher, setIsTeacher] = useState(false); // role management

  const value = {
    navigate,
    user,
    setUser,
    isTeacher,
    setIsTeacher,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
