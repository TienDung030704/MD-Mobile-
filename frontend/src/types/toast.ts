/**
 * Phân loại thông báo Toast
 */
export type ToastType = "success" | "error" | "info" | "warning";

/**
 * Interface cấu trúc dữ liệu cho thông báo Toast
 */
export interface ToastNotification {
  message: string;
  type?: ToastType;
  duration?: number;
}

