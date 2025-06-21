import { adminAuth } from "../config/firebase.js";

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken; 

    next(); 
  } catch (error) {
    console.error("Firebase token verification error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authUser;
