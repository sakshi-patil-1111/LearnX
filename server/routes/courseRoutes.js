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
  getEnrolledCourses,
} from "../controllers/courseController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const uniqueName = `${base}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", authUser, createCourse);
router.get("/my", authUser, getMyCourses);
router.get("/", getAllCourses);
router.post("/enroll/:courseId", authUser, enrollInCourse);
router.get("/enrolled", authUser, getEnrolledCourses);
router.get("/:id", authUser, getCourseById);
router.put("/:id", authUser, updateCourse);
router.delete("/:id", authUser, deleteCourse);
router.post(
  "/:id/material",
  authUser,
  upload.single("file"),
  addMaterialToCourse
);
router.delete("/:id/material/:materialId", authUser, deleteMaterialFromCourse);
router.put(
  "/:courseId/materials/:materialId",
  authUser,
  updateMaterialInCourse
);

export default router;
