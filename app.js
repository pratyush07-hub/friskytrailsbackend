import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import { app } from "./app.js";

dotenv.config({
  path: ".env",
});

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://frisky-trails.vercel.app",
      "https://frisky-trails-git-main.vercel.app",
      "https://frisky-trails-git-develop.vercel.app"
    ];
    
    // Add your Vercel domain to allowed origins
    if (process.env.CORS_ORIGIN) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"]
};

app.use(
  cors(corsOptions)
);

app.options("*", cors()); 

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// app.options("*", cors());

app.use(express.static("public"));
app.use(cookieParser());

import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import adventureRoutes from "./routes/adventure.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";

// Add logging for route mounting
console.log("Mounting routes...");

app.use("/api/v1/contact", contactRoutes);
console.log("✓ Contact routes mounted");

app.use("/api/v1/user", userRoutes);
console.log("✓ User routes mounted");

app.use("/api/v1/adventure", adventureRoutes);
console.log("✓ Adventure routes mounted");

app.use("/api/v1/admin", adminRoutes);
console.log("✓ Admin routes mounted");

app.use("/api/v1/blog", blogRoutes);
console.log("✓ Blog routes mounted");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }
  
  if (err.name === 'TypeError' && err.message.includes('path-to-regexp')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid route parameter',
      error: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export { app };
