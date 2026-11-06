"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { showToast } from "@/components/ui/toast-box";

export function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hiện ra khi lướt xuống quá 220px
      if (window.scrollY > 220) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Kiểm tra ngay khi mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenMap = () => {
    const footer = document.querySelector("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    showToast(
      "Hệ thống Showroom Flagship",
      "TP.HCM: 88 Nguyễn Huệ • Hà Nội: 45 Tràng Tiền • Hotline: 1800 8888 99"
    );
  };

  const handleOpenMessenger = () => {
    showToast("Messenger Chăm sóc Khách hàng", "Đang kết nối chuyên viên tư vấn qua Facebook Messenger...");
  };

  const handleOpenZalo = () => {
    showToast("Zalo Official Account", "Đang kết nối chuyên viên tư vấn qua Zalo OA...");
  };

  return (
    <aside
      aria-label="Tiện ích liên hệ và cuộn trang"
      className={`fixed bottom-6 right-4 sm:right-6 z-[180] flex flex-col gap-3 items-center select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-x-12 scale-75 pointer-events-none"
      }`}
    >
      {/* 1. Messenger Button */}
      <button
        onClick={handleOpenMessenger}
        title="Chat qua Facebook Messenger"
        aria-label="Chat qua Facebook Messenger"
        className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all duration-700 delay-[50ms] ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <Image
          src="/images/icons/messager.svg"
          alt="Messenger"
          width={48}
          height={48}
          className="w-full h-full object-cover pointer-events-none"
          priority
          unoptimized
        />
      </button>

      {/* 2. Zalo Button */}
      <button
        onClick={handleOpenZalo}
        title="Chat qua Zalo"
        aria-label="Chat qua Zalo"
        className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all duration-700 delay-[100ms] ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <Image
          src="/images/icons/zalo.svg"
          alt="Zalo"
          width={48}
          height={48}
          className="w-full h-full object-cover pointer-events-none"
          priority
          unoptimized
        />
      </button>

      {/* 3. Showroom Map Button */}
      <button
        onClick={handleOpenMap}
        title="Hệ thống Showroom Flagship"
        aria-label="Hệ thống Showroom Flagship"
        className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-black/40 hover:scale-110 active:scale-95 transition-all duration-700 delay-[150ms] ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <Image
          src="/images/icons/Default.svg"
          alt="Showroom Flagship"
          width={48}
          height={48}
          className="w-full h-full object-cover pointer-events-none"
          priority
          unoptimized
        />
      </button>

      {/* 4. Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        title="Cuộn lên đầu trang"
        aria-label="Cuộn lên đầu trang"
        className={`w-12 h-12 rounded-full bg-black text-white border border-white/20 flex items-center justify-center shadow-lg shadow-black/40 hover:border-brandCyan/70 hover:scale-110 active:scale-95 transition-all duration-700 delay-[200ms] ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <ArrowUp className="w-5 h-5 text-white stroke-[2.4]" />
      </button>
    </aside>
  );
}

