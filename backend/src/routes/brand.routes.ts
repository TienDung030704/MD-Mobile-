import { Router } from "express";
import { getBrands, getBrandBySlug } from "../controllers/brands.controller.js";

const router = Router();

/**
 * Danh sách Endpoint Thương hiệu (/api/brands)
 */
// 1. Lấy tất cả thương hiệu: GET /api/brands
router.get("/", getBrands);

// 2. Lấy chi tiết thương hiệu theo slug: GET /api/brands/:slug
router.get("/:slug", getBrandBySlug);

export default router;

