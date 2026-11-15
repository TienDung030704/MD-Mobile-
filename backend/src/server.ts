import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Middlewares
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger in Development
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use("/api", routes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint không tồn tại",
  });
});

// Global Error Handler Middleware (luôn đặt ở cuối cùng)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 MD Mobile Backend Server running at: http://localhost:${PORT}`);
  console.log(`👉 API Endpoint: http://localhost:${PORT}/api/products`);
});

