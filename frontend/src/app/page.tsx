"use client";

/**
 * ========================================================================
 * MD MOBILE FLAGSHIP STORE — TRANG CHỦ TỔNG HỢP (HOME PAGE)
 * Toàn bộ các khối tính năng nội dung (Body) được tích hợp trong 1 file.
 * Header và Footer được tách riêng dùng chung trong src/components/common/
 * ========================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronRight, Sparkles } from "lucide-react";
import { Header, Footer, LoadingScreen } from "@/components/common";
import { showToast } from "@/components/ui/toast-box";
import type {
  HeroBannerItem,
  FlashSaleProduct,
  FeaturedProduct,
  StoryChapter,
  CustomerReview,
} from "@/types";

// Swiper CSS styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

/* ========================================================================
 * 1. ANNOUNCEMENT BAR — Thanh thông báo chạy chữ vô hạn trên cùng
 * ======================================================================== */

function AnnouncementBar() {
  return (
    <div className="w-full bg-sunset text-white text-xs font-semibold tracking-wider uppercase py-2 overflow-hidden relative z-[90] marquee-container select-none">
      <div className="marquee-track flex items-center gap-12">
        <div className="flex items-center gap-12 shrink-0">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            Miễn phí giao hàng hỏa tốc toàn quốc
          </span>
          <span className="opacity-60">|</span>
          <span>Trả góp 0% lãi suất — Duyệt hồ sơ AI trong 60 giây</span>
          <span className="opacity-60">|</span>
          <span>Tặng gói Bảo Hành Vàng 24 tháng (Rơi vỡ &amp; Vào nước)</span>
          <span className="opacity-60">|</span>
          <span>Thu cũ đổi mới trợ giá lên đời đến 5.000.000đ</span>
          <span className="opacity-60">|</span>
        </div>
        <div className="flex items-center gap-12 shrink-0">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            Miễn phí giao hàng hỏa tốc toàn quốc
          </span>
          <span className="opacity-60">|</span>
          <span>Trả góp 0% lãi suất — Duyệt hồ sơ AI trong 60 giây</span>
          <span className="opacity-60">|</span>
          <span>Tặng gói Bảo Hành Vàng 24 tháng (Rơi vỡ &amp; Vào nước)</span>
          <span className="opacity-60">|</span>
          <span>Thu cũ đổi mới trợ giá lên đời đến 5.000.000đ</span>
          <span className="opacity-60">|</span>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
 * 2. HERO SLIDER — Banner Swiper chính với hiệu ứng Fade & CTA
 * ======================================================================== */

interface HeroSliderProps {
  banners?: HeroBannerItem[];
}

function HeroSlider({ banners = [] }: HeroSliderProps) {
  if (!banners || banners.length === 0) {
    return (
      <section
        id="hero-section"
        className="relative w-full pt-28 md:pt-36 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden select-none"
      >
        <div className="w-full h-[320px] sm:h-[420px] rounded-3xl border border-white/10 glass-card flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-full bg-brandViolet/20 border border-brandViolet/40 flex items-center justify-center text-brandCyan mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">MD Mobile Flagship Store</h2>
          <p className="text-sm text-textSecondary max-w-md">
            Hệ thống đang cập nhật các chương trình ưu đãi Flagship mới nhất từ cơ sở dữ liệu.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero-section"
      className="relative w-full pt-28 md:pt-36 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden select-none"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brandViolet/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={900}
          loop={banners.length > 1}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          navigation={true}
          className="w-full h-[380px] sm:h-[460px] md:h-[520px] lg:h-[560px]"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} className="relative w-full h-full bg-[#0a0a14]">
              <div className="relative w-full h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={banner.id === 1}
                  className="object-cover object-center transform transition-transform duration-1000 scale-100 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#07070F] via-[#07070F]/50 to-transparent md:bg-gradient-to-r md:from-[#07070F]/90 md:via-[#07070F]/60 md:to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${banner.accentColor} mix-blend-screen pointer-events-none`} />

                <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl z-10">
                  <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-brandCyan mb-3 md:mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-brandGold animate-pulse" />
                    <span>{banner.badge}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-2 md:mb-4 drop-shadow-md">
                    {banner.title}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed mb-5 md:mb-8 line-clamp-2 sm:line-clamp-none max-w-xl">
                    {banner.subtitle}
                  </p>

                  <div className="flex items-center gap-4">
                    <Link
                      href={banner.link}
                      className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-brandViolet via-brandBlue to-brandCyan hover:opacity-95 shadow-lg shadow-brandViolet/25 hover:shadow-brandCyan/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <span>{banner.ctaText}</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

/* ========================================================================
 * 3. BRAND MARQUEE — Dải logo thương hiệu đối tác cuộn vô hạn
 * ======================================================================== */

function BrandMarquee() {
  const brands = [
    { name: "APPLE AUTHORIZED", color: "#22D3EE", border: "hover:border-brandViolet" },
    { name: "SAMSUNG GALAXY", color: "#2563EB", border: "hover:border-brandBlue" },
    { name: "XIAOMI LEICA", color: "#FF5A5F", border: "hover:border-brandCoral" },
    { name: "OPPO FIND SERIES", color: "#34D399", border: "hover:border-brandMint" },
    { name: "VIVO ZEISS", color: "#22D3EE", border: "hover:border-brandCyan" },
    { name: "REALME GT PRO", color: "#F5C451", border: "hover:border-brandGold" },
    { name: "ASUS ROG PHONE", color: "#EC4899", border: "hover:border-brandPink" },
  ];

  return (
    <section
      id="brand-marquee-section"
      className="py-10 border-y border-white/10 bg-surfaceDark/40 marquee-container overflow-hidden relative select-none"
    >
      <div className="max-w-container mx-auto px-4 mb-4 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-textSecondary">
          Đối tác Flagship ủy quyền chính thức tại Việt Nam
        </span>
        <span className="text-xs font-mono text-brandMint flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brandMint animate-ping"></span>
          100% Seal Chính Hãng VN/A
        </span>
      </div>

      <div className="marquee-track flex items-center gap-8">
        <div className="flex items-center gap-8 shrink-0">
          {brands.map((b, idx) => (
            <div
              key={`b1-${idx}`}
              className={`brand-pill group glass-card px-8 py-3.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 ${b.border}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              <span className="font-display font-bold text-base tracking-wider text-textSecondary group-hover:text-white transition-colors">
                {b.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-8 shrink-0">
          {brands.map((b, idx) => (
            <div
              key={`b2-${idx}`}
              className={`brand-pill group glass-card px-8 py-3.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 ${b.border}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              <span className="font-display font-bold text-base tracking-wider text-textSecondary group-hover:text-white transition-colors">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
 * 4. BENTO SECTION — Lưới 6 ô đặc quyền với hiệu ứng Spotlight 3D
 * ======================================================================== */

function BentoSection() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="vip-bento-section" className="py-24 max-w-container mx-auto px-4 select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-brandCyan mb-3">
            <span>ĐẶC QUYỀN THƯỢNG LƯU // AETHER CARE+</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-white">
            Vì Sao <span className="text-aurora">Hơn 250.000+</span> Tín Đồ Chọn MD Mobile?
          </h2>
        </div>
        <p className="text-textSecondary max-w-md text-sm">
          Di chuột lên từng ô để cảm nhận hiệu ứng ánh sáng Spotlight 3D. Mọi chiếc máy bán ra đều kèm chứng nhận nguồn gốc số hóa.
        </p>
      </div>

      <div id="bento-grid" className="grid grid-cols-12 gap-6">
        {/* Cell 1: 100% Chính Hãng */}
        <div
          onMouseMove={handleMouseMove}
          className="bento-card col-span-12 lg:col-span-5 glass-card rounded-[24px] p-8 flex flex-col justify-between min-h-[290px] border border-white/10"
        >
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brandViolet/20 text-brandCyan border border-brandViolet/40">
              CHỨNG NHẬN ỦY QUYỀN
            </span>
            <svg className="w-7 h-7 text-brandCyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="relative z-10 my-4">
            <div className="font-price font-bold text-6xl md:text-7xl text-aurora tracking-tight">
              100%
            </div>
            <h3 className="font-display font-extrabold text-2xl mt-2 text-white">
              Chính Hãng Nguyên Seal
            </h3>
            <p className="text-textSecondary text-sm mt-1">
              Đền gấp 200% giá trị nếu phát hiện hàng dựng hoặc đã kích hoạt trước.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-4 pt-3 border-t border-white/10 text-xs font-mono text-textSecondary">
            <span>IMEI Blockchain Verified</span>
            <span>•</span>
            <span className="text-brandMint">VAT đầy đủ 100%</span>
          </div>
        </div>

        {/* Cell 2: Giao Siêu Tốc 2 Giờ */}
        <div
          onMouseMove={handleMouseMove}
          className="bento-card col-span-12 lg:col-span-7 glass-card rounded-[24px] p-8 flex flex-col justify-between min-h-[290px] relative overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 opacity-35 pointer-events-none flex items-center justify-end pr-4">
            <svg className="w-[420px] h-[260px]" viewBox="0 0 420 260" fill="none">
              <path
                d="M20 40H400M20 100H400M20 160H400M20 220H400M80 10V250M160 10V250M240 10V250M320 10V250"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <path
                d="M50 200 C110 200, 120 90, 200 110 C270 125, 290 55, 365 65"
                stroke="url(#mapRouteGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
              <circle cx="50" cy="200" r="7" fill="#7C3AED" />
              <circle cx="50" cy="200" r="14" stroke="#7C3AED" strokeWidth="1.5" opacity="0.5" />
              <circle cx="200" cy="110" r="6" fill="#22D3EE" />
              <circle cx="365" cy="65" r="8" fill="#34D399" />
              <defs>
                <linearGradient id="mapRouteGrad" x1="50" y1="200" x2="365" y2="65" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="0.5" stopColor="#22D3EE" />
                  <stop offset="1" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brandMint/15 text-brandMint border border-brandMint/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brandMint animate-ping" />
              LIVE GPS TRACKING
            </span>
            <span className="font-mono text-xs text-textSecondary">
              TP.HCM • HÀ NỘI • ĐÀ NẴNG
            </span>
          </div>

          <div className="relative z-10 max-w-md my-auto">
            <div className="font-price font-bold text-4xl md:text-5xl text-white">
              Giao Siêu Tốc <span className="text-brandCyan">2 Giờ</span>
            </div>
            <h3 className="font-display font-bold text-xl mt-2 text-white">
              Chuyên Viên Kỹ Thuật Giao Tận Tay
            </h3>
            <p className="text-textSecondary text-sm mt-1">
              Hỗ trợ sao chép dữ liệu, dán kính Sapphire và cài đặt bảo mật ngay tại nhà hoặc văn phòng của bạn.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-xs font-mono">
            <span className="text-brandCyan">● Thời gian trung bình: 74 phút</span>
            <span className="text-textSecondary">Miễn phí bảo hiểm vận chuyển 100%</span>
          </div>
        </div>

        {/* Cell 3: Đổi Trả 30 Ngày */}
        <div
          onMouseMove={handleMouseMove}
          className="bento-card col-span-12 sm:col-span-6 lg:col-span-3 glass-card rounded-[24px] p-6 flex flex-col justify-between min-h-[230px] border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-brandPink/15 border border-brandPink/30 flex items-center justify-center text-brandPink">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </div>
          <div>
            <div className="font-price font-bold text-3xl text-white">30 Ngày</div>
            <h3 className="font-display font-bold text-lg mt-1 text-white">Đổi Trả 1-Đổi-1</h3>
            <p className="text-xs text-textSecondary mt-1">
              Lỗi phần cứng từ nhà sản xuất đổi ngay máy mới nguyên hộp trong 15 phút.
            </p>
          </div>
        </div>

        {/* Cell 4: Bảo Hành Vàng VIP */}
        <div
          onMouseMove={handleMouseMove}
          className="bento-card col-span-12 sm:col-span-6 lg:col-span-3 glass-card rounded-[24px] p-6 flex flex-col justify-between min-h-[230px] border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-brandGold/15 border border-brandGold/30 flex items-center justify-center text-brandGold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <div className="font-price font-bold text-3xl text-brandGold">24 Tháng</div>
            <h3 className="font-display font-bold text-lg mt-1 text-white">Bảo Hành Vàng VIP</h3>
            <p className="text-xs text-textSecondary mt-1">
              Bảo vệ toàn diện cả rơi vỡ màn hình và vào nước, cấp máy dùng tạm miễn phí.
            </p>
          </div>
        </div>

        {/* Cell 5: Trả Góp 0% */}
        <div
          onMouseMove={handleMouseMove}
          className="bento-card col-span-12 sm:col-span-6 lg:col-span-3 glass-card rounded-[24px] p-6 flex flex-col justify-between min-h-[230px] border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-brandCyan/15 border border-brandCyan/30 flex items-center justify-center text-brandCyan">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <div className="font-price font-bold text-3xl text-brandCyan">0% Lãi Suất</div>
            <h3 className="font-display font-bold text-lg mt-1 text-white">Trả Góp Duyệt 60 Giây</h3>
            <p className="text-xs text-textSecondary mt-1">
              Qua 32 ngân hàng &amp; Apple Pay, không phí ẩn, không cần chứng minh thu nhập.
            </p>
          </div>
        </div>

        {/* Cell 6: Thu Cũ Đổi Mới */}
        <div
          onMouseMove={handleMouseMove}
          className="bento-card col-span-12 sm:col-span-6 lg:col-span-3 glass-card rounded-[24px] p-6 flex flex-col justify-between min-h-[230px] border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-brandMint/15 border border-brandMint/30 flex items-center justify-center text-brandMint">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 2.1l4 4-4 4" />
              <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
              <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
            </svg>
          </div>
          <div>
            <div className="font-price font-bold text-3xl text-brandMint">+5 Triệu</div>
            <h3 className="font-display font-bold text-lg mt-1 text-white">Thu Cũ Đổi Mới AI</h3>
            <p className="text-xs text-textSecondary mt-1">
              Chẩn đoán ngoại quan bằng AI trong 30 giây, cam kết giá thu cao nhất thị trường.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
 * 5. FLASH SALE SECTION — Đồng hồ đếm ngược Flip Clock + Carousel kéo
 * ======================================================================== */

interface FlashSaleSectionProps {
  initialProducts?: FlashSaleProduct[];
}

function FlashSaleSection({ initialProducts = [] }: FlashSaleSectionProps) {
  const [timeLeft, setTimeLeft] = useState(4 * 3600 + 48 * 60 + 59);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 17339));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const scrollBy = (offset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product: FlashSaleProduct) => {
    showToast(
      "Đã thêm vào giỏ hàng!",
      `${product.name} — Giá Flash Sale: ${product.price}`
    );
  };

  return (
    <section id="flash-sale-section" className="py-12 max-w-container mx-auto px-4 select-none">
      <div className="rounded-[32px] p-[2px] bg-sunset shadow-[0_25px_90px_-15px_rgba(255,90,95,0.4)]">
        <div className="rounded-[30px] bg-[#12091A]/95 backdrop-blur-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brandCoral/25 blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brandPink/25 blur-[110px] pointer-events-none" />

          {/* Header & Flip Clock */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brandCoral/20 border border-brandCoral/40 text-brandCoral text-xs font-mono font-bold uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-brandCoral animate-ping" />
                DEAL CHỚP NHOÁNG MỖI NGÀY
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white flex items-center gap-3">
                <span>FLASH SALE GIỜ VÀNG</span>
                <span className="text-sunset">— Giảm Đến 9 Triệu</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-white/70 mr-2">
                Kết thúc sau:
              </span>
              <div className="flip-unit glass-card px-3.5 py-2 rounded-2xl text-center border border-white/20 min-w-[64px]">
                <div className="font-price font-bold text-2xl md:text-3xl text-white">{hours}</div>
                <div className="text-[10px] font-mono uppercase text-white/60">Giờ</div>
              </div>
              <span className="font-price font-bold text-2xl text-brandCoral">:</span>
              <div className="flip-unit glass-card px-3.5 py-2 rounded-2xl text-center border border-white/20 min-w-[64px]">
                <div className="font-price font-bold text-2xl md:text-3xl text-white">{minutes}</div>
                <div className="text-[10px] font-mono uppercase text-white/60">Phút</div>
              </div>
              <span className="font-price font-bold text-2xl text-brandCoral">:</span>
              <div className="flip-unit glass-card px-3.5 py-2 rounded-2xl text-center border border-brandCoral/50 min-w-[64px] bg-brandCoral/10">
                <div className="font-price font-bold text-2xl md:text-3xl text-brandGold flip-card-pulse">{seconds}</div>
                <div className="text-[10px] font-mono uppercase text-white/60">Giây</div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-white/70 flex items-center gap-2">
              <svg className="w-4 h-4 text-brandGold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Lướt ngang để săn các suất ưu đãi giới hạn
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollBy(-320)}
                aria-label="Previous flash deal"
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-white hover:border-white/40 transition"
              >
                ←
              </button>
              <button
                onClick={() => scrollBy(320)}
                aria-label="Next flash deal"
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-white hover:border-white/40 transition"
              >
                →
              </button>
            </div>
          </div>

          {/* Products List */}
          {initialProducts.length === 0 ? (
            <div className="py-12 text-center text-textSecondary text-sm font-mono glass-card rounded-2xl border border-white/10">
              Đang đồng bộ hóa sản phẩm Flash Sale từ cơ sở dữ liệu...
            </div>
          ) : (
            <div ref={carouselRef} className="relative z-10 flex gap-5 overflow-x-auto no-scrollbar cursor-grab pb-2 select-none">
              {initialProducts.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[265px] md:min-w-[280px] glass-card rounded-[24px] p-5 flex flex-col justify-between border border-white/15 hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-brandCoral text-white animate-pulse">
                        {item.discount}
                      </span>
                      <span className="text-[11px] font-mono text-white/70">Giới hạn 100 suất</span>
                    </div>
                    <div
                      className="h-44 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group/img"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${item.color}35 0%, #090A14 80%)` }}
                    >
                      <div
                        className="absolute w-28 h-28 rounded-full blur-xl opacity-40 group-hover/img:opacity-70 transition-opacity"
                        style={{ backgroundColor: item.color }}
                      />
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={140}
                        height={144}
                        unoptimized
                        className="relative z-10 max-h-36 max-w-[140px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
                      />
                      {item.specs && (
                        <span className="absolute bottom-2 left-2 z-20 px-2 py-0.5 rounded text-[9px] font-mono bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                          {item.specs}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base text-white line-clamp-1">{item.name}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-price font-bold text-xl text-brandGold">{item.price}</span>
                      <span className="font-price text-xs text-white/50 line-through">{item.oldPrice}</span>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-brandGold">🔥 Đã bán {item.sold}/{item.total}</span>
                        <span className="text-white/70">Sắp cháy hàng</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden p-[1px]">
                        <div
                          className="h-full rounded-full bg-sunset shimmer-bar"
                          style={{ width: `${item.sold}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-sunset text-white text-xs font-display font-bold uppercase tracking-wider transition-all"
                    >
                      Săn Deal Ngay +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
 * 6. FEATURED PRODUCTS — Bộ sưu tập Siêu Phẩm với Tab lọc + Thẻ 3D
 * ======================================================================== */

const PRODUCT_CATEGORIES = [
  { id: "all", label: "Tất Cả Siêu Phẩm" },
  { id: "newest", label: "Mới Ra Mắt" },
  { id: "bestseller", label: "Bán Chạy Nhất" },
  { id: "camera", label: "Chuyên Gia Nhiếp Ảnh" },
  { id: "gaming", label: "Quái Vật Gaming" },
  { id: "value", label: "Giá Tốt Nhất" },
];

interface FeaturedProductsSectionProps {
  onToggleCompare?: (productName: string) => void;
  comparedItems?: string[];
  initialProducts?: FeaturedProduct[];
}

function FeaturedProductsSection({
  onToggleCompare,
  comparedItems = [],
  initialProducts = [],
}: FeaturedProductsSectionProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts =
    activeTab === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.category.includes(activeTab));

  const toggleFavorite = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((item) => item !== id));
      showToast("Đã bỏ yêu thích", `Đã xóa ${name} khỏi danh sách mong muốn`);
    } else {
      setFavorites((prev) => [...prev, id]);
      showToast("Đã lưu vào yêu thích ❤️", `${name} đã được thêm vào danh sách mong muốn`);
    }
  };

  const handleAddToCart = (product: FeaturedProduct) => {
    showToast("Đã thêm vào giỏ hàng!", `${product.name} — ${product.price} (Ưu đãi bảo hành 24 tháng)`);
  };

  const handleCompareClick = (productName: string) => {
    if (onToggleCompare) {
      onToggleCompare(productName);
    } else {
      window.dispatchEvent(new CustomEvent("toggle-compare", { detail: { name: productName } }));
    }
  };

  return (
    <section id="featured-section" className="py-24 max-w-container mx-auto px-4 select-none">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-brandViolet mb-3">
            <span>BỘ SƯU TẬP 2026 // CURATED FLAGSHIPS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-white">
            Siêu Phẩm <span className="text-aurora">Đáng Sở Hữu Nhất</span>
          </h2>
        </div>
        <div id="product-tabs-container" className="relative glass-pill p-1.5 inline-flex items-center self-start lg:self-auto overflow-x-auto no-scrollbar max-w-full">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`relative z-10 px-5 py-2 rounded-full text-xs font-display font-bold tracking-wide transition-all ${
                activeTab === cat.id
                  ? "bg-aurora text-white shadow-lg"
                  : "text-textSecondary hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-textSecondary text-sm font-mono glass-card rounded-2xl border border-white/10">
          Đang đồng bộ hóa danh sách sản phẩm Flagship từ cơ sở dữ liệu...
        </div>
      ) : (
        <div id="featured-grid" className="grid grid-cols-12 gap-6">
          {filteredProducts.map((prod) => {
            const isCompared = comparedItems.includes(prod.name);
            const isFav = favorites.includes(prod.id);
            return (
              <div
                key={prod.id}
                className="col-span-12 sm:col-span-6 lg:col-span-3 glass-card rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 hover:border-brandCyan/40 transition-all duration-300 border border-white/10"
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/10 border border-white/15 text-white">
                    {prod.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCompareClick(prod.name)}
                      title="So sánh cấu hình"
                      className={`w-8 h-8 rounded-full glass-card flex items-center justify-center transition ${
                        isCompared
                          ? "bg-brandCyan text-black border-brandCyan"
                          : "text-textSecondary hover:text-brandCyan hover:border-brandCyan/50"
                      }`}
                    >
                      ⇄
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(e, prod.id, prod.name)}
                      title="Yêu thích"
                      className={`w-8 h-8 rounded-full glass-card flex items-center justify-center transition ${
                        isFav
                          ? "text-brandPink bg-brandPink/20 border-brandPink/50"
                          : "text-textSecondary hover:text-brandPink hover:border-brandPink/50"
                      }`}
                    >
                      ♥
                    </button>
                  </div>
                </div>

                <div className="relative my-4 h-48 flex items-center justify-center group/cardimg">
                  <div
                    className="w-36 h-36 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 absolute"
                    style={{ backgroundColor: prod.blob }}
                  />
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    width={170}
                    height={176}
                    unoptimized
                    className="relative z-10 max-h-44 max-w-[170px] object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] group-hover:scale-108 transition-transform duration-300 ease-out"
                  />
                </div>

                <div className="relative z-10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brandGold font-mono font-bold">★ {prod.rating}</span>
                    <span className="text-textSecondary font-mono text-[11px]">Sẵn hàng Fullbox</span>
                  </div>
                  <h3 className="font-display font-bold text-lg leading-snug group-hover:text-brandCyan transition-colors text-white line-clamp-1">
                    {prod.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prod.specs.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-textSecondary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3 flex items-center justify-between border-t border-white/10">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-textSecondary">
                        <span>Giá từ</span>
                        {prod.originalPrice && <span className="line-through text-white/40">{prod.originalPrice}</span>}
                      </div>
                      <div className="font-price font-bold text-lg text-white">{prod.price}</div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="h-10 px-4 rounded-full bg-aurora hover:opacity-90 text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition-all"
                    >
                      <span>Mua</span>
                      <span className="text-sm">+</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ========================================================================
 * 7. SCROLL STORY — Bóc tách công nghệ 4 bước 3D
 * ======================================================================== */

interface ScrollStorySectionProps {
  chapters?: StoryChapter[];
}

function ScrollStorySection({ chapters = [] }: ScrollStorySectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (!chapters || chapters.length === 0) {
    return null;
  }

  const chapter = chapters[activeStep] || chapters[0];

  return (
    <section id="scroll-story-section" className="py-24 relative select-none">
      <div className="max-w-container mx-auto px-4 relative z-10">
        <div
          id="story-bg-aura"
          className="absolute inset-0 transition-all duration-700 ease-out pointer-events-none rounded-3xl opacity-60"
          style={{ background: chapter.aura }}
        />

        <div className="relative z-10 grid grid-cols-12 gap-8 items-center glass-card rounded-[32px] p-8 md:p-14 border border-white/10">
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-brandCyan">
              <span>BÓC TÁCH CÔNG NGHỆ // HARDWARE BREAKTHROUGH</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                    activeStep === idx
                      ? "bg-aurora text-white shadow-lg scale-105"
                      : "glass-card text-textSecondary hover:text-white"
                  }`}
                >
                  {`0${idx + 1}. `}
                  {idx === 0
                    ? "Camera 200MP"
                    : idx === 1
                    ? "Chip 3nm"
                    : idx === 2
                    ? "Pin 6000mAh"
                    : "Màn 144Hz"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="font-mono text-sm font-bold text-brandCyan uppercase tracking-widest">
                {chapter.kicker}
              </div>
              <h2
                className="font-display font-extrabold text-3xl md:text-5xl leading-tight text-white"
                dangerouslySetInnerHTML={{ __html: chapter.heading }}
              />
              <p className="text-textSecondary text-base md:text-lg max-w-xl leading-relaxed">
                {chapter.body}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg">
              {chapter.stats.map((stat, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-4 border border-white/10">
                  <div className="font-price font-bold text-2xl text-brandCyan">
                    {stat.val}
                  </div>
                  <div className="text-xs text-textSecondary mt-1">
                    {stat.lbl}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-lg h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-aurora transition-all duration-300 rounded-full"
                style={{ width: `${((activeStep + 1) / chapters.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 flex items-center justify-center relative h-[460px] hero-perspective">
            <div className="absolute w-[380px] h-[380px] rounded-full border border-white/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-[290px] h-[290px] rounded-full border border-dashed border-brandCyan/30 animate-[spin_25s_linear_infinite_reverse]" />

            <div
              className="relative w-[260px] h-[450px] rounded-[44px] p-2.5 border-2 border-white/30 shadow-[0_30px_90px_rgba(0,0,0,0.85)] transition-all duration-700 ease-out"
              style={{
                background: "linear-gradient(145deg, #23263A, #090A12)",
                transform:
                  activeStep === 0
                    ? "scale(1.08) rotateY(-14deg) rotateX(6deg)"
                    : activeStep === 1
                    ? "scale(1.04) rotateY(18deg) rotateX(-5deg)"
                    : activeStep === 2
                    ? "scale(1.08) rotateY(-8deg) rotateX(14deg)"
                    : "scale(1.12) rotateY(0deg) rotateX(0deg)",
              }}
            >
              <div className="w-full h-full rounded-[35px] bg-[#0B0C18] p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="my-auto flex flex-col items-center justify-center text-center">
                  <div className="w-36 h-36 rounded-full border-4 border-brandCyan/60 bg-gradient-to-br from-brandViolet/40 via-black to-brandCyan/40 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.45)] relative">
                    <div className="w-22 h-22 rounded-full border border-white/30 bg-[#05060C] flex items-center justify-center p-4">
                      <span className="font-price font-bold text-lg text-brandCyan">
                        {chapter.badge}
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 mt-5">
                    {chapter.caption}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-textSecondary border-t border-white/10 pt-3">
                  <span>AETHER LABS</span>
                  <span className="text-brandCyan">{chapter.code}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
 * 8. TRADE-IN SECTION — Thu Cũ Đổi Mới + Modal Định Giá AI 30 Giây
 * ======================================================================== */

function TradeInSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBaseValuation, setSelectedBaseValuation] = useState(24500000);
  const subsidyBonus = 5000000;
  const totalValuation = selectedBaseValuation + subsidyBonus;

  const handleConfirmTradeIn = () => {
    setIsModalOpen(false);
    showToast(
      "Đặt lịch thu máy thành công!",
      `Kỹ thuật viên VIP sẽ liên hệ thẩm định tận nơi. Giá dự kiến: ${totalValuation.toLocaleString("vi-VN")}₫`
    );
  };

  return (
    <>
      <section id="trade-in-section" className="py-20 max-w-container mx-auto px-4 select-none">
        <div className="grid grid-cols-12 gap-6">
          {/* Card 1: Thu Cũ Đổi Mới */}
          <div
            className="col-span-12 lg:col-span-6 rounded-[28px] p-8 md:p-10 relative overflow-hidden border border-white/15 flex flex-col justify-between min-h-[380px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.32) 0%, rgba(15,16,32,0.95) 55%, rgba(236,72,153,0.28) 100%)",
            }}
          >
            <div className="relative z-10 max-w-md space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-brandGold/20 text-brandGold border border-brandGold/40">
                THU CŨ ĐỔI MỚI AI 30 GIÂY
              </span>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-white">
                Lên Đời Siêu Phẩm <br />
                <span className="text-sunset">Trợ Giá Đến 5 Triệu</span>
              </h3>
              <p className="text-sm text-textSecondary">
                Chấp nhận mọi tình trạng máy cũ (kể cả trầy xước, hết bảo hành). Thu tận nhà, trừ trực tiếp vào giá máy mới hoặc nhận tiền mặt tức thì.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 rounded-full bg-sunset text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
              >
                Định Giá Máy Cũ Ngay →
              </button>
              <span className="text-xs font-mono text-white/75">
                Hơn 4.800 máy đã thu tháng này
              </span>
            </div>

            <div className="absolute -right-6 -bottom-8 w-48 h-64 rounded-[32px] glass-card border border-white/25 p-4 flex flex-col justify-between pointer-events-none opacity-85 hidden sm:flex">
              <div className="text-[10px] font-mono text-brandGold">AI DIAGNOSTIC</div>
              <div className="my-auto text-center">
                <div className="font-price font-bold text-2xl text-brandMint">
                  +5.000.000₫
                </div>
                <div className="text-[10px] text-textSecondary mt-1">Bonus lên đời</div>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-brandMint"></div>
              </div>
            </div>
          </div>

          {/* Card 2: Trả Góp 0% */}
          <div
            className="col-span-12 lg:col-span-6 rounded-[28px] p-8 md:p-10 relative overflow-hidden border border-white/15 flex flex-col justify-between min-h-[380px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.32) 0%, rgba(15,16,32,0.95) 55%, rgba(34,211,238,0.28) 100%)",
            }}
          >
            <div className="relative z-10 max-w-md space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-brandCyan/20 text-brandCyan border border-brandCyan/40">
                TÀI CHÍNH LINH HOẠT VIP
              </span>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-white">
                Trả Trước <span className="text-aurora">0 Đồng</span>
                <br />
                Kỳ Hạn Đến 24 Tháng
              </h3>
              <p className="text-sm text-textSecondary">
                Duyệt hồ sơ tự động bằng CCCD gắn chip trong 60 giây. Không gọi người thân, 0% lãi suất, 0đ phí chuyển đổi qua 32 ngân hàng đối tác.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex flex-wrap items-center gap-4">
              <a
                href="#featured-section"
                className="px-6 py-3.5 rounded-full bg-aurora text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
              >
                Tính Khoản Trả Hàng Tháng →
              </a>
              <span className="text-xs font-mono text-brandMint">
                ● Tỷ lệ duyệt 99.2%
              </span>
            </div>

            <div className="absolute -right-4 -bottom-6 w-52 h-60 rounded-[28px] glass-card border border-brandCyan/30 p-4 flex flex-col justify-between pointer-events-none opacity-85 hidden sm:flex">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-brandCyan">MD PAY</span>
                <span className="w-6 h-4 rounded bg-brandGold/80"></span>
              </div>
              <div>
                <div className="font-price font-bold text-2xl text-white">0% APR</div>
                <div className="text-[10px] font-mono text-textSecondary">
                  Chỉ từ 990.000₫ / tháng
                </div>
              </div>
              <div className="text-[10px] font-mono text-brandMint">
                ✓ Approved in 60s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trade-in AI Estimator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-card rounded-[28px] max-w-lg w-full p-8 border border-white/20 space-y-5 relative bg-[#0F1020]/95 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full glass-card flex items-center justify-center text-textSecondary hover:text-white"
            >
              ✕
            </button>
            <div className="text-xs font-mono uppercase tracking-widest text-brandGold">
              CHẨN ĐOÁN GIÁ THU CŨ AI 30 GIÂY
            </div>
            <h3 className="font-display font-extrabold text-2xl text-white">
              Định Giá Máy Cũ Của Bạn
            </h3>
            <div className="space-y-3">
              <label className="block text-xs font-mono text-textSecondary">
                Chọn dòng máy đang sử dụng:
              </label>
              <select
                value={selectedBaseValuation}
                onChange={(e) => setSelectedBaseValuation(Number(e.target.value))}
                className="w-full h-12 rounded-xl bg-surfaceDark border border-white/15 px-4 text-sm text-white focus:outline-none focus:border-brandCyan"
              >
                <option value={24500000}>
                  iPhone 15 Pro Max 256GB (Thu tới 24.500.000₫ + Trợ giá 5Tr)
                </option>
                <option value={21000000}>
                  Samsung Galaxy S24 Ultra (Thu tới 21.000.000₫ + Trợ giá 5Tr)
                </option>
                <option value={16500000}>
                  Xiaomi 14 Ultra 5G (Thu tới 16.500.000₫ + Trợ giá 4Tr)
                </option>
                <option value={14800000}>
                  OPPO Find X7 Ultra (Thu tới 14.800.000₫ + Trợ giá 4Tr)
                </option>
              </select>
            </div>
            <div className="p-4 rounded-2xl bg-brandMint/10 border border-brandMint/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-textSecondary">
                  Tổng giá trị thu + trợ giá dự kiến:
                </div>
                <div className="font-price font-bold text-2xl text-brandMint mt-0.5">
                  {totalValuation.toLocaleString("vi-VN")}₫
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-brandMint/20 text-brandMint">
                Nhận tiền ngay
              </span>
            </div>
            <button
              onClick={handleConfirmTradeIn}
              className="w-full h-13 py-3.5 rounded-full bg-aurora text-white font-display font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Đặt Lịch Kỹ Thuật Viên Thu Tận Nhà
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ========================================================================
 * 9. NEED ACCORDION — Chọn theo nhu cầu (Accordion ngang)
 * ======================================================================== */

function NeedAccordionSection() {
  const [activeNeed, setActiveNeed] = useState<number>(0);

  const needs = [
    {
      id: 0,
      code: "01 // PRO PHOTOGRAPHY",
      badge: "200MP ZEISS / LEICA",
      badgeColor: "text-brandCoral",
      title: "Nhiếp Ảnh & Quay Phim 8K",
      desc: "Cảm biến 1-inch, chống rung Gimbal OIS và màu film điện ảnh chân thực cho nhà sáng tạo.",
      suggest: "Xiaomi 15 Ultra • iPhone 16 Pro Max",
      suggestColor: "text-brandGold",
      bg: "radial-gradient(circle at 70% 30%, rgba(255,90,95,0.45), rgba(15,16,32,0.95) 75%)",
    },
    {
      id: 1,
      code: "02 // ESPORTS BEAST",
      badge: "144HZ + ICE COOLING",
      badgeColor: "text-brandCyan",
      title: "Hardcore Gaming Không Độ Trễ",
      desc: "Tản nhiệt buồng hơi 3D, phím trigger siêu âm và khung hình khóa cứng 144FPS suốt 6 giờ.",
      suggest: "ROG Phone 9 Pro • RedMagic 9S Pro",
      suggestColor: "text-brandCyan",
      bg: "radial-gradient(circle at 70% 30%, rgba(34,211,238,0.45), rgba(15,16,32,0.95) 75%)",
    },
    {
      id: 2,
      code: "03 // EXECUTIVE AI",
      badge: "BẢO MẬT LƯỢNG TỬ",
      badgeColor: "text-brandGold",
      title: "Doanh Nhân & Trợ Lý AI",
      desc: "Dịch thuật cuộc gọi trực tiếp 42 ngôn ngữ, tóm tắt họp bằng AI và khung Titan siêu bền.",
      suggest: "Galaxy Z Fold6 • Galaxy S25 Ultra",
      suggestColor: "text-brandGold",
      bg: "radial-gradient(circle at 70% 30%, rgba(124,58,237,0.45), rgba(15,16,32,0.95) 75%)",
    },
    {
      id: 3,
      code: "04 // HYPER ENDURANCE",
      badge: "6.500MAH + 120W",
      badgeColor: "text-brandMint",
      title: "Pin 3 Ngày & Sạc Siêu Tốc",
      desc: "Công nghệ pin Silicon-Carbon thế hệ mới siêu mỏng, sạc đầy 100% chỉ trong 17 phút.",
      suggest: "Vivo X200 Pro • OPPO Find X8 Pro",
      suggestColor: "text-brandMint",
      bg: "radial-gradient(circle at 70% 30%, rgba(52,211,153,0.42), rgba(15,16,32,0.95) 75%)",
    },
  ];

  return (
    <section className="py-20 max-w-container mx-auto px-4 select-none">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-brandPink mb-3">
          <span>CÁ NHÂN HÓA TRẢI NGHIỆM // AI ADVISOR</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-white">
          Chọn Máy Theo <span className="text-aurora">Đúng Chất Của Bạn</span>
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[440px]">
        {needs.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveNeed(item.id)}
            onMouseEnter={() => setActiveNeed(item.id)}
            className={`need-accordion-card group relative rounded-[24px] overflow-hidden border border-white/15 p-7 flex flex-col justify-between cursor-pointer min-h-[260px] transition-all duration-500 ${
              activeNeed === item.id ? "active-need" : ""
            }`}
            style={{ background: item.bg }}
          >
            <div className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none">
              <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full border-2 border-white/20 animate-pulse" />
              <div className="absolute right-8 bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-white">
                {item.code}
              </span>
              <span className={`font-mono text-xs ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white">
                {item.title}
              </h3>
              <p className="text-sm text-white/80 max-w-md">{item.desc}</p>
              <div className={`pt-2 flex items-center gap-3 text-xs font-mono ${item.suggestColor}`}>
                <span>Gợi ý: {item.suggest}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========================================================================
 * 10. REVIEWS SECTION — Đánh giá khách hàng marquee + Tin tức công nghệ
 * ======================================================================== */

interface ReviewsSectionProps {
  reviewsRow1?: CustomerReview[];
  reviewsRow2?: CustomerReview[];
}

function ReviewCard({ r }: { r: CustomerReview }) {
  return (
    <div className="w-[340px] md:w-[380px] glass-card rounded-[22px] p-5 shrink-0 border border-white/10 flex flex-col justify-between hover:border-brandCyan/40 transition-colors">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-tr ${r.avatarColor} flex items-center justify-center font-display font-bold text-white text-xs`}
            >
              {r.avatarText}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                <span>{r.name}</span>
                {r.verified && (
                  <span
                    className="w-4 h-4 rounded-full bg-brandCyan/20 text-brandCyan text-[10px] flex items-center justify-center font-bold"
                    title="Đã mua hàng chính hãng"
                  >
                    ✓
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-textSecondary">
                {r.role}
              </div>
            </div>
          </div>
          <div className="flex text-brandGold text-xs">
            {Array.from({ length: r.rating }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>

        <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
          &ldquo;{r.content}&rdquo;
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
        <span className="text-textSecondary">Sở hữu:</span>
        <span className="text-brandCyan font-semibold">{r.product}</span>
      </div>
    </div>
  );
}

function ReviewsSection({
  reviewsRow1 = [],
  reviewsRow2 = [],
}: ReviewsSectionProps) {
  const hasReviews = reviewsRow1.length > 0 || reviewsRow2.length > 0;

  return (
    <section className="py-20 overflow-hidden select-none">
      <div className="max-w-container mx-auto px-4 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-brandGold mb-3">
            <span>CỘNG ĐỒNG MD MOBILE // ĐÁNH GIÁ CHÍNH HÃNG</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-white">
            Khách Hàng Nói Gì Về <span className="text-aurora">MD Mobile?</span>
          </h2>
        </div>
      </div>

      {reviewsRow1.length > 0 && (
        <div className="marquee-container mb-5">
          <div className="marquee-track flex gap-5">
            {reviewsRow1.map((r) => (
              <ReviewCard key={`r1-${r.id}`} r={r} />
            ))}
            {reviewsRow1.map((r) => (
              <ReviewCard key={`r1-dup-${r.id}`} r={r} />
            ))}
          </div>
        </div>
      )}

      {reviewsRow2.length > 0 && (
        <div className="marquee-container">
          <div className="marquee-track-reverse flex gap-5">
            {reviewsRow2.map((r) => (
              <ReviewCard key={`r2-${r.id}`} r={r} />
            ))}
            {reviewsRow2.map((r) => (
              <ReviewCard key={`r2-dup-${r.id}`} r={r} />
            ))}
          </div>
        </div>
      )}

      {!hasReviews && (
        <div className="max-w-container mx-auto px-4 py-8 text-center glass-card rounded-2xl border border-white/10 text-textSecondary text-sm">
          Chưa có đánh giá nào được tải lên từ hệ thống.
        </div>
      )}

      {/* Tech News */}
      <div className="max-w-container mx-auto px-4 pt-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brandCyan">
              TẠP CHÍ CÔNG NGHỆ // MD JOURNAL
            </span>
            <h3 className="font-display font-extrabold text-3xl md:text-4xl mt-1 text-white">
              Góc Nhìn Chuyên Sâu
            </h3>
          </div>
          <button
            onClick={() => showToast("MD Journal", "Toàn bộ bài viết chuyên sâu đang được đồng bộ hóa.")}
            className="text-xs font-mono uppercase tracking-wider text-brandCyan hover:underline"
          >
            Xem tất cả bài viết →
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <article
            onClick={() => showToast("Đang mở bài viết", "Phân tích kiến trúc vi xử lý 3nm NPU thế hệ mới")}
            className="col-span-12 md:col-span-4 glass-card rounded-[24px] overflow-hidden group cursor-pointer flex flex-col justify-between border border-white/10"
          >
            <div className="h-52 overflow-hidden relative bg-[#111328]">
              <div className="w-full h-full bg-gradient-to-br from-brandViolet/60 via-[#0F1020] to-brandCyan/60 flex items-center justify-center transition-transform duration-700 ease-expo group-hover:scale-110">
                <div className="w-28 h-28 rounded-3xl border border-white/30 glass-card flex flex-col items-center justify-center">
                  <span className="font-price font-bold text-2xl text-brandCyan">
                    3nm NPU
                  </span>
                  <span className="text-[10px] font-mono text-white/70">
                    BENCHMARK 2026
                  </span>
                </div>
              </div>
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-brandCyan">
                Phân tích phần cứng
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-textSecondary mb-2">
                  12 Tháng 05, 2026 • 6 phút đọc
                </div>
                <h4 className="font-display font-bold text-lg group-hover:text-brandCyan transition-colors text-white">
                  Vì sao tiến trình 3nm thế hệ thứ 2 thay đổi hoàn toàn nhiếp ảnh điện toán trên điện thoại?
                </h4>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 text-xs font-semibold text-brandCyan flex items-center justify-between">
                <span>Đọc bài phân tích</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </article>

          <article
            onClick={() => showToast("Đang mở bài viết", "Đọ sức Zoom quang 10X tại Sài Gòn về đêm")}
            className="col-span-12 md:col-span-4 glass-card rounded-[24px] overflow-hidden group cursor-pointer flex flex-col justify-between border border-white/10"
          >
            <div className="h-52 overflow-hidden relative bg-[#111328]">
              <div className="w-full h-full bg-gradient-to-br from-brandCoral/60 via-[#0F1020] to-brandGold/60 flex items-center justify-center transition-transform duration-700 ease-expo group-hover:scale-110">
                <div className="w-28 h-28 rounded-full border border-white/30 glass-card flex flex-col items-center justify-center">
                  <span className="font-price font-bold text-2xl text-brandGold">
                    200MP
                  </span>
                  <span className="text-[10px] font-mono text-white/70">
                    PERISCOPE TEST
                  </span>
                </div>
              </div>
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-brandGold">
                Nhiếp ảnh di động
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-textSecondary mb-2">
                  09 Tháng 05, 2026 • 8 phút đọc
                </div>
                <h4 className="font-display font-bold text-lg group-hover:text-brandGold transition-colors text-white">
                  Đọ sức Zoom quang 10X tại Sài Gòn về đêm: Khi Flagship vượt qua máy ảnh Mirrorless
                </h4>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 text-xs font-semibold text-brandGold flex items-center justify-between">
                <span>Xem bộ ảnh gốc RAW</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </article>

          <article
            onClick={() => showToast("Đang mở bài viết", "Bí mật đằng sau viên pin Silicon-Carbon 6.000mAh")}
            className="col-span-12 md:col-span-4 glass-card rounded-[24px] overflow-hidden group cursor-pointer flex flex-col justify-between border border-white/10"
          >
            <div className="h-52 overflow-hidden relative bg-[#111328]">
              <div className="w-full h-full bg-gradient-to-br from-brandMint/60 via-[#0F1020] to-brandBlue/60 flex items-center justify-center transition-transform duration-700 ease-expo group-hover:scale-110">
                <div className="w-28 h-28 rounded-3xl border border-white/30 glass-card flex flex-col items-center justify-center">
                  <span className="font-price font-bold text-2xl text-brandMint">
                    Si-C Battery
                  </span>
                  <span className="text-[10px] font-mono text-white/70">
                    6.000mAh TECH
                  </span>
                </div>
              </div>
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-brandMint">
                Công nghệ Pin
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-textSecondary mb-2">
                  04 Tháng 05, 2026 • 5 phút đọc
                </div>
                <h4 className="font-display font-bold text-lg group-hover:text-brandMint transition-colors text-white">
                  Bí mật đằng sau viên pin Silicon-Carbon 6.000mAh trong thân máy mỏng chỉ 8.1mm
                </h4>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 text-xs font-semibold text-brandMint flex items-center justify-between">
                <span>Khám phá công nghệ</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
 * 11. FLOATING COMPARE BAR — Thanh so sánh cấu hình nổi đáy màn hình
 * ======================================================================== */

interface FloatingCompareBarProps {
  comparedItems?: string[];
  onRemoveItem?: (name: string) => void;
  onClearAll?: () => void;
}

function FloatingCompareBar({
  comparedItems: propItems,
  onRemoveItem,
  onClearAll,
}: FloatingCompareBarProps) {
  const [localItems, setLocalItems] = useState<string[]>([]);
  const items = propItems ?? localItems;

  useEffect(() => {
    const handleToggleCompare = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string }>;
      const name = customEvent.detail.name;
      setLocalItems((prev) => {
        if (prev.includes(name)) {
          showToast("Đã xóa khỏi so sánh", name);
          return prev.filter((i) => i !== name);
        }
        if (prev.length >= 3) {
          showToast("Tối đa 3 thiết bị", "Vui lòng xóa bớt để thêm thiết bị mới");
          return prev;
        }
        showToast("Đã thêm vào so sánh", name);
        return [...prev, name];
      });
    };

    window.addEventListener("toggle-compare", handleToggleCompare);
    return () => window.removeEventListener("toggle-compare", handleToggleCompare);
  }, []);

  const handleClear = () => {
    setLocalItems([]);
    if (onClearAll) onClearAll();
    showToast("Đã xóa bảng so sánh", "Đã xóa toàn bộ thiết bị khỏi bộ so sánh");
  };

  const handleCompareNow = () => {
    showToast(
      "Đang mở bảng so sánh chi tiết",
      `So sánh ${items.join(" vs ")}`
    );
  };

  if (items.length === 0) return null;

  return (
    <div
      id="compare-bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[190] glass-pill px-6 py-3 shadow-2xl border border-brandViolet/50 flex items-center gap-4 bg-[#0F1020]/95 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <span className="text-xs font-mono text-brandCyan font-bold whitespace-nowrap">
        SO SÁNH CẤU HÌNH ({items.length}/3):
      </span>

      <div className="flex items-center gap-2 text-xs font-medium">
        {items.map((name) => (
          <span
            key={name}
            className="px-2.5 py-1 rounded-full bg-white/10 text-white flex items-center gap-1.5"
          >
            <span>{name}</span>
            <button
              onClick={() => {
                setLocalItems((prev) => prev.filter((i) => i !== name));
                if (onRemoveItem) onRemoveItem(name);
              }}
              className="text-textSecondary hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <button
        onClick={handleCompareNow}
        className="px-3 py-1 rounded-full bg-aurora text-white text-xs font-bold font-display ml-2 hover:opacity-90"
      >
        So sánh ngay
      </button>

      <button
        onClick={handleClear}
        className="text-xs font-mono text-textSecondary hover:text-white ml-1"
      >
        Xóa
      </button>
    </div>
  );
}

/* ========================================================================
 * MAIN PAGE COMPONENT: HOMEPAGE FLAGSHIP STORE
 * ======================================================================== */

interface DBProductRow {
  id: string;
  name: string;
  price: string | number;
  original_price: string | number | null;
  discount_percentage: number;
  thumbnail: string;
  specifications: string | object | null;
  rating: string | number;
  stock_quantity: number;
  is_featured: number | boolean;
  is_new_arrival: number | boolean;
  is_best_seller: number | boolean;
  brand_name?: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<FlashSaleProduct[]>([]);
  const [comparedItems, setComparedItems] = useState<string[]>([]);

  // Tự động nạp dữ liệu thật từ cơ sở dữ liệu MySQL qua API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const rows: DBProductRow[] = json.data;

          const blobs = ["#D4A373", "#2563EB", "#EF4444", "#7C3AED", "#0284C7", "#10B981", "#14B8A6", "#F59E0B"];
          const colors = ["#D4A373", "#2563EB", "#EF4444", "#7C3AED", "#0284C7", "#10B981"];

          // 1. Phân loại sản phẩm nổi bật
          const featured: FeaturedProduct[] = rows
            .filter((p) => Boolean(p.is_featured))
            .map((p, idx) => {
              let specsArr: string[] = [];
              if (typeof p.specifications === "string") {
                try {
                  const parsed = JSON.parse(p.specifications);
                  specsArr = [parsed.cpu || "AI Chip", parsed.screen || "AMOLED", parsed.camera || "Chính hãng"];
                } catch {
                  specsArr = ["Chính hãng", "Bảo hành 12T", "Fullbox"];
                }
              } else if (p.specifications && typeof p.specifications === "object") {
                const sp = p.specifications as Record<string, string>;
                specsArr = [sp.cpu || "AI Chip", sp.camera || "Camera Pro", sp.screen || "Màn hình 120Hz"];
              }

              const categories = ["all"];
              if (p.is_new_arrival) categories.push("newest");
              if (p.is_best_seller) categories.push("bestseller");
              if (p.name.toLowerCase().includes("ultra") || p.name.toLowerCase().includes("pro")) categories.push("camera");
              if (p.name.toLowerCase().includes("rog") || p.name.toLowerCase().includes("gaming")) categories.push("gaming");
              if (Number(p.price) < 25000000) categories.push("value");

              return {
                id: p.id,
                category: categories,
                name: p.name,
                image: p.thumbnail,
                specs: specsArr.slice(0, 3),
                rating: Number(p.rating || 5).toFixed(2),
                price: `${Number(p.price).toLocaleString("vi-VN")}₫`,
                originalPrice: p.original_price ? `${Number(p.original_price).toLocaleString("vi-VN")}₫` : undefined,
                blob: blobs[idx % blobs.length],
                badge: p.is_best_seller ? "BÁN CHẠY #1" : p.is_new_arrival ? "MỚI RA MẮT" : "CHÍNH HÃNG",
              };
            });

          // 2. Phân loại sản phẩm Flash Sale
          const flash: FlashSaleProduct[] = rows
            .filter((p) => Number(p.discount_percentage) > 0)
            .slice(0, 8)
            .map((p, idx) => ({
              id: `fs-${p.id}`,
              name: p.name,
              image: p.thumbnail,
              discount: `-${p.discount_percentage}%`,
              price: `${Number(p.price).toLocaleString("vi-VN")}₫`,
              oldPrice: p.original_price
                ? `${Number(p.original_price).toLocaleString("vi-VN")}₫`
                : `${(Number(p.price) * 1.15).toLocaleString("vi-VN")}₫`,
              sold: Math.min(Math.floor((p.stock_quantity || 50) * 1.8), 95),
              total: 100,
              color: colors[idx % colors.length],
              badge: `Giảm ${p.discount_percentage}%`,
              specs: p.brand_name || "Chính Hãng",
            }));

          setFeaturedProducts(featured);
          setFlashSaleProducts(flash);
        }
      } catch (err) {
        console.error("Lỗi khi kết nối API sản phẩm:", err);
      }
    }

    loadData();
  }, []);

  const handleToggleCompare = (productName: string) => {
    setComparedItems((prev) => {
      if (prev.includes(productName)) {
        showToast("Đã xóa khỏi so sánh", productName);
        return prev.filter((i) => i !== productName);
      }
      if (prev.length >= 3) {
        showToast("Tối đa 3 thiết bị", "Vui lòng xóa bớt để thêm thiết bị mới");
        return prev;
      }
      showToast("Đã thêm vào so sánh", productName);
      return [...prev, productName];
    });
  };

  return (
    <main className="min-h-screen bg-bgDark text-textPrimary relative flex flex-col justify-between overflow-x-hidden">
      {/* 0. Màn hình loading chuyển cảnh */}
      <LoadingScreen />

      {/* 1. Thanh thông báo chạy vô hạn trên cùng */}
      <AnnouncementBar />

      {/* 2. Header cố định dạng Pill kính mờ sang trọng */}
      <Header searchProducts={featuredProducts} />

      {/* 3. Hero Slider Banner chính */}
      <HeroSlider />

      {/* 4. Marquee thương hiệu ủy quyền chính thức */}
      <BrandMarquee />

      {/* 5. Bento Grid 6 ô đặc quyền thượng lưu */}
      <BentoSection />

      {/* 6. Flash Sale đồng hồ đếm ngược + Carousel kéo */}
      <FlashSaleSection initialProducts={flashSaleProducts} />

      {/* 7. Siêu phẩm nổi bật với tab lọc 3D */}
      <FeaturedProductsSection
        initialProducts={featuredProducts}
        comparedItems={comparedItems}
        onToggleCompare={handleToggleCompare}
      />

      {/* 8. Bóc tách công nghệ phần cứng 3D */}
      <ScrollStorySection />

      {/* 9. Banner Thu cũ đổi mới trợ giá 5 triệu & Trả góp 0% */}
      <TradeInSection />

      {/* 10. Chọn máy theo nhu cầu Accordion */}
      <NeedAccordionSection />

      {/* 11. Đánh giá khách hàng & Tin tức công nghệ */}
      <ReviewsSection />

      {/* 12. Dark Luxury Footer */}
      <Footer />

      {/* Thanh so sánh cấu hình nổi */}
      <FloatingCompareBar
        comparedItems={comparedItems}
        onRemoveItem={(name) => setComparedItems((prev) => prev.filter((i) => i !== name))}
        onClearAll={() => setComparedItems([])}
      />
    </main>
  );
}
