import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    course: { type: String, required: true }, // course id or name
    instructor: { type: String, required: true }, // instructor name or id
    date: { type: Date, default: Date.now },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
