"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface UseThemeToggleReturn {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
}

/**
 * Đăng ký theo dõi sự thay đổi class trên thẻ <html> hoặc sự kiện storage
 */
function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("storage", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

/**
 * Lấy snapshot trạng thái giao diện hiện tại ở Client
 */
function getThemeSnapshot(): boolean {
  if (typeof document === "undefined") return true;
  return !document.documentElement.classList.contains("light");
}

/**
 * Lấy snapshot trạng thái giao diện ở Server (mặc định Dark mode theo cấu hình RootLayout)
 */
function getServerThemeSnapshot(): boolean {
  return true;
}

/**
 * Custom hook quản lý logic chuyển đổi chế độ Sáng / Tối (Dark / Light Mode)
 * Đồng bộ an toàn chuẩn React 19 & Next.js 16 SSR
 */
export function useThemeToggle(): UseThemeToggleReturn {
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const toggleTheme = useCallback(() => {
    if (typeof document === "undefined") return;
    const isCurrentlyDark = !document.documentElement.classList.contains("light");
    const nextDark = !isCurrentlyDark;

    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      try {
        localStorage.setItem("md-theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      try {
        localStorage.setItem("md-theme", "light");
      } catch {}
    }
  }, []);

  const setTheme = useCallback((theme: "dark" | "light") => {
    if (typeof document === "undefined") return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      try {
        localStorage.setItem("md-theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      try {
        localStorage.setItem("md-theme", "light");
      } catch {}
    }
  }, []);

  return {
    isDark,
    toggleTheme,
    setTheme,
  };
}

