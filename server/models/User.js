import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      default: "Unnamed User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      default: "https://api.dicebear.com/8.x/thumbs/svg?seed=User&backgroundColor=f0f0f0&scale=90",
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },

    // === Student-specific ===
    rollNo: {
      type: String,
      validate: {
        validator: function (v) {
          return this.role !== "student" || !!v;
        },
        message: "Roll number is required for students",
      },
      default: function () {
        return this.role === "student" ? "Unknown Roll No" : undefined;
      },
    },
    course: {
      type: String,
      default: function () {
        return this.role === "student" ? "Not Assigned" : undefined;
      },
    },
    semester: {
      type: String,
      default: function () {
        return this.role === "student" ? "Not Available" : undefined;
      },
    },
    joined: {
      type: String,
      default: function () {
        return this.role === "student" ? "Not Available" : undefined;
      },
    },

    // === Teacher-specific ===
    experience: {
      type: String,
      validate: {
        validator: function (v) {
          return this.role !== "teacher" || !!v;
        },
        message: "Experience is required for teachers",
      },
      default: function () {
        return this.role === "teacher" ? "Fresher" : undefined;
      },
    },
    qualification: {
      type: String,
      default: function () {
        return this.role === "teacher" ? "Not Provided" : undefined;
      },
    },

    // === Shared ===
    bio: {
      type: String,
      default: "LearnX user",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
