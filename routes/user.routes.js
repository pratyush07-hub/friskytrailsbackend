import { Router } from "express";
import { getCurrentUser, googleAuth, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-user").post(verifyJWT,getCurrentUser)
router.post("/google-auth", googleAuth);

export default router;
