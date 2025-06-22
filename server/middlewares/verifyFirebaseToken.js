// middlewares/verifyFirebaseToken.js
import { adminAuth } from "../config/firebase.js";

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
};

export default verifyFirebaseToken;
