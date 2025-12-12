import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import { app } from "./app.js";

import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import adventureRoutes from "./routes/adventure.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";


dotenv.config({
  path: ".env",
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://frisky-trails.vercel.app",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use((req, res, next) => {
  // Set COOP to allow popups for OAuth flows
  // "unsafe-none" allows cross-origin popups which is needed for Google OAuth
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log the blocked origin for debugging
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);

// app.options("*", cors()); 

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// app.options("*", cors());

app.use(express.static("public"));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

import passport from "passport";
import configurePassport from "./config/passport.js";

// Initialize Passport
configurePassport();
app.use(passport.initialize());


app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", adventureRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/blog", blogRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('\n--- ERROR DETAILS ---');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  if (err.errors) console.error('Validation Errors:', err.errors);
  console.error('Request Body:', req.body);
  console.error('Request Params:', req.params);
  console.error('Request Query:', req.query);
  console.error('--- END ERROR DETAILS ---\n');
  
  const statusCode = err.statusCode || err.code || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      ...(err.errors && { errors: err.errors })
    })
  });
});

export { app };
