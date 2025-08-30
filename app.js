import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import { app } from "./app.js";

dotenv.config({
  path: ".env",
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CORS_ORIGIN,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options("*", cors()); 

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

app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/adventure", adventureRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/blog", blogRoutes);

export { app };
