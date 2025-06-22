// controllers/studentController.js
import User from "../models/User.js";

export const getStudentProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const student = await User.findOne({ uid, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ success: true, student });
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const updatedStudent = await User.findOneAndUpdate(
      { uid, role: "student" },
      { ...req.body },
      { new: true }
    );

    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });

    res.json({ success: true, student: updatedStudent });
  } catch (err) {
    console.error("Error updating student profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
