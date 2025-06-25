import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Mark attendance for a student
export const markAttendance = async (req, res) => {
  try {
    const { courseId, studentId, status, notes, date } = req.body;
    const teacherId = req.user.uid;

    // Check if course exists and teacher is the creator
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy !== teacherId) {
      return res
        .status(403)
        .json({ message: "Not authorized to mark attendance for this course" });
    }

    // Check if student is enrolled in the course
    if (!course.enrolledStudents.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in this course" });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      courseId,
      studentId,
      date: new Date(date || Date.now()).setHours(0, 0, 0, 0),
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.notes = notes || "";
      existingAttendance.markedBy = teacherId;
      await existingAttendance.save();

      return res.status(200).json({
        message: "Attendance updated successfully",
        attendance: existingAttendance,
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      courseId,
      studentId,
      status,
      notes: notes || "",
      markedBy: teacherId,
      date: date || new Date(),
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark attendance for multiple students
export const markBulkAttendance = async (req, res) => {
  try {
    const { courseId, attendanceData, date } = req.body;
    const teacherId = req.user.uid;

    // Check if course exists and teacher is the creator
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy !== teacherId) {
      return res
        .status(403)
        .json({ message: "Not authorized to mark attendance for this course" });
    }

    const attendanceDate = new Date(date || Date.now()).setHours(0, 0, 0, 0);
    const results = [];

    for (const record of attendanceData) {
      const { studentId, status, notes } = record;

      // Check if student is enrolled
      if (!course.enrolledStudents.includes(studentId)) {
        results.push({
          studentId,
          success: false,
          message: "Student not enrolled in course",
        });
        continue;
      }

      try {
        // Check if attendance already exists
        let attendance = await Attendance.findOne({
          courseId,
          studentId,
          date: attendanceDate,
        });

        if (attendance) {
          // Update existing
          attendance.status = status;
          attendance.notes = notes || "";
          attendance.markedBy = teacherId;
          await attendance.save();
        } else {
          // Create new
          attendance = new Attendance({
            courseId,
            studentId,
            status,
            notes: notes || "",
            markedBy: teacherId,
            date: new Date(attendanceDate),
          });
          await attendance.save();
        }

        results.push({
          studentId,
          success: true,
          attendance,
        });
      } catch (error) {
        results.push({
          studentId,
          success: false,
          message: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Bulk attendance marked",
      results,
    });
  } catch (error) {
    console.error("Error marking bulk attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get attendance for a specific course and date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { courseId, date } = req.params;
    const userId = req.user.uid;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is authorized (teacher or enrolled student)
    const isTeacher = course.createdBy === userId;
    const isStudent = course.enrolledStudents.includes(userId);

    if (!isTeacher && !isStudent) {
      return res
        .status(403)
        .json({ message: "Not authorized to view attendance for this course" });
    }

    const attendanceDate = new Date(date).setHours(0, 0, 0, 0);
    const nextDate = new Date(attendanceDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const attendance = await Attendance.find({
      courseId,
      date: {
        $gte: new Date(attendanceDate),
        $lt: nextDate,
      },
    }).populate("courseId", "title");

    // If teacher, return all students with their attendance status
    if (isTeacher) {
      const allStudents = await User.find({
        uid: { $in: course.enrolledStudents },
        role: "student",
      }).select("uid name rollNo");

      const attendanceMap = {};
      attendance.forEach((record) => {
        attendanceMap[record.studentId] = record;
      });

      const studentsWithAttendance = allStudents.map((student) => ({
        student: {
          uid: student.uid,
          name: student.name,
          rollNo: student.rollNo,
        },
        attendance: attendanceMap[student.uid] || null,
      }));

      return res.status(200).json({
        course: { id: course._id, title: course.title },
        date: new Date(attendanceDate),
        students: studentsWithAttendance,
      });
    }

    // If student, return only their attendance
    const studentAttendance = attendance.find(
      (record) => record.studentId === userId
    );

    res.status(200).json({
      course: { id: course._id, title: course.title },
      date: new Date(attendanceDate),
      attendance: studentAttendance || null,
    });
  } catch (error) {
    console.error("Error getting attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get attendance report for a course (date range)
export const getAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate, studentId } = req.query;
    const userId = req.user.uid;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is authorized
    const isTeacher = course.createdBy === userId;
    const isStudent = course.enrolledStudents.includes(userId);

    if (!isTeacher && !isStudent) {
      return res
        .status(403)
        .json({ message: "Not authorized to view attendance for this course" });
    }

    // Build query
    const query = { courseId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // If student is requesting, only show their attendance
    if (isStudent) {
      query.studentId = userId;
    } else if (studentId) {
      // Teacher can filter by specific student
      query.studentId = studentId;
    }

    const attendance = await Attendance.find(query)
      .populate("courseId", "title")
      .sort({ date: -1 });

    // Get unique student IDs from attendance records
    const studentIds = [
      ...new Set(attendance.map((record) => record.studentId)),
    ];

    // Fetch student information
    const students = await User.find({ uid: { $in: studentIds } }).select(
      "uid name rollNo"
    );
    const studentMap = {};
    students.forEach((student) => {
      studentMap[student.uid] = student;
    });

    // Add student information to attendance records
    const attendanceWithStudentInfo = attendance.map((record) => ({
      ...record.toObject(),
      studentName: studentMap[record.studentId]?.name || "Unknown Student",
      studentRollNo: studentMap[record.studentId]?.rollNo || "",
    }));

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(
      (record) => record.status === "present"
    ).length;
    const absentDays = attendance.filter(
      (record) => record.status === "absent"
    ).length;
    const lateDays = attendance.filter(
      (record) => record.status === "late"
    ).length;
    const excusedDays = attendance.filter(
      (record) => record.status === "excused"
    ).length;
    const notMarkedDays = attendance.filter(
      (record) => record.status === "not marked"
    ).length;

    // Calculate attendance percentage excluding "not marked" records
    const markedRecords = attendance.filter(
      (record) => record.status !== "not marked"
    );
    const attendancePercentage =
      markedRecords.length > 0
        ? ((presentDays + lateDays) / markedRecords.length) * 100
        : 0;

    res.status(200).json({
      course: { id: course._id, title: course.title },
      dateRange: startDate && endDate ? { startDate, endDate } : null,
      statistics: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        notMarkedDays,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
      },
      attendance: attendanceWithStudentInfo,
    });
  } catch (error) {
    console.error("Error getting attendance report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all students for a course (for attendance marking)
export const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.uid;

    // Check if course exists and teacher is the creator
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy !== teacherId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view students for this course" });
    }

    const students = await User.find({
      uid: { $in: course.enrolledStudents },
      role: "student",
    }).select("uid name rollNo email");

    res.status(200).json({
      course: { id: course._id, title: course.title },
      students,
    });
  } catch (error) {
    console.error("Error getting course students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get attendance statistics for all courses of a student
export const getStudentAttendanceStats = async (req, res) => {
  try {
    const studentId = req.user.uid;

    // Get all courses where student is enrolled
    const courses = await Course.find({
      enrolledStudents: studentId,
    }).select("_id title");

    const courseStats = [];
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalExcused = 0;
    let totalNotMarked = 0;
    let totalDays = 0;

    for (const course of courses) {
      const attendance = await Attendance.find({
        courseId: course._id,
        studentId: studentId,
      });

      const presentDays = attendance.filter(
        (record) => record.status === "present"
      ).length;
      const absentDays = attendance.filter(
        (record) => record.status === "absent"
      ).length;
      const lateDays = attendance.filter(
        (record) => record.status === "late"
      ).length;
      const excusedDays = attendance.filter(
        (record) => record.status === "excused"
      ).length;
      const notMarkedDays = attendance.filter(
        (record) => record.status === "not marked"
      ).length;
      const courseTotalDays = attendance.length;

      // Calculate percentage excluding "not marked" records
      const markedRecords = attendance.filter(
        (record) => record.status !== "not marked"
      );
      const attendancePercentage =
        markedRecords.length > 0
          ? ((presentDays + lateDays) / markedRecords.length) * 100
          : 0;

      courseStats.push({
        courseId: course._id,
        courseTitle: course.title,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        notMarkedDays,
        totalDays: courseTotalDays,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
      });

      // Add to totals
      totalPresent += presentDays;
      totalAbsent += absentDays;
      totalLate += lateDays;
      totalExcused += excusedDays;
      totalNotMarked += notMarkedDays;
      totalDays += courseTotalDays;
    }

    // Calculate overall statistics
    const markedRecords = totalDays - totalNotMarked;
    const overallPercentage =
      markedRecords > 0
        ? ((totalPresent + totalLate) / markedRecords) * 100
        : 0;

    res.status(200).json({
      overallStats: {
        totalPresent,
        totalAbsent,
        totalLate,
        totalExcused,
        totalNotMarked,
        totalDays,
        attendancePercentage: Math.round(overallPercentage * 100) / 100,
      },
      courseStats,
    });
  } catch (error) {
    console.error("Error getting student attendance stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
