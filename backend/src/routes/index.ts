import { Router } from "express";
import productRoutes from "./product.routes.js";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Resources
router.use("/products", productRoutes);

export default router;

