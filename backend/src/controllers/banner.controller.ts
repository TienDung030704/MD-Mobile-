import { Request, Response } from "express";
import pool from "../config/db.js";
import { BannerRow } from "../types/index.js";

/**
 * ========================================================================
 * BANNER CONTROLLER — Quản lý Banner Slider trang chủ
 * ========================================================================
 */

/**
 * LẤY DANH SÁCH BANNER ĐANG HOẠT ĐỘNG
 * Route: GET /api/banners
 */
export const getBanners = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<BannerRow[]>(`
      SELECT * 
      FROM banners 
      WHERE is_active = 1 
      ORDER BY sort_order ASC
    `);

    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Lỗi getBanners:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải danh sách banner",
    });
  }
};
