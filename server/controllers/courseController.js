import Course from "../models/Course.js";
import User from "../models/User.js";

// Create a new course (teacher only)
export const createCourse = async (req, res) => {
  try {
    const { title, code, description, category, thumbnail, tags } = req.body;

    const teacher = await User.findOne({ uid: req.user.uid });
    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Only teachers can create courses" });
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

// Get all courses (public)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

// Courses created by teacher
export const getMyCourses = async (req, res) => {
  try {
    const teacher = await User.findOne({ uid: req.user.uid });
    if (!teacher) return res.status(404).json({ success: false, message: "User not found" });

    const courses = await Course.find({ createdBy: teacher.uid });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

// Get course by ID (only creator or enrolled student can access)
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const uid = req.user.uid?.trim();
    const createdBy = course.createdBy?.trim();
    const enrolled = (course.enrolledStudents || []).map(e => e.trim());

    const isCreator = createdBy === uid;
    const isEnrolled = enrolled.includes(uid);

    console.log({
      uid,
      createdBy,
      isCreator,
      enrolledStudents: enrolled,
      isEnrolled
    });

    if (!isCreator && !isEnrolled) {
      return res.status(403).json({ success: false, message: "Not authorized to view this course" });
    }

    res.status(200).json({ success: true, course });

  } catch (err) {
    console.error("Error in getCourseById:", err);
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

    if (course.enrolledStudents.includes(student.uid)) {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }

    course.enrolledStudents.push(student.uid);
    student.enrolledCourses.push(course._id);

    await course.save();
    await student.save();

    res.status(200).json({ success: true, message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ success: false, message: "Enrollment failed" });
  }
};

// Add material to a course (teacher only)
export const addMaterialToCourse = async (req, res) => {
  try {
    const { title, materialType, materialUrl, topic } = req.body;

    const course = await Course.findById(req.params.id);
    const teacher = await User.findOne({ uid: req.user.uid });

    if (!course || !teacher || teacher.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (course.createdBy !== teacher.uid) {
      return res.status(403).json({ success: false, message: "You are not the owner of this course" });
    }

    course.materials.push({ title, materialType, materialUrl, topic });
    await course.save();

    res.status(200).json({ success: true, message: "Material added", materials: course.materials });
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
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.createdBy !== uid) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const fieldsToUpdate = ["title", "code", "description", "category", "thumbnail", "tags"];
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
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.createdBy !== uid) {
      return res.status(403).json({ success: false, message: "Not authorized to delete" });
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
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (course.createdBy !== uid) return res.status(403).json({ success: false, message: "Unauthorized" });

    course.materials = course.materials.filter((mat) => mat._id.toString() !== materialId);
    await course.save();

    res.json({ success: true, message: "Material deleted", materials: course.materials });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete material" });
  }
};
