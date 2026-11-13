import { Request, Response } from "express";
import prisma from "../config/prisma.js";

/**
 * Route: GET /api/banners (Dùng Prisma ORM)
 */
export const getBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return res.status(200).json({
      success: true,
      total: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error("Lỗi getBanners:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải danh sách banner",
    });
  }
};
