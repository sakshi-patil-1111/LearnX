import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

export const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export const uploadToCloudinary = async (filePath, folder) => {
  const res = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "raw", // important for PDFs, TXT, etc.
  });
  fs.unlinkSync(filePath); // remove local temp file
  return res;
};
