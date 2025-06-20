import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
