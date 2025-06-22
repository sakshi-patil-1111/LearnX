import User from "../models/User.js";


export const getTeacherProfile = async (req, res) => {
  const { uid } = req.user;
  const teacher = await User.findOne({ uid, role: "teacher" });
  if (!teacher) return res.status(404).json({ message: "Not found" });
  res.json({ teacher });
};

export const updateTeacherProfile = async (req, res) => {
  const { uid } = req.user;
  const updated = await User.findOneAndUpdate(
    { uid, role: "teacher" },
    { ...req.body },
    { new: true }
  );
  res.json({ teacher: updated });
};
