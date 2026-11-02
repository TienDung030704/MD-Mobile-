import { Router } from "express";
import { getBanners } from "../controllers/banner.controller.js";

const router = Router();

/**
 * Danh sách Endpoint Banner (/api/banners)
 */
// GET /api/banners
router.get("/", getBanners);

export default router;
