import { Request, Response } from "express";
import * as productService from "../services/product.service.js";

/**
 * ========================================================================
 * PRODUCT CONTROLLER — Điều hướng và phản hồi API Sản phẩm
 * Logic chuẩn 3 bước: Nhận Request -> Gọi Service truy vấn -> Trả về JSON
 * ========================================================================
 */

/**
 * 1. LẤY TẤT CẢ SẢN PHẨM
 * Route: GET /api/products
 */
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi getProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải danh sách sản phẩm",
    });
  }
};

/**
 * 2. LẤY SẢN PHẨM NỔI BẬT (FEATURED)
 * Route: GET /api/products/featured
 */
export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getFeaturedProducts();

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi getFeaturedProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải sản phẩm nổi bật",
    });
  }
};

/**
 * 3. LẤY SẢN PHẨM FLASH SALE (GIẢM GIÁ)
 * Route: GET /api/products/flash-sale
 */
export const getFlashSaleProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getFlashSaleProducts();

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi getFlashSaleProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải sản phẩm Flash Sale",
    });
  }
};

/**
 * 4. LẤY CHI TIẾT SẢN PHẨM THEO SLUG
 * Route: GET /api/products/:slug
 */
export const getProductBySlug = async (req: Request, res: Response) => {
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
    console.error("Lỗi getProductBySlug:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải thông tin chi tiết sản phẩm",
    });
  }
};
