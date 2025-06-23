import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import User from "../models/User.js";
export const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "File required" });

    const teacherId = req.user.uid;
    const course = await Course.findById(courseId);
    if (!course || course.createdBy !== teacherId) {
      return res.status(403).json({ message: "Unauthorized to create assignment for this course" });
    }

    const result = await uploadToCloudinary(file.path, "assignments");

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      course: courseId,
      createdBy: teacherId,
      fileUrl: result.secure_url,
    });

    await assignment.save();
    res.status(201).json({ success: true, assignment });
  } catch (err) {
    console.error("Create assignment error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId });
    res.json({ success: true, assignments });
  } catch (err) {
    console.error("Get assignments error:", err);
    res.status(500).json({ success: false, message: "Failed to get assignments" });
  }
};



export const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user.uid;

    const assignments = await Assignment.find({ createdBy: teacherId })
      .sort({ createdAt: -1 }) // optional: latest first
      .populate("course", "title"); // get course title only

    const teacher = await User.findOne({ uid: teacherId });

    const formatted = assignments.map((a) => ({
      _id: a._id,
      title: a.title,
      description: a.description,
      dueDate: a.dueDate,
      fileUrl: a.fileUrl,
      courseTitle: a.course?.title || "Unknown",
      createdByName: teacher?.name || "You",
    }));

    res.json({ success: true, assignments: formatted });
  } catch (err) {
    console.error("Fetch teacher assignments failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const course = await Course.findById(assignment.course).lean();
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrolledStudents = await User.find({ uid: { $in: course.enrolledStudents } }).select(
      "uid name email"
    );

    const result = enrolledStudents.map((student) => {
      const submission = assignment.submissions.find(
        (s) => s.studentId === student.uid
      );

      return {
        uid: student.uid,
        name: student.name,
        email: student.email,
        submitted: !!submission,
        fileUrl: submission?.fileUrl || null,
        submittedAt: submission?.submittedAt || null,
      };
    });

    res.json({ success: true, submissions: result });
  } catch (err) {
    console.error("Error fetching assignment submissions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
