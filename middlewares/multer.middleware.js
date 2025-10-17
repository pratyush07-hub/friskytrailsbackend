import multer from "multer";

// Store file in memory (req.file.buffer)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
