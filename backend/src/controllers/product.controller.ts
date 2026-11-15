import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service.js";

/**
 * ========================================================================
 * PRODUCT CONTROLLER — Điều hướng và phản hồi API Sản phẩm
 * Chuẩn luồng: Nhận Request -> Gọi Service truy vấn -> Trả JSON
 * Nếu có lỗi -> Đẩy sang error.middleware.ts qua hàm next(error)
 * ========================================================================
 */

/**
 * 1. LẤY TẤT CẢ SẢN PHẨM
 * Route: GET /api/products
 */
export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    // Đẩy lỗi sang error.middleware.ts xử lý tập trung
    next(error);
  }
};

/**
 * 2. LẤY SẢN PHẨM NỔI BẬT (FEATURED)
 * Route: GET /api/products/featured
 */
export const getFeaturedProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getFeaturedProducts();

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. LẤY SẢN PHẨM FLASH SALE (GIẢM GIÁ)
 * Route: GET /api/products/flash-sale
 */
export const getFlashSaleProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getFlashSaleProducts();

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. LẤY CHI TIẾT SẢN PHẨM THEO SLUG
 * Route: GET /api/products/:slug
 */
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp slug của sản phẩm",
      });
    }

    const product = await productService.getProductBySlug(String(slug));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy sản phẩm với slug: ${slug}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
