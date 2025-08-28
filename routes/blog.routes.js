import {Router} from "express";
import { getBlogBySlug } from "../controllers/admin.controller.js";


const router = Router();

router.get("/:slug", getBlogBySlug)

export default router;