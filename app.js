import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import { app } from "./app.js";

dotenv.config({
  path: ".env",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://frisky-trails.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Enable pre-flight requests for all routes
app.options("*", cors({
  origin: process.env.CORS_ORIGIN || "https://frisky-trails.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Add security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  next();
});

// app.options("*", cors());

app.use(express.static("public"));
app.use(cookieParser());

import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import adventureRoutes from "./routes/adventure.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";

app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/adventure", adventureRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/blog", blogRoutes);

export { app };
