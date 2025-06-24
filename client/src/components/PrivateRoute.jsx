import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const PrivateRoute = ({ children, allowedRole }) => {
  const { user, isTeacher, loading } = useAppContext();

  if (loading)
    return <div className="text-center text-white mt-10">Loading...</div>;
  if (!user) return <Navigate to="/select-role" />;

  if (allowedRole === "student" && isTeacher)
    return <Navigate to="/teacher/dashboard" />;
  if (allowedRole === "teacher" && !isTeacher)
    return <Navigate to="/student/dashboard" />;

  return children;
};

export default PrivateRoute;
