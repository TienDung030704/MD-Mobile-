"use client";

import { useState, useCallback, useRef } from "react";
import { ToastNotification, ToastType } from "@/types/toast";

export * from "@/types/toast";

/**
 * Custom hook quản lý thông báo Toast
 * Tự động hủy timer hẹn giờ an toàn, tránh memory leak khi unmount
 */
export function useToast() {
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration = 3000) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToast({ message, type, duration });
      timerRef.current = setTimeout(() => {
        setToast(null);
      }, duration);
    },
    []
  );

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}

