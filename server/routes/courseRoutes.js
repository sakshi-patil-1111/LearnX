import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  addMaterialToCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
  deleteMaterialFromCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", authUser, createCourse);
router.get("/my", authUser, getMyCourses);
router.get("/", getAllCourses); 
router.get("/:id", authUser, getCourseById);
router.put("/:id", authUser, updateCourse);
router.delete("/:id", authUser, deleteCourse);
router.post("/:id/enroll", authUser, enrollInCourse); 
router.post("/:id/material", authUser, addMaterialToCourse); 
router.delete("/:id/material/:materialId", authUser, deleteMaterialFromCourse);


export default router;
