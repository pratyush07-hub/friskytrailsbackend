import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBlog } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-blog").post(upload.single("image"),verifyJWT, createBlog)

export default router;