import express from "express";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
import { getTeacherProfile, updateTeacherProfile } from "../controllers/teacherController.js";

const router = express.Router();

router.get("/profile", verifyFirebaseToken, getTeacherProfile);
router.put("/profile", verifyFirebaseToken, updateTeacherProfile);

export default router;
