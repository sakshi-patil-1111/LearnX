
import express from "express";
import { loginOrRegister, getStudentProfile, getTeacherProfile } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/verify", authUser, loginOrRegister);
router.get("/student/profile", authUser, getStudentProfile);

router.get("/teacher/profile", authUser, getTeacherProfile);

export default router;