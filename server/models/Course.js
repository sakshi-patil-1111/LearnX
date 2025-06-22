import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  materialType: {
    type: String,
    enum: ["video", "pdf", "link", "note"],
    default: "note",
  },
  materialUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  topic: String,
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "https://placehold.co/600x400?text=Course+Thumbnail",
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Embedded Materials
    materials: [materialSchema],

    // Enrolled Students
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
