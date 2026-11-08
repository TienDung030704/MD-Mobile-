"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * 1. Đăng ký theo dõi sự thay đổi class trên thẻ <html>
 */
function subscribe(callback: () => void) {
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}

/**
 * 2. Đọc trạng thái hiện tại ở trình duyệt:
 * - Nếu thẻ <html> có class "light" -> chế độ Sáng (isDark = false)
 * - Ngược lại -> chế độ Tối (isDark = true)
 */
function getSnapshot(): boolean {
  if (typeof document === "undefined") return true;
  return !document.documentElement.classList.contains("light");
}

/**
 * 3. Trạng thái mặc định trên Server (mặc định là Dark mode)
 */
function getServerSnapshot(): boolean {
  return true;
}

/**
 * Hook quản lý chuyển đổi chế độ Sáng / Tối (Dark / Light Mode)
 * Logic ngắn gọn, rõ ràng, chuẩn React 19:
 * - Tự động đồng bộ với thẻ <html>
 * - Tự động lưu và khôi phục từ localStorage
 */
export function useThemeToggle() {
  // Lấy trạng thái Dark/Light tự động từ thẻ <html>
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Khi vừa vào web: đọc cài đặt đã lưu trong localStorage và gắn vào thẻ <html>
  useEffect(() => {
    const savedTheme = localStorage.getItem("md_theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  // Hàm bấm nút để chuyển đổi qua lại giữa Sáng và Tối
  const toggleTheme = (onToggle?: (isDark: boolean) => void) => {
    const nextDarkState = !isDark;

    if (nextDarkState) {
      // Chuyển sang chế độ Tối
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("md_theme", "dark");
    } else {
      // Chuyển sang chế độ Sáng
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("md_theme", "light");
    }

    // Nếu có truyền hàm callback (ví dụ để hiện thông báo Toast)
    if (onToggle) {
      onToggle(nextDarkState);
    }
  };

  return {
    isDark,
    isLight: !isDark,
    toggleTheme,
  };
}
