import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "your-super-secret-jwt-key";

export const verifyJWT = async (req, res, next) => {
  try {
    let token;

    // Priority: Cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // Fallback: Bearer token
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "none") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or removed",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
