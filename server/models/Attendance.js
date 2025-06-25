import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: String, // Using uid from User model
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      default: "present",
    },
    markedBy: {
      type: String, // Teacher's uid
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index to ensure one attendance record per student per course per date
attendanceSchema.index(
  { courseId: 1, studentId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
