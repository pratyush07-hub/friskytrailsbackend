import multer from "multer";

// Store file in memory (req.file.buffer)
const storage = multer.memoryStorage();

// Multer config with increased limits
export const upload = multer({ 
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per text field
    fileSize: 5 * 1024 * 1024,   // optional: 5 MB per file
  }
});
