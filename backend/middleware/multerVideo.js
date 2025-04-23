import multer from "multer";  // ✅ Correct import
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Ensure uploads directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../uploads"); // ✅ Absolute path
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Uploads directory created successfully.");
  } catch (err) {
    console.error("Error creating uploads directory:", err);
  }
}

// Setup storage with destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_"); // ✅ Replace spaces
    cb(null, `${uniqueSuffix}-${sanitizedFileName}`);
  },
});

// File filter for video files (MIME type and extension check)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
  const allowedExtensions = [".mp4", ".mov", ".avi"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files (MP4, MOV, AVI) are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
