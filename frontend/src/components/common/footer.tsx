"use client";

import React, { useState } from "react";
import { showToast } from "@/components/ui/toast-box";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      showToast(
        "Đăng ký VIP thành công!",
        `Voucher 1.000.000₫ đã được gửi đến ${email}`
      );
      setEmail("");
    }, 600);
  };

  return (
    <footer className="pt-20 pb-8 border-t border-black/10 dark:border-white/10 bg-surfaceDark/80 text-textPrimary relative overflow-hidden">
      <div className="max-w-container mx-auto px-4 relative z-10">
        {/* Top Newsletter Card */}
        <div className="glass-card rounded-[28px] p-8 md:p-10 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 border border-black/10 dark:border-white/15">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-brandCyan">
              AETHERIA PRIVATE CLUB
            </span>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl mt-1 text-textPrimary">
              Nhận Đặc Quyền Đặt Trước & Voucher 1.000.000₫
            </h3>
            <p className="text-sm text-textSecondary mt-1">
              Cập nhật sớm nhất các đợt mở bán giới hạn và sự kiện trải nghiệm Flagship VIP tại TP.HCM & Hà Nội.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email cá nhân của bạn..."
              className="w-full sm:w-80 h-13 px-5 py-3.5 rounded-full glass-card text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-brandCyan"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-13 px-7 py-3.5 rounded-full bg-aurora text-white font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-400 ease-expo shrink-0 hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : isSubscribed
                ? "✓ Đã nhận voucher"
                : "Đăng Ký VIP"}
            </button>
          </form>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-14 border-b border-black/10 dark:border-white/10 text-sm">
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="font-display font-extrabold text-xl tracking-[0.16em] text-textPrimary">
              MD Mobile
            </div>
            <p className="text-textSecondary text-xs leading-relaxed max-w-xs">
              Hệ thống Flagship Experience Store chuẩn quốc tế. Tiên phong phân phối các siêu phẩm di động AI, phụ kiện cao cấp và dịch vụ hậu mãi thượng lưu.
            </p>
            <div className="text-xs font-mono text-brandCyan">
              Hotline VIP 24/7: 1800 8888 99 (Miễn cước)
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2.5">
            <div className="font-mono text-xs uppercase tracking-wider text-textSecondary mb-3">
              Dòng Sản Phẩm
            </div>
            <ul className="space-y-2 text-xs text-textSecondary">
              <li>
                <a href="#featured-section" className="hover:text-textPrimary transition">
                  Aether X1 Ultra 5G
                </a>
              </li>
              <li>
                <a href="#featured-section" className="hover:text-textPrimary transition">
                  iPhone 16 Pro Max VN/A
                </a>
              </li>
              <li>
                <a href="#featured-section" className="hover:text-textPrimary transition">
                  Galaxy S25 Ultra AI
                </a>
              </li>
              <li>
                <a href="#featured-section" className="hover:text-textPrimary transition">
                  Xiaomi 15 Ultra Leica
                </a>
              </li>
              <li>
                <a href="#featured-section" className="hover:text-textPrimary transition">
                  OPPO Find X8 Pro
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 space-y-2.5">
            <div className="font-mono text-xs uppercase tracking-wider text-textSecondary mb-3">
              Đặc Quyền Dịch Vụ
            </div>
            <ul className="space-y-2 text-xs text-textSecondary">
              <li>
                <a href="#trade-in-section" className="hover:text-textPrimary transition">
                  Thu Cũ Đổi Mới Trợ Giá 5Tr
                </a>
              </li>
              <li>
                <a href="#vip-bento-section" className="hover:text-textPrimary transition">
                  Gói Bảo Hành Vàng 24 Tháng
                </a>
              </li>
              <li>
                <a href="#vip-bento-section" className="hover:text-textPrimary transition">
                  Giao Hỏa Tốc 2 Giờ Tận Nơi
                </a>
              </li>
              <li>
                <a href="#trade-in-section" className="hover:text-textPrimary transition">
                  Trả Góp 0% Duyệt 60 Giây
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3 space-y-2.5">
            <div className="font-mono text-xs uppercase tracking-wider text-textSecondary mb-3">
              Flagship Lounges
            </div>
            <p className="text-xs text-textSecondary">
              • Quận 1: 88 Nguyễn Huệ, TP. Hồ Chí Minh
            </p>
            <p className="text-xs text-textSecondary">
              • Hoàn Kiếm: 45 Tràng Tiền, Thủ đô Hà Nội
            </p>
            <p className="text-xs text-textSecondary">
              • Hải Châu: 12 Bạch Đằng, TP. Đà Nẵng
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-brandMint">
              <span className="w-2 h-2 rounded-full bg-brandMint animate-ping"></span>{" "}
              Mở cửa 08:30 — 22:30 mỗi ngày
            </div>
          </div>
        </div>

        {/* Giant Outline Brand Name with Flowing Gradient */}
        <div className="py-6 text-center overflow-hidden">
          <div className="giant-outline-text">MD Mobile</div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-textSecondary pt-4 border-t border-white/5 gap-3">
          <span>
            © 2026 MD Mobile STUDIO VIETNAM. Bảo lưu mọi quyền sở hữu trí tuệ.
          </span>
          <div className="flex items-center gap-5 font-mono text-[11px]">
            <span>WCAG AA COMPLIANT</span>
            <span>•</span>
            <span>APPLE PAY / VISA / VNPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
