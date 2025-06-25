import Course from "../models/Course.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import path from "path";

// Create a new course (teacher only)
export const createCourse = async (req, res) => {
  try {
    const { title, code, description, category, thumbnail, tags } = req.body;

    const teacher = await User.findOne({ uid: req.user.uid });
    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(403)
        .json({ success: false, message: "Only teachers can create courses" });
    }

    const course = new Course({
      title,
      code,
      description,
      category,
      thumbnail,
      tags,
      createdBy: teacher.uid,
    });

    await course.save();

    teacher.createdCourses.push(course._id);
    await teacher.save();

    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Courses created by teacher
export const getMyCourses = async (req, res) => {
  try {
    const teacher = await User.findOne({ uid: req.user.uid });
    if (!teacher)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const courses = await Course.find({ createdBy: teacher.uid });
    res.json({ success: true, courses });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch courses" });
  }
};

// Get course by ID (only creator or enrolled student can access)
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const uid = req.user.uid?.trim();
    const createdBy = course.createdBy?.trim();
    const enrolled = (course.enrolledStudents || []).map((e) => e.trim());

    const isCreator = createdBy === uid;
    const isEnrolled = enrolled.includes(uid);

    if (!isCreator && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this course",
      });
    }

    const instructor = await User.findOne({ uid: course.createdBy });
    const fullStudents = await User.find({
      uid: { $in: course.enrolledStudents },
    }).select("name email rollNo course semester uid");

    res.status(200).json({
      success: true,
      course: {
        ...course._doc,
        instructorName: instructor?.name || "Unknown",
        enrolledStudents: fullStudents,
      },
    });
  } catch (err) {
    console.error("Error in getCourseById:", err);
    res.status(500).json({ success: false, message: "Error fetching course" });
  }
};

// Enroll in a course (student only)
export const enrollInCourse = async (req, res) => {
  try {
    const uid = req.user.uid;
    const courseId = req.params.courseId;

    const user = await User.findOne({ uid });
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

    // Avoid duplicate enrollments
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    if (!course.enrolledStudents.includes(uid)) {
      course.enrolledStudents.push(uid);
      await course.save();
    }

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enrollment error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Add material to a course (teacher only)
export const addMaterialToCourse = async (req, res) => {
  try {
    const { title, materialType, topic } = req.body;
    let materialUrl = req.body.materialUrl;

    const course = await Course.findById(req.params.id);
    const teacher = await User.findOne({ uid: req.user.uid });

    if (!course || !teacher || teacher.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (course.createdBy !== teacher.uid) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this course",
      });
    }

    // If a file is uploaded, upload to Cloudinary
    if (req.file) {
     const result = await uploadToCloudinary(req.file.path, "materials", "raw");

      materialUrl = result.secure_url;
    }

    course.materials.push({
      title,
      materialType,
      topic,
      materialUrl,
      uploadedBy: teacher.uid,
      uploadedAt: new Date(),
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Material added",
      materials: course.materials,
    });
  } catch (err) {
    console.error("Add material error:", err);
    res.status(500).json({ success: false, message: "Failed to add material" });
  }
};


//edit course
export const updateCourse = async (req, res) => {
  try {
    const uid = req.user.uid;
    const course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.createdBy !== uid) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const fieldsToUpdate = [
      "title",
      "code",
      "description",
      "category",
      "thumbnail",
      "tags",
    ];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) course[field] = req.body[field];
    });

    await course.save();
    res.status(200).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

//delete course
export const deleteCourse = async (req, res) => {
  try {
    const uid = req.user.uid;
    const course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.createdBy !== uid) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete" });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Optional: remove course reference from User model
    await User.updateOne({ uid }, { $pull: { createdCourses: course._id } });

    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

//delete materils
export const deleteMaterialFromCourse = async (req, res) => {
  try {
    const { id: courseId, materialId } = req.params;
    const uid = req.user.uid;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    if (course.createdBy !== uid)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    course.materials = course.materials.filter(
      (mat) => mat._id.toString() !== materialId
    );
    await course.save();

    res.json({
      success: true,
      message: "Material deleted",
      materials: course.materials,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete material" });
  }
};

//to update materials
export const updateMaterialInCourse = async (req, res) => {
  const { courseId, materialId } = req.params;
  const updates = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    console.log(
      "All materials in course:",
      course.materials.map((m) => m._id.toString())
    );
    console.log("Requested material ID:", materialId);

    // Find the material
    const material = course.materials.find(
      (mat) => mat._id.toString() === materialId
    );
    if (!material)
      return res.status(404).json({ message: "Material not found" });

    // Apply updates
    Object.assign(material, updates);

    await course.save();

    res.status(200).json({ message: "Material updated", material });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        const instructor = await User.findOne({ uid: course.createdBy });
        return {
          ...course._doc,
          instructorName: instructor?.name || "Unknown",
        };
      })
    );

    res.status(200).json({ success: true, courses: enrichedCourses });
  } catch (err) {
    console.error("Fetch courses failed:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//get all enrolled courses
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const courses = await Course.find({ _id: { $in: user.enrolledCourses } });
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        const instructor = await User.findOne({ uid: course.createdBy });
        return {
          ...course._doc,
          instructorName: instructor?.name || "Unknown",
        };
      })
    );

    res.json({ courses: enrichedCourses });
  } catch (err) {
    console.error("Failed to fetch enrolled courses:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
