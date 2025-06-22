import Course from "../models/Course.js";
import User from "../models/User.js";

// Create a new course (teacher only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail, tags } = req.body;

    const teacher = await User.findOne({ uid: req.user.uid });
    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Only teachers can create courses" });
    }

    const course = new Course({
      title,
      description,
      category,
      thumbnail,
      tags,
      createdBy: teacher._id,
    });

    await course.save();

    // Update teacher's createdCourses
    teacher.createdCourses.push(course._id);
    await teacher.save();

    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all courses (public)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name email imageUrl")
      .populate("enrolledStudents", "name email imageUrl");

    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching course" });
  }
};

// Enroll in a course (student only)
export const enrollInCourse = async (req, res) => {
  try {
    const student = await User.findOne({ uid: req.user.uid });
    if (!student || student.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can enroll" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Check if already enrolled
    if (course.enrolledStudents.includes(student._id)) {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }

    course.enrolledStudents.push(student._id);
    student.enrolledCourses.push(course._id);

    await course.save();
    await student.save();

    res.status(200).json({ success: true, message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Enrollment failed" });
  }
};

// Add a material to a course (teacher only)
export const addMaterialToCourse = async (req, res) => {
  try {
    const { title, materialType, materialUrl, topic } = req.body;
    const course = await Course.findById(req.params.id);
    const teacher = await User.findOne({ uid: req.user.uid });

    if (!course || !teacher || teacher.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (!course.createdBy.equals(teacher._id)) {
      return res.status(403).json({ success: false, message: "You are not the owner of this course" });
    }

    course.materials.push({ title, materialType, materialUrl, topic });
    await course.save();

    res.status(200).json({ success: true, message: "Material added", materials: course.materials });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add material" });
  }
};
