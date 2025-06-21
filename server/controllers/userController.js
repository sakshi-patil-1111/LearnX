import { adminAuth } from "../config/firebase.js";
import User from "../models/User.js";

export const loginOrRegister = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const idToken = authHeader.split(" ")[1];
  const { role } = req.body; 

  try {
   const decodedToken = await adminAuth.verifyIdToken(idToken);
  console.log("Decoded Token :", decodedToken);

  let { uid, email, name, picture } = decodedToken;

  // fallback from Firebase user record
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
      message: "Email not found in token or user record"
    });
  }
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        name,
        email,
        imageUrl: picture || "",
        role,
        enrolledCourses: [],
        createdCourses: [],
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
