import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    createdBy: {
      type: String, // Firebase UID of teacher
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    submissions: [
      {
        studentId: { type: String, required: true },
        fileUrl: String,
        submittedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);