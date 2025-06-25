import express from "express";
import authUser from "../middlewares/authUser.js";
import multer from "multer";
import { createAssignment, getAssignmentsByCourse, getAssignmentSubmissions, getStudentAssignments, getTeacherAssignments, gradeSubmission, submitAssignment  } from "../controllers/assignmentController.js";

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/", authUser, upload.single("file"), createAssignment);
router.get("/course/:courseId", authUser, getAssignmentsByCourse);
router.get("/teacher", authUser, getTeacherAssignments);
router.get("/:assignmentId/submissions", authUser, getAssignmentSubmissions);
router.get("/student", authUser, getStudentAssignments);
router.post("/:assignmentId/submit", authUser, upload.single("file"), submitAssignment);
router.patch("/:assignmentId/grade/:studentId", authUser, gradeSubmission);
export default router;