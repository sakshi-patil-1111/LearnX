import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};
export const uploadToCloudinary = async (localFilePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw", // ← THIS IS THE KEY
      folder, // e.g., "materials"
    });
    fs.unlinkSync(localFilePath); // delete local file
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};