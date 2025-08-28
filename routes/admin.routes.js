import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBlog, createLocation, getLocations, getLocationWithBlogs } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-blog").post(upload.single("image"),verifyJWT, createBlog)
router.post("/locations", upload.single("image"),verifyJWT, createLocation);
router.get("/locations/:slug", verifyJWT, getLocationWithBlogs);
router.get("/locations", verifyJWT, getLocations)

export default router;