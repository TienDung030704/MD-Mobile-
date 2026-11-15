import { Request, Response, NextFunction } from "express";

/**
 * ========================================================================
 * ERROR MIDDLEWARE — Bắt và xử lý lỗi tập trung cho toàn bộ Backend
 * ========================================================================
 * Trong Express, một hàm có đúng 4 tham số (err, req, res, next)
 * sẽ tự động được coi là Error Handler Middleware.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // In chi tiết lỗi ra màn hình terminal của Backend để dễ sửa lỗi
  console.error("❌ [Lỗi Hệ Thống]:", err);

  // Lấy mã lỗi HTTP (mặc định là 500 - Lỗi máy chủ nếu không chỉ định)
  const statusCode = err.statusCode || err.status || 500;

  // Nội dung thông báo lỗi
  const message = err.message || "Đã xảy ra lỗi máy chủ nội bộ";

  return res.status(statusCode).json({
    success: false,
    message,
    // Chỉ hiển thị chi tiết stack trace khi đang lập trình (development)
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

