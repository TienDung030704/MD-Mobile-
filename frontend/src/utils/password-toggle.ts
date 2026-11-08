"use client";

import { useState } from "react";

/**
 * Hook đơn giản quản lý trạng thái ẩn / hiện mật khẩu
 */
export function usePasswordToggle(initialState = false) {
  const [showPassword, setShowPassword] = useState<boolean>(initialState);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    showPassword,
    togglePassword,
  };
}
