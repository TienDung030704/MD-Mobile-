"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePasswordToggle } from "@/utils/password-toggle";
import { useThemeToggle } from "@/utils/theme-toggle";
import { useToast } from "@/utils/toast";
import {
  loginSchema,
  LoginFormData,
  forgotPasswordFormSchema,
  ForgotPasswordFormData,
  isPhoneValid,
} from "@/utils/auth-validation";

export default function LoginPage() {
  // 1. Chế độ Sáng / Tối
  const { isDark, toggleTheme } = useThemeToggle();

  // 2. Ẩn / hiện mật khẩu (bật tắt icon thông thường)
  const { showPassword, togglePassword } = usePasswordToggle();

  // 3. Quản lý trạng thái focus của các ô input (để tạo hiệu ứng nhãn nổi & viền sáng)
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  // 4. Trạng thái nút Đăng nhập: bình thường / đang xử lý
  const [isLoading, setIsLoading] = useState(false);

  // 5. Trạng thái Modal Quên mật khẩu
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // 6. Thông báo Toast (Sử dụng interface và hook tách riêng từ @/utils/toast)
  const { toast, showToast } = useToast();

  // =========================================================================
  // REACT HOOK FORM: FORM ĐĂNG NHẬP
  // =========================================================================
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const phoneValue = useWatch({ control, name: "phone" }) || "";
  const passwordValue = useWatch({ control, name: "password" }) || "";

  const { ref: phoneRef, ...phoneField } = register("phone");
  const { ref: passRef, ...passField } = register("password");

  // Kiểm tra SĐT hợp lệ để hiện dấu tick xanh
  const isPhoneValidFormat = isPhoneValid(phoneValue);

  // Xử lý khi submit đăng nhập thành công
  const onLoginSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Đăng nhập MD-MEMBER thành công! Đang chuyển hướng...");
    }, 1000);
  };

  // =========================================================================
  // REACT HOOK FORM: MODAL QUÊN MẬT KHẨU
  // =========================================================================
  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    reset: resetForgotForm,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: "onBlur",
    defaultValues: {
      forgotPhone: "",
    },
  });

  const onForgotSubmit = () => {
    setForgotSent(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotSent(false);
      resetForgotForm();
      showToast("Mã xác thực OTP đã được gửi tới số điện thoại của bạn!");
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 relative overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-[#07070F] text-[#F8FAFC]" : "bg-[#F7F7FB] text-[#090915]"
      }`}
    >
      {/* Vầng sáng nền Aurora mờ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
          style={{
            background: "radial-gradient(circle, #7C3AED 0%, #2563EB 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
          style={{
            background: "radial-gradient(circle, #22D3EE 0%, #EC4899 70%, transparent 100%)",
          }}
        />
      </div>

      {/* Thanh điều hướng trên cùng */}
      <header className="relative z-20 max-w-[1240px] w-full mx-auto flex items-center justify-end pb-4 select-none">
        {/* Nút chuyển đổi Sáng / Tối */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Chuyển chế độ Sáng hoặc Tối"
          className={`h-9 px-3.5 rounded-full border flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
            isDark
              ? "bg-white/5 border-white/15 text-[#22D3EE] hover:bg-white/10"
              : "bg-white border-gray-300 text-amber-600 hover:bg-gray-50 shadow-sm"
          }`}
        >
          {isDark ? (
            <>
              <svg className="w-4 h-4 fill-[#22D3EE]/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Chế độ Tối</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-amber-500 fill-amber-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <span>Chế độ Sáng</span>
            </>
          )}
        </button>
      </header>

      {/* Nội dung chính: 2 khối độc lập */}
      <main className="relative z-10 max-w-[1240px] w-full mx-auto my-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* ===============================================================
            KHỐI TRÁI: BANNER THÀNH VIÊN (HIỂN THỊ FULL 100% KHÔNG CẮT)
            =============================================================== */}
        <section
          aria-label="Banner thành viên MD-Member"
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
  
          <div
            className={`w-full max-w-[560px] rounded-3xl p-4 sm:p-6 backdrop-blur-xl transition-all shadow-xl flex items-center justify-center ${
              isDark
                ? "bg-[#0E1022]/90 border border-white/10"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="relative w-full aspect-[1100/1300] flex items-center justify-center overflow-hidden rounded-2xl">
              <Image
                src="/images/banners/md-member-mascot-isolated-Photoroom.png"
                alt="Banner MD-MEMBER"
                width={1100}  
                height={1300}
                priority
                unoptimized
                className="w-full h-full object-contain select-none"
              />
            </div>
          </div>
        </section>

        {/* ===============================================================
            KHỐI PHẢI: FORM ĐĂNG NHẬP (CHỈ CÓ SĐT & MẬT KHẨU)
            =============================================================== */}
        <section
          aria-label="Biểu mẫu đăng nhập"
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <div
            className={`w-full max-w-[460px] rounded-3xl p-7 sm:p-10 backdrop-blur-2xl transition-all shadow-xl ${
              isDark
                ? "bg-[#0F1020]/95 border border-white/15"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Tiêu đề */}
            <div className="text-center mb-6">
              <h1 className="font-extrabold text-2xl sm:text-[28px] tracking-tight bg-gradient-to-r from-[#FF5A5F] via-[#F59E0B] to-[#EC4899] bg-clip-text text-transparent">
                Đăng nhập MD-MEMBER
              </h1>
              <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#FF5A5F] hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Thông báo lỗi tổng (nếu có) */}
            {(errors.phone || errors.password) && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-500 animate-fadeIn">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
                </svg>
                <span>{errors.phone?.message || errors.password?.message}</span>
              </div>
            )}

            {/* Form đăng nhập */}
            <form onSubmit={handleSubmit(onLoginSubmit)} noValidate className="space-y-4">
              {/* Ô nhập Số điện thoại */}
              <div className="relative">
                <div
                  className={`relative h-[56px] rounded-2xl transition-all flex items-center ${
                    phoneFocused
                      ? "ring-2 ring-[#22D3EE] shadow-[0_0_20px_rgba(124,58,237,0.25)] " +
                        (isDark ? "bg-white/[0.08]" : "bg-white")
                      : phoneValue.trim()
                      ? isDark
                        ? "bg-white/[0.05] border border-white/20"
                        : "bg-white border border-gray-300"
                      : isDark
                      ? "bg-white/[0.04] border border-white/10 hover:border-white/20"
                      : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                  } ${errors.phone ? "!ring-2 !ring-red-500 !border-transparent" : ""}`}
                >
                  {/* Icon Điện thoại bên trái */}
                  <span className={`pl-4 pr-2 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </span>

                  {/* Input SĐT */}
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    {...phoneField}
                    ref={phoneRef}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={(e) => {
                      setPhoneFocused(false);
                      phoneField.onBlur(e);
                    }}
                    className={`w-full h-full pt-4 pb-1 pr-11 bg-transparent text-sm font-medium outline-none ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  />

                  {/* Nhãn nổi (Floating Label) */}
                  <label
                    htmlFor="phone"
                    className={`absolute left-11 transition-all duration-200 pointer-events-none select-none ${
                      phoneFocused || phoneValue.trim().length > 0
                        ? "top-1.5 text-[10px] font-bold text-[#22D3EE]"
                        : "top-1/2 -translate-y-1/2 text-xs sm:text-sm " +
                          (isDark ? "text-gray-400" : "text-gray-400")
                    }`}
                  >
                    Số điện thoại
                  </label>

                  {/* Dấu tích xanh khi SĐT đúng 10 số */}
                  {isPhoneValidFormat && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#34D399]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>

              {/* Ô nhập Mật khẩu */}
              <div className="relative">
                <div
                  className={`relative h-[56px] rounded-2xl transition-all flex items-center ${
                    passFocused
                      ? "ring-2 ring-[#22D3EE] shadow-[0_0_20px_rgba(124,58,237,0.25)] " +
                        (isDark ? "bg-white/[0.08]" : "bg-white")
                      : passwordValue.trim()
                      ? isDark
                        ? "bg-white/[0.05] border border-white/20"
                        : "bg-white border border-gray-300"
                      : isDark
                      ? "bg-white/[0.04] border border-white/10 hover:border-white/20"
                      : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                  } ${errors.password ? "!ring-2 !ring-red-500 !border-transparent" : ""}`}
                >
                  {/* Icon Khóa bên trái */}
                  <span className={`pl-4 pr-2 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>

                  {/* Input Mật khẩu */}
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...passField}
                    ref={passRef}
                    onFocus={() => setPassFocused(true)}
                    onBlur={(e) => {
                      setPassFocused(false);
                      passField.onBlur(e);
                    }}
                    className={`w-full h-full pt-4 pb-1 pr-11 bg-transparent text-sm font-medium outline-none ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  />

                  {/* Nhãn nổi (Floating Label) */}
                  <label
                    htmlFor="password"
                    className={`absolute left-11 transition-all duration-200 pointer-events-none select-none ${
                      passFocused || passwordValue.trim().length > 0
                        ? "top-1.5 text-[10px] font-bold text-[#22D3EE]"
                        : "top-1/2 -translate-y-1/2 text-xs sm:text-sm " +
                          (isDark ? "text-gray-400" : "text-gray-400")
                    }`}
                  >
                    Mật khẩu
                  </label>

                  {/* Nút bật/tắt mật khẩu: Icon gạch chéo thông thường, không lật */}
                  <button
                    type="button"
                    onClick={togglePassword}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      isDark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-800"
                    }`}
                  >
                    {showPassword ? (
                      /* Icon con mắt bị gạch chéo */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      /* Icon con mắt mở bình thường */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Nút Đăng nhập: Giữ nguyên màu Sunset, KHÔNG đưa qua đưa lại khi hover */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: "linear-gradient(135deg, #FF5A5F 0%, #F59E0B 50%, #EC4899 100%)",
                    boxShadow: "0 10px 25px -5px rgba(255, 90, 95, 0.4)",
                  }}
                  className="w-full h-[56px] rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-95 active:scale-[0.99] disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </button>
              </div>

              {/* Quên mật khẩu? (Căn giữa dưới nút Đăng nhập) */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs sm:text-sm text-blue-500 hover:text-blue-400 hover:underline font-medium transition cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Đường kẻ phân cách */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? "border-white/10" : "border-gray-200"}`} />
                </div>
                <div
                  className={`relative px-3 text-xs font-medium select-none ${
                    isDark ? "bg-[#0F1020] text-gray-400" : "bg-white text-gray-400"
                  }`}
                >
                  Hoặc đăng nhập bằng
                </div>
              </div>

              {/* 2 nút đăng nhập mạng xã hội: Google & Zalo */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => showToast("Đang kết nối xác thực Google...", "info")}
                  className={`h-11 rounded-2xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-800 shadow-sm"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z" />
                    <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z" />
                    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast("Đang kết nối xác thực Zalo OA...", "info")}
                  className={`h-11 rounded-2xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-800 shadow-sm"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#0068FF] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                    Z
                  </span>
                  <span>Zalo</span>
                </button>
              </div>

              {/* Đăng ký ngay */}
              <div className={`text-center text-xs sm:text-sm pt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#FF5A5F] hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </form>

            {/* Footer ghi chú */}
            <div
              className={`mt-6 pt-4 border-t text-center text-xs space-y-1 ${
                isDark ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-400"
              }`}
            >
              <div>Mua sắm, sửa chữa tại</div>
              <div className="font-semibold">
                <span className="text-[#22D3EE] hover:underline cursor-pointer">mdmobile.com.vn</span>{" "}
                và{" "}
                <span className="text-[#FF5A5F] hover:underline cursor-pointer">mdcare.com.vn</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer nhỏ bản quyền */}
      <footer className={`relative z-10 text-center text-xs py-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        © 2026 MD Mobile Việt Nam. Bản quyền thuộc về MD Group.
      </footer>

      {/* ===============================================================
          MODAL: KHÔI PHỤC MẬT KHẨU (CHỈ DÙNG SĐT)
          =============================================================== */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative border ${
              isDark
                ? "bg-[#0F1020] border-white/20 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setIsForgotModalOpen(false);
                resetForgotForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold bg-gradient-to-r from-[#FF5A5F] to-[#EC4899] bg-clip-text text-transparent mb-2">
              Khôi phục mật khẩu
            </h2>
            <p className={`text-xs sm:text-sm mb-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Nhập số điện thoại đã đăng ký để nhận mã xác thực OTP khôi phục tài khoản.
            </p>

            <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại của bạn"
                  {...registerForgot("forgotPhone")}
                  className={`w-full h-12 px-4 rounded-xl text-sm outline-none border focus:ring-2 focus:ring-[#22D3EE] ${
                    isDark
                      ? "bg-white/5 border-white/15 text-white placeholder:text-gray-500"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  } ${forgotErrors.forgotPhone ? "!border-red-500 !ring-red-500" : ""}`}
                />
                {forgotErrors.forgotPhone && (
                  <p className="text-xs text-red-500 mt-1.5 pl-1 font-medium">
                    {forgotErrors.forgotPhone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={forgotSent}
                style={{
                  background: "linear-gradient(135deg, #FF5A5F 0%, #F59E0B 50%, #EC4899 100%)",
                }}
                className="w-full h-12 text-white font-bold rounded-xl text-sm transition hover:opacity-90 active:scale-[0.99] cursor-pointer"
              >
                {forgotSent ? "Đang gửi mã xác thực..." : "Gửi mã OTP xác thực →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-bounce transition-all ${
            toast.type === "error"
              ? "bg-[#1E1120]/95 border-[#F43F5E]/60 text-[#F43F5E]"
              : toast.type === "info"
              ? "bg-[#0E1524]/95 border-[#22D3EE]/60 text-[#22D3EE]"
              : "bg-[#0E1E22]/95 border-[#34D399]/60 text-[#34D399]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              toast.type === "error"
                ? "bg-[#F43F5E]"
                : toast.type === "info"
                ? "bg-[#22D3EE]"
                : "bg-[#34D399]"
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Keyframe Animation đơn giản */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 200ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}
