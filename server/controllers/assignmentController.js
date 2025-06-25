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
    const studentId = req.user.uid;

    const assignments = await Assignment.find({ course: courseId })
      .lean() 
      .sort({ dueDate: 1 });

    const result = assignments.map((assignment) => {
      const submission = assignment.submissions?.find(
        (s) => s.studentId === studentId
      );

      return {
        ...assignment,
        submissions: submission ? [submission] : [],
      };
    });

    res.json({ success: true, assignments: result });
  } catch (err) {
    console.error("Get assignments error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to get assignments" });
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
        grade: submission?.grade ?? null,
        feedback: submission?.feedback ?? "",
    };
    });

    res.json({ success: true, submissions: result });
  } catch (err) {
    console.error("Error fetching assignment submissions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// GET /api/assignments/student
export const getStudentAssignments = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).populate("enrolledCourses");

    if (!user) return res.status(404).json({ message: "User not found" });

    const courseIds = user.enrolledCourses.map((c) => c._id);

    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate("course", "title") // to include course title
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (err) {
    console.error("Error fetching student assignments:", err);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};


export const submitAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const studentId = req.user.uid;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const now = new Date();
    if (now > new Date(assignment.dueDate))
      return res.status(400).json({ message: "Deadline has passed" });

    const alreadySubmitted = assignment.submissions.some((s) => s.studentId === studentId);
    if (alreadySubmitted)
      return res.status(400).json({ message: "Already submitted" });

    if (!req.file)
      return res.status(400).json({ message: "File required" });

    const upload = await uploadToCloudinary(req.file.path, "assignments");

    assignment.submissions.push({
      studentId,
      fileUrl: upload.secure_url,
      submittedAt: now,
    });

    await assignment.save();

    res.status(200).json({ message: "Submission successful", fileUrl: upload.secure_url });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};

//for grading assignmnets
export const gradeSubmission = async (req, res) => {
  const { assignmentId, studentId } = req.params;
  const { grade, feedback } = req.body;
  const teacherId = req.user.uid;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    if (assignment.createdBy !== teacherId)
      return res.status(403).json({ message: "Not authorized" });

    const submission = assignment.submissions.find(s => s.studentId === studentId);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.grade = grade;
    submission.feedback = feedback;

    await assignment.save();
    res.json({ success: true, message: "Graded successfully" });
  } catch (err) {
    console.error("Grading error:", err);
    res.status(500).json({ message: "Failed to assign grade" });
  }
};