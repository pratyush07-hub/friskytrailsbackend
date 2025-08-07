import { Router } from "express";
import { contactclient } from "../controllers/contact.controller.js";

const router = Router();   

router.route("/client").post(contactclient);

export default router;