import { Router } from "express";
import productRoutes from "./product.routes.js";
import bannerRoutes from "./banner.routes.js";

const router = Router();

// Health check: GET /api/health
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "MD Mobile API Server đang hoạt động tốt",
    timestamp: new Date().toISOString(),
  });
});

// Resources
router.use("/products", productRoutes);
router.use("/banners", bannerRoutes);

export default router;
