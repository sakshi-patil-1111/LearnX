import Announcement from "../models/Announcement.js";
import User from "../models/User.js";


// Get all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch announcements" });
  }
};

// Get announcements by course
export const getAnnouncementsByCourse = async (req, res) => {
  try {
    const { course } = req.params;
    console.log(corse);
    const announcements = await Announcement.find({ course }).sort({
      createdAt: -1,
    });
    res.json({ success: true, announcements });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch announcements" });
  }
};

// Create announcement
export const createAnnouncement = async (req, res) => {
  try {
    console.log(req.body);
    const { title, content, course, priority } = req.body;
    const instructor = req.user.uid;
    const announcement = new Announcement({
      title,
      content,
      course,
      instructor,
      priority,
    });
    await announcement.save();
    res.status(201).json({ success: true, announcement });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Failed to create announcement" });
  }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, course, instructor, priority } = req.body;
    const updated = await Announcement.findByIdAndUpdate(
      id,
      { title, content, course, instructor, priority },
      { new: true }
    );
    res.json({ success: true, announcement: updated });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Failed to update announcement" });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.json({ success: true, message: "Announcement deleted" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Failed to delete announcement" });
  }
};

export const getAnnouncementsForEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).populate("enrolledCourses");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const courseTitles = user.enrolledCourses.map(course => course.title); 

    const announcements = await Announcement.find({
      course: { $in: courseTitles }
    }).sort({ createdAt: -1 });

    res.json({ success: true, announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};