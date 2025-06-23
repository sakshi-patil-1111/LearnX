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

const app = express();
const PORT = process.env.PORT || 8080;

await connectDB();
connectCloudinary();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
