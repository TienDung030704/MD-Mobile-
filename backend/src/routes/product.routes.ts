import { Router } from "express";
import {
  getProducts,
  getFeaturedProducts,
  getFlashSaleProducts,
  getProductBySlug,
} from "../controllers/product.controller.js";

const router = Router();

/**
 * Danh sách Endpoint Sản phẩm (/api/products)
 */
// 1. Lấy tất cả sản phẩm: GET /api/products
router.get("/", getProducts);

// 2. Lấy sản phẩm nổi bật: GET /api/products/featured
router.get("/featured", getFeaturedProducts);

// 3. Lấy sản phẩm Flash Sale: GET /api/products/flash-sale
router.get("/flash-sale", getFlashSaleProducts);

// 4. Lấy chi tiết 1 sản phẩm: GET /api/products/:slug
router.get("/:slug", getProductBySlug);

export default router;
