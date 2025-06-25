import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import ChatMessage from "./models/ChatMessage.js";

const app = express();
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

await connectDB();
connectCloudinary();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API Working");
});

//routes
app.use("/api/users", userRoutes);
app.use("/api/users/student", studentRoutes);
app.use("/api/users/teacher", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/attendance", attendanceRoutes);

io.on("connection", (socket) => {
  // Join a course-specific chat room
  socket.on("joinCourseChat", (courseId) => {
    socket.join(courseId);
  });

  // Handle sending a message
  socket.on("sendMessage", async (data) => {
    const { courseId, senderId, senderRole, message } = data;
    if (!courseId || !senderId || !senderRole || !message) return;
    try {
      const chatMsg = await ChatMessage.create({
        courseId,
        senderId,
        senderRole,
        message,
      });
      io.to(courseId).emit("newMessage", chatMsg);
    } catch (err) {
      socket.emit("error", { message: "Failed to send message." });
    }
  });

  // Fetch chat history for a course
  socket.on("fetchMessages", async (courseId) => {
    try {
      const messages = await ChatMessage.find({ courseId })
        .sort({ timestamp: 1 })
        .populate("senderId", "name role");
      socket.emit("chatHistory", messages);
    } catch (err) {
      socket.emit("error", { message: "Failed to fetch messages." });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
