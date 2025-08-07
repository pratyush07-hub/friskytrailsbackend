import { Router } from "express";
import { adventure } from "../controllers/adventure.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();   

router.route("/booking").post(verifyJWT,adventure);

export default router;