import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  addMaterialToCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", authUser, createCourse);
router.get("/", getAllCourses); 
router.get("/:id", getCourseById);
router.post("/:id/enroll", authUser, enrollInCourse); 
router.post("/:id/material", authUser, addMaterialToCourse); 

export default router;
