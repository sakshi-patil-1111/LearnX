import express from "express";
const router = express.Router();
import {
  getAllAnnouncements,
  getAnnouncementsByCourse,
  getAnnouncementsForEnrolledCourses, 
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import authUser from "../middlewares/authUser.js";

// Get all announcements
router.get("/", getAllAnnouncements);

// Get announcements for enrolled courses
router.get("/enrolled", authUser, getAnnouncementsForEnrolledCourses);
// Get announcements by course
router.get("/course/:courseId", getAnnouncementsByCourse);
// Create announcement (protected)
router.post("/", authUser, createAnnouncement);
// Update announcement (protected)
router.put("/:id", authUser, updateAnnouncement);
// Delete announcement (protected)
router.delete("/:id", authUser, deleteAnnouncement);

export default router;
