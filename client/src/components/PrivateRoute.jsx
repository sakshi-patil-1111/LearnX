import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const PrivateRoute = ({ children, allowedRole }) => {
  const { user, isTeacher } = useAppContext();

  if (!user) return <Navigate to="/select-role" />; 

  if (allowedRole === "student" && isTeacher) return <Navigate to="/teacher/dashboard" />;
  if (allowedRole === "teacher" && !isTeacher) return <Navigate to="/student/dashboard" />;

  return children;
};

export default PrivateRoute;
