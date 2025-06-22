import { adminAuth } from "../config/firebase.js";
import User from "../models/User.js";

// --- LOGIN OR REGISTER ---
export const loginOrRegister = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];
  const { role } = req.body;

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("Decoded Token :", decodedToken);

    let { uid, email, name, picture } = decodedToken;

    // fallback if not present
    if (!email || !name) {
      const userRecord = await adminAuth.getUser(uid);
      const providerInfo = userRecord.providerData?.[0] || {};

      email = email || userRecord.email || providerInfo.email;
      name = name || userRecord.displayName || providerInfo.displayName;
      picture = picture || userRecord.photoURL || providerInfo.photoURL;
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found in token or user record",
      });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      // Set defaults per role
      const defaults = {
        student: {
          rollNo: "Not Provided",
          course: "Not Assigned",
          semester: "Not Available",
          joined: "Not Available",
        },
        teacher: {
          experience: "Fresher",
          qualification: "Not Provided",
        },
      };

      user = await User.create({
        uid,
        name,
        email,
        imageUrl: picture || "",
        role,
        bio: "LearnX user",
        enrolledCourses: [],
        createdCourses: [],
        ...defaults[role],
      });

      return res.status(201).json({
        success: true,
        message: "User registered",
        user,
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Role mismatch. Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// --- GET STUDENT PROFILE ---
export const getStudentProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const student = await User.findOne({ uid }).select(
      "name email imageUrl bio role enrolledCourses rollNo course semester joined"
    );

    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// controllers/userController.js
export const getTeacherProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const teacher = await User.findOne({ uid }).select(
      "name email imageUrl role bio experience qualification createdCourses"
    );

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

