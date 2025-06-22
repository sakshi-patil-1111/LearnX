// routes/studentRoutes.js
import express from "express";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
import { getStudentProfile, updateStudentProfile } from "../controllers/studentController.js";

const router = express.Router();

router.get("/profile", verifyFirebaseToken, getStudentProfile);
router.put("/profile", verifyFirebaseToken, updateStudentProfile);

export default router;
