import { adminAuth } from "../config/firebase.js";

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Fallbacks in case fields are missing
    const userRecord = await adminAuth.getUser(decodedToken.uid);
    const providerInfo = userRecord.providerData?.[0] || {};

    const name =
      decodedToken.name ||
      userRecord.displayName ||
      providerInfo.displayName ||
      null;

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || userRecord.email || providerInfo.email,
      name,
      picture: decodedToken.picture || userRecord.photoURL || providerInfo.photoURL || "",
    };

    next();
  } catch (error) {
    console.error("Firebase token verification error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
