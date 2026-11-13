import { Request, Response } from "express";
import * as brandService from "../services/brand.service.js";

/**
 * ========================================================================
 * BRAND CONTROLLER — Điều hướng và phản hồi API Thương hiệu
 * ========================================================================
 */

/**
 * 1. LẤY TẤT CẢ THƯƠNG HIỆU
 * Route: GET /api/brands
 */
export const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await brandService.getAllBrands();

    return res.status(200).json({
      success: true,
      total: brands.length,
      data: brands,
    });
  } catch (error) {
    console.error("Lỗi getBrands:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải danh sách thương hiệu",
    });
  }
};

/**
 * 2. LẤY CHI TIẾT THƯƠNG HIỆU THEO SLUG
 * Route: GET /api/brands/:slug
 */
export const getBrandBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const brand = await brandService.getBrandBySlug(String(slug));

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thương hiệu: ${slug}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error("Lỗi getBrandBySlug:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải thông tin thương hiệu",
    });
  }
};
