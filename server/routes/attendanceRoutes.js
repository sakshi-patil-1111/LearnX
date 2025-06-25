import express from "express";
import {
  markAttendance,
  markBulkAttendance,
  getAttendanceByDate,
  getAttendanceReport,
  getCourseStudents,
  getStudentAttendanceStats,
} from "../controllers/attendanceController.js";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";

const router = express.Router();

// All routes require authentication
router.use(verifyFirebaseToken);

// Mark attendance for a single student
router.post("/mark", markAttendance);

// Mark attendance for multiple students
router.post("/mark-bulk", markBulkAttendance);

// Get attendance for a specific course and date
router.get("/course/:courseId/date/:date", getAttendanceByDate);

// Get attendance report for a course (with optional date range and student filter)
router.get("/course/:courseId/report", getAttendanceReport);

// Get all students for a course (for attendance marking)
router.get("/course/:courseId/students", getCourseStudents);

// Get attendance statistics for all courses of a student
router.get("/student/stats", getStudentAttendanceStats);

export default router;
