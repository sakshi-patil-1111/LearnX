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
  updateMaterialInCourse,
  getEnrolledCourses
} from "../controllers/courseController.js";


const router = express.Router();

router.post("/", authUser, createCourse);
router.get("/my", authUser, getMyCourses);
router.get("/", getAllCourses); 
router.post("/enroll/:courseId", authUser, enrollInCourse); 
router.get("/enrolled", authUser ,getEnrolledCourses);
router.get("/:id", authUser, getCourseById);
router.put("/:id", authUser, updateCourse);
router.delete("/:id", authUser, deleteCourse);
router.post("/:id/material", authUser, addMaterialToCourse); 
router.delete("/:id/material/:materialId", authUser, deleteMaterialFromCourse);
router.put("/:courseId/materials/:materialId",authUser ,updateMaterialInCourse);



export default router;
