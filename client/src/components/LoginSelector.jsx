import React, { useEffect, useState } from "react";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import HomeLayout from "./HomeLayout";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import "../index.css";

const LoginSelector = ({ type: initialType }) => {
  const [role, setRole] = useState(null);
  const [authType, setAuthType] = useState(initialType);
  const { setIsTeacher, setUser } = useAppContext();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Set role (instructor/student)
  const handleSelect = (isInstructor) => {
    setIsTeacher(isInstructor);
    setRole(isInstructor ? "instructor" : "student");
  };

  // Redirect after successful login/signup
  useEffect(() => {
    if (isSignedIn && role) {
      setUser(user);
      if (role === "instructor") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  }, [isSignedIn, role, user, navigate, setUser]);

  const clerkAppearance = {
    variables: {
      colorPrimary: "#6366f1",
      colorBackground: "#ffffff",
      colorText: "#000000",
      colorInputBackground: "#ffffff",
      borderRadius: "0.75rem",
    },
    elements: {
      card: "clerk-card",
      headerTitle: "clerk-header",
      socialButtonsBlockButton: "clerk-social-btn",
      formButtonPrimary: "clerk-primary-btn",
      footer: "hidden", 
    },
  };

  return (
    <HomeLayout>
      <div className="login-page-container">
        {!role ? (
          <div className="login-selector-box">
            <h2 className="login-title">Continue as</h2>
            <div className="login-button-group">
              <button onClick={() => handleSelect(true)} className="btn-instructor">
                👩‍🏫 Instructor
              </button>
              <button onClick={() => handleSelect(false)} className="btn-student">
                👩‍🎓 Student
              </button>
            </div>
          </div>
        ) : (
          <div className="login-selector-box">
            <h2 className="login-title">
              {authType === "login" ? "Login as" : "Sign up as"} {role}
            </h2>

            {/* Custom toggle above Clerk form */}
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              {authType === "login" ? (
                <span>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setAuthType("signup")}
                    className="text-indigo-500 font-medium"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthType("login")}
                    className="text-indigo-500 font-medium"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>

    
            {authType === "login" ? (
              <SignIn appearance={clerkAppearance} redirectUrl={null} />
            ) : (
              <SignUp appearance={clerkAppearance} redirectUrl={null} />
            )}
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default LoginSelector;
