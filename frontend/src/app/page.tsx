"use client";

/**
 * ========================================================================
 * MD MOBILE FLAGSHIP STORE — TRANG CHỦ (HOME PAGE)
 * Giao diện tinh gọn, module hóa rõ ràng, dễ hiểu và dễ bảo trì.
 * Các khối sản phẩm đang để khung chờ sẵn sàng để tích hợp sau.
 * ========================================================================
 */

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import {
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Award,
  CreditCard,
  RefreshCw,
  ArrowRight,
  X,
} from "lucide-react";
import { Header, Footer, LoadingScreen, FloatingActions } from "@/components/common";
import { showToast } from "@/components/ui/toast-box";
import type { HeroBannerItem } from "@/types";

// Swiper CSS styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

/* ========================================================================
 * 1. ANNOUNCEMENT BAR — Thanh thông báo chạy chữ vô hạn
 * ======================================================================== */

const ANNOUNCEMENT_ITEMS = [
  "Miễn phí giao hàng hỏa tốc toàn quốc",
  "Trả góp 0% lãi suất — Duyệt hồ sơ AI trong 60 giây",
  "Tặng gói Bảo Hành Vàng 24 tháng (Rơi vỡ & Vào nước)",
  "Thu cũ đổi mới trợ giá lên đời đến 5.000.000đ",
];

function AnnouncementBar() {
  return (
    <div className="w-full bg-sunset text-white text-xs font-semibold tracking-wider uppercase py-2 overflow-hidden relative z-[90] marquee-container select-none">
      <div className="marquee-track flex items-center gap-12">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-12 shrink-0">
            {ANNOUNCEMENT_ITEMS.map((text, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>{text}</span>
                <span className="opacity-60 ml-8">|</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================================
 * 2. HERO SLIDER — Banner Swiper chính (dữ liệu thật từ /api/banners)
 * ======================================================================== */

interface HeroSliderProps {
  banners?: HeroBannerItem[];
}

function HeroSlider({ banners = [] }: HeroSliderProps) {
  if (banners.length === 0) {
    return (
      <section id="hero-section" className="relative w-full overflow-hidden select-none border-b border-black/10 dark:border-white/10">
        <div className="w-full h-[360px] sm:h-[460px] bg-surfaceDark flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-full bg-brandViolet/20 border border-brandViolet/40 flex items-center justify-center text-brandCyan mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary mb-2">MD Mobile Flagship Store</h2>
          <p className="text-sm text-textSecondary max-w-md">
            Hệ thống đang đồng bộ hóa các chương trình ưu đãi Flagship từ cơ sở dữ liệu.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="hero-section" className="relative w-full overflow-hidden select-none border-b border-black/10 dark:border-white/10">
      <div className="relative w-full overflow-hidden group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={900}
          loop={banners.length > 1}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, bulletClass: "custom-bullet", bulletActiveClass: "custom-bullet-active" }}
          navigation={true}
          className="w-full h-[460px] sm:h-[540px] md:h-[620px] lg:h-[680px] xl:h-[720px]"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} className="relative w-full h-full bg-[#07070F]">
              <div className="relative w-full h-full">
                {banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    priority={banner.id === 1}
                    className="object-cover object-center transform transition-transform duration-1000 scale-100 hover:scale-105"
                    sizes="100vw"
                  />
                ) : null}

                {/* Dark overlay gradients for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070F] via-[#07070F]/50 to-transparent md:bg-gradient-to-r md:from-[#07070F]/90 md:via-[#07070F]/60 md:to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${banner.accentColor} mix-blend-screen pointer-events-none`} />

                {/* Content */}
                <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 md:px-16 lg:px-20 flex flex-col justify-end md:justify-center relative z-10 pb-14 md:pb-0">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-brandCyan mb-3 md:mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-brandGold animate-pulse" />
                      <span>{banner.badge}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-3 md:mb-4 drop-shadow-md">
                      {banner.title}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed mb-6 md:mb-8 line-clamp-2 sm:line-clamp-none max-w-xl">
                      {banner.subtitle}
                    </p>

                    <Link
                      href={banner.link}
                      className="inline-flex items-center gap-2 px-7 py-3.5 md:px-9 md:py-4 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-brandViolet via-brandBlue to-brandCyan hover:opacity-95 shadow-xl shadow-brandViolet/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
 * 3. BRAND MARQUEE — Dải logo đối tác ủy quyền cuộn vô hạn
 * ======================================================================== */

const BRANDS = [
  { name: "APPLE AUTHORIZED", color: "#22D3EE", border: "hover:border-brandViolet" },
  { name: "SAMSUNG GALAXY", color: "#2563EB", border: "hover:border-brandBlue" },
  { name: "XIAOMI LEICA", color: "#FF5A5F", border: "hover:border-brandCoral" },
  { name: "OPPO FIND SERIES", color: "#34D399", border: "hover:border-brandMint" },
  { name: "VIVO ZEISS", color: "#22D3EE", border: "hover:border-brandCyan" },
  { name: "REALME GT PRO", color: "#F5C451", border: "hover:border-brandGold" },
  { name: "ASUS ROG PHONE", color: "#EC4899", border: "hover:border-brandPink" },
];

function BrandMarquee() {
  return (
    <section id="brand-marquee-section" className="py-8 border-y border-black/10 dark:border-white/10 bg-surfaceDark/40 marquee-container overflow-hidden relative select-none">
      <div className="max-w-container mx-auto px-4 mb-3.5 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-textSecondary">
          Đối tác Flagship ủy quyền chính thức tại Việt Nam
        </span>
        <span className="text-xs font-mono text-brandMint flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brandMint animate-ping"></span>
          100% Seal Chính Hãng VN/A
        </span>
      </div>

      <div className="marquee-track flex items-center gap-8">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8 shrink-0">
            {BRANDS.map((b, idx) => (
              <div
                key={`${copy}-${idx}`}
                className={`brand-pill group glass-card px-8 py-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 ${b.border}`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                <span className="font-display font-bold text-sm tracking-wider text-textSecondary group-hover:text-textPrimary transition-colors">
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========================================================================
 * 4. BENTO SECTION — Lưới 6 ô đặc quyền thượng lưu với Spotlight 3D
 * ======================================================================== */

const BENTO_CARDS = [
  {
    col: "col-span-12 lg:col-span-5",
    tag: "CHỨNG NHẬN ỦY QUYỀN",
    icon: ShieldCheck,
    highlight: "100%",
    highlightColor: "text-aurora",
    title: "Chính Hãng Nguyên Seal",
    desc: "Đền gấp 200% giá trị nếu phát hiện hàng dựng hoặc đã kích hoạt trước.",
    footer: "IMEI Blockchain Verified • VAT đầy đủ 100%",
  },
  {
    col: "col-span-12 lg:col-span-7",
    tag: "LIVE GPS TRACKING",
    icon: Zap,
    highlight: "Giao Siêu Tốc 2 Giờ",
    highlightColor: "text-brandCyan",
    title: "Chuyên Viên Kỹ Thuật Giao Tận Tay",
    desc: "Hỗ trợ sao chép dữ liệu, dán kính Sapphire và cài đặt bảo mật tại nhà hoặc văn phòng.",
    footer: "● Thời gian trung bình: 74 phút • Miễn phí bảo hiểm vận chuyển 100%",
  },
  {
    col: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "ĐỔI MÁY MỚI",
    icon: RotateCcw,
    highlight: "30 Ngày",
    highlightColor: "text-textPrimary",
    title: "Đổi Trả 1-Đổi-1",
    desc: "Lỗi phần cứng từ nhà sản xuất đổi ngay máy mới nguyên hộp trong 15 phút.",
  },
  {
    col: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "BẢO HIỂM VIP",
    icon: Award,
    highlight: "24 Tháng",
    highlightColor: "text-brandGold",
    title: "Bảo Hành Vàng VIP",
    desc: "Bảo vệ toàn diện cả rơi vỡ màn hình và vào nước, cấp máy dùng tạm miễn phí.",
  },
  {
    col: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "TÀI CHÍNH VIP",
    icon: CreditCard,
    highlight: "0% Lãi Suất",
    highlightColor: "text-brandCyan",
    title: "Trả Góp Duyệt 60 Giây",
    desc: "Qua 32 ngân hàng & Apple Pay, không phí ẩn, không cần chứng minh thu nhập.",
  },
  {
    col: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "TRỢ GIÁ KHỦNG",
    icon: RefreshCw,
    highlight: "+5 Triệu",
    highlightColor: "text-brandMint",
    title: "Thu Cũ Đổi Mới AI",
    desc: "Chẩn đoán ngoại quan bằng AI trong 30 giây, cam kết giá thu cao nhất thị trường.",
  },
];

function BentoSection() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section id="vip-bento-section" className="py-20 max-w-container mx-auto px-4 select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-brandCyan mb-3">
            <span>ĐẶC QUYỀN THƯỢNG LƯU // AETHER CARE+</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-textPrimary">
            Vì Sao <span className="text-aurora">Hơn 250.000+</span> Tín Đồ Chọn MD Mobile?
          </h2>
        </div>
        <p className="text-textSecondary max-w-md text-sm">
          Di chuột lên từng ô để cảm nhận hiệu ứng ánh sáng Spotlight 3D. Mọi chiếc máy bán ra đều kèm chứng nhận số hóa.
        </p>
      </div>

      <div id="bento-grid" className="grid grid-cols-12 gap-5">
        {BENTO_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onMouseMove={handleMouseMove}
              className={`bento-card ${card.col} glass-card rounded-[24px] p-7 flex flex-col justify-between min-h-[250px] border border-black/10 dark:border-white/10`}
            >
              <div className="relative z-10 flex items-center justify-between mb-3">
                <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-white/5 border border-black/10 dark:border-white/10 text-brandCyan">
                  {card.tag}
                </span>
                <Icon className="w-5 h-5 text-brandCyan" />
              </div>

              <div className="relative z-10 my-auto">
                <div className={`font-price font-bold text-3xl md:text-5xl tracking-tight ${card.highlightColor}`}>
                  {card.highlight}
                </div>
                <h3 className="font-display font-bold text-lg md:text-xl mt-1.5 text-textPrimary">
                  {card.title}
                </h3>
                <p className="text-textSecondary text-xs md:text-sm mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {card.footer && (
                <div className="relative z-10 pt-3 border-t border-black/10 dark:border-white/10 text-xs font-mono text-textSecondary">
                  {card.footer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ========================================================================
 * 5. FLASH SALE SECTION — Khung Flash Sale giờ vàng (Chờ tích hợp sản phẩm)
 * ======================================================================== */

function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState(4 * 3600 + 48 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 17339));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <section id="flash-sale-section" className="py-12 max-w-container mx-auto px-4 select-none">
      <div className="rounded-[32px] p-[2px] bg-sunset shadow-[0_25px_90px_-15px_rgba(255,90,95,0.35)]">
        <div className="rounded-[30px] bg-surfaceDark/95 backdrop-blur-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brandCoral/20 blur-[110px] pointer-events-none" />

          {/* Header & Flip Clock */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-black/10 dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brandCoral/20 border border-brandCoral/40 text-brandCoral text-xs font-mono font-bold uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-brandCoral animate-ping" />
                DEAL CHỚP NHOÁNG MỖI NGÀY
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-textPrimary flex items-center gap-3">
                <span>FLASH SALE GIỜ VÀNG</span>
                <span className="text-sunset">— Giảm Đến 9 Triệu</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-textSecondary mr-2">
                Kết thúc sau:
              </span>
              {[
                { val: hours, lbl: "Giờ" },
                { val: minutes, lbl: "Phút" },
                { val: seconds, lbl: "Giây", isPulse: true },
              ].map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="font-price font-bold text-2xl text-brandCoral">:</span>}
                  <div className={`flip-unit glass-card px-3.5 py-2 rounded-2xl text-center border min-w-[62px] ${item.isPulse ? "border-brandCoral/50 bg-brandCoral/10" : "border-black/15 dark:border-white/20"}`}>
                    <div className={`font-price font-bold text-2xl md:text-3xl ${item.isPulse ? "text-brandGold flip-card-pulse" : "text-textPrimary"}`}>
                      {item.val}
                    </div>
                    <div className={`text-[10px] font-mono uppercase ${item.isPulse ? "text-brandCoral font-semibold" : "text-textSecondary"}`}>
                      {item.lbl}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Khung sản phẩm Flash Sale (Placeholder Frame) */}
          <div className="relative z-10 py-16 px-6 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-brandCoral/10 border border-brandCoral/20 flex items-center justify-center text-brandCoral mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-lg text-textPrimary">Khung Sản Phẩm Flash Sale</h3>
            <p className="text-xs font-mono text-textSecondary mt-1 max-w-md">
              Khu vực khung chờ sẵn — danh sách các sản phẩm deal giờ vàng sẽ được hiển thị tại đây khi bạn cần.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
 * 6. FEATURED PRODUCTS — Khung Siêu Phẩm Nổi Bật (Chờ tích hợp sản phẩm)
 * ======================================================================== */

const PRODUCT_CATEGORIES = [
  { id: "all", label: "Tất Cả Siêu Phẩm" },
  { id: "newest", label: "Mới Ra Mắt" },
  { id: "bestseller", label: "Bán Chạy Nhất" },
  { id: "camera", label: "Chuyên Gia Nhiếp Ảnh" },
  { id: "gaming", label: "Quái Vật Gaming" },
  { id: "value", label: "Giá Tốt Nhất" },
];

function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <section id="featured-section" className="py-20 max-w-container mx-auto px-4 select-none">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-brandViolet mb-3">
            <span>BỘ SƯU TẬP 2026 // CURATED FLAGSHIPS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-textPrimary">
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
                  : "text-textSecondary hover:text-textPrimary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Khung danh sách sản phẩm nổi bật (Placeholder Frame) */}
      <div className="py-20 px-6 rounded-3xl border-2 border-dashed border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-brandViolet/10 border border-brandViolet/20 flex items-center justify-center text-brandViolet mb-3">
          <Sparkles className="w-7 h-7 animate-pulse" />
        </div>
        <h3 className="font-display font-bold text-xl text-textPrimary">Khung Danh Sách Sản Phẩm</h3>
        <p className="text-xs font-mono text-textSecondary mt-1.5 max-w-md">
          Khu vực khung chờ sẵn — danh mục và lưới thẻ sản phẩm Flagship sẽ được tích hợp tại đây khi bạn cần.
        </p>
      </div>
    </section>
  );
}

/* ========================================================================
 * 7. TRADE-IN SECTION — Thu Cũ Đổi Mới & Trả Góp 0%
 * ======================================================================== */

function TradeInSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValuation, setSelectedValuation] = useState(24500000);
  const totalValuation = selectedValuation + 5000000;

  const handleConfirmTradeIn = () => {
    setIsModalOpen(false);
    showToast("Đặt lịch thu máy thành công!", `Kỹ thuật viên VIP sẽ liên hệ thẩm định tận nơi. Giá dự kiến: ${totalValuation.toLocaleString("vi-VN")}₫`);
  };

  return (
    <>
      <section id="trade-in-section" className="py-16 max-w-container mx-auto px-4 select-none">
        <div className="grid grid-cols-12 gap-6">
          {/* Card 1: Thu Cũ */}
          <div
            className="col-span-12 lg:col-span-6 rounded-[28px] p-8 md:p-10 border border-black/10 dark:border-white/15 flex flex-col justify-between min-h-[340px]"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.28) 0%, rgba(15,16,32,0.92) 60%, rgba(236,72,153,0.25) 100%)" }}
          >
            <div className="space-y-3 max-w-md">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-brandGold/20 text-brandGold border border-brandGold/40">
                THU CŨ ĐỔI MỚI AI 30 GIÂY
              </span>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-white">
                Lên Đời Siêu Phẩm <br />
                <span className="text-sunset">Trợ Giá Đến 5 Triệu</span>
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Chấp nhận mọi tình trạng máy cũ. Thẩm định AI trong 30 giây, trừ trực tiếp vào giá máy mới.
              </p>
            </div>

            <div className="pt-6 flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 rounded-full bg-sunset text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
              >
                Định Giá Máy Cũ Ngay →
              </button>
            </div>
          </div>

          {/* Card 2: Trả Góp */}
          <div
            className="col-span-12 lg:col-span-6 rounded-[28px] p-8 md:p-10 border border-black/10 dark:border-white/15 flex flex-col justify-between min-h-[340px]"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.28) 0%, rgba(15,16,32,0.92) 60%, rgba(34,211,238,0.25) 100%)" }}
          >
            <div className="space-y-3 max-w-md">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-brandCyan/20 text-brandCyan border border-brandCyan/40">
                TÀI CHÍNH LINH HOẠT VIP
              </span>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-white">
                Trả Trước <span className="text-aurora">0 Đồng</span> <br />
                Kỳ Hạn Đến 24 Tháng
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Duyệt hồ sơ tự động bằng CCCD gắn chip trong 60 giây. 0% lãi suất qua 32 ngân hàng đối tác.
              </p>
            </div>

            <div className="pt-6 flex items-center gap-4">
              <a
                href="#featured-section"
                className="px-6 py-3.5 rounded-full bg-aurora text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
              >
                Tính Khoản Trả Hàng Tháng →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trade-in AI Estimator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-[28px] max-w-lg w-full p-8 border border-black/10 dark:border-white/20 space-y-5 relative bg-[var(--bg-surface)] shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full glass-card flex items-center justify-center text-textSecondary hover:text-textPrimary"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono uppercase tracking-widest text-brandGold">
              CHẨN ĐOÁN GIÁ THU CŨ AI 30 GIÂY
            </div>
            <h3 className="font-display font-extrabold text-2xl text-textPrimary">
              Định Giá Máy Cũ Của Bạn
            </h3>
            <div className="space-y-2">
              <label className="block text-xs font-mono text-textSecondary">
                Chọn dòng máy đang sử dụng:
              </label>
              <select
                value={selectedValuation}
                onChange={(e) => setSelectedValuation(Number(e.target.value))}
                className="w-full h-12 rounded-xl bg-surfaceDark border border-black/10 dark:border-white/15 px-4 text-sm text-textPrimary focus:outline-none focus:border-brandCyan"
              >
                <option value={24500000}>iPhone 15 Pro Max 256GB (Thu tới 24.500.000₫ + Trợ giá 5Tr)</option>
                <option value={21000000}>Samsung Galaxy S24 Ultra (Thu tới 21.000.000₫ + Trợ giá 5Tr)</option>
                <option value={16500000}>Xiaomi 14 Ultra 5G (Thu tới 16.500.000₫ + Trợ giá 4Tr)</option>
                <option value={14800000}>OPPO Find X7 Ultra (Thu tới 14.800.000₫ + Trợ giá 4Tr)</option>
              </select>
            </div>
            <div className="p-4 rounded-2xl bg-brandMint/10 border border-brandMint/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-textSecondary">Tổng giá trị thu + trợ giá dự kiến:</div>
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
              className="w-full h-12 py-3 rounded-full bg-aurora text-white font-display font-bold text-sm hover:opacity-90 transition-opacity"
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
 * 8. NEED ACCORDION — Chọn theo nhu cầu
 * ======================================================================== */

const NEEDS = [
  {
    id: 0,
    code: "01 // PHOTOGRAPHY",
    badge: "200MP LEICA / ZEISS",
    badgeColor: "text-brandCoral",
    title: "Nhiếp Ảnh & Quay Phim 8K",
    desc: "Cảm biến 1-inch, chống rung Gimbal OIS và màu film điện ảnh chân thực cho nhà sáng tạo.",
    suggest: "Xiaomi 15 Ultra • iPhone 16 Pro Max",
    bg: "radial-gradient(circle at 70% 30%, rgba(255,90,95,0.45), rgba(15,16,32,0.95) 75%)",
  },
  {
    id: 1,
    code: "02 // GAMING",
    badge: "144HZ + TẢN NHIỆT KHÍ",
    badgeColor: "text-brandCyan",
    title: "Hardcore Gaming Không Giật Lag",
    desc: "Tản nhiệt buồng hơi 3D, phím trigger siêu âm và khung hình khóa cứng 144FPS suốt 6 giờ.",
    suggest: "ROG Phone 9 Pro • RedMagic 9S Pro",
    bg: "radial-gradient(circle at 70% 30%, rgba(34,211,238,0.45), rgba(15,16,32,0.95) 75%)",
  },
  {
    id: 2, 
    code: "03 // EXECUTIVE AI",
    badge: "BẢO MẬT DOANH NHÂN",
    badgeColor: "text-brandGold",
    title: "Doanh Nhân & Trợ Lý AI",
    desc: "Dịch thuật cuộc gọi trực tiếp 42 ngôn ngữ, tóm tắt họp bằng AI và khung Titan siêu bền.",
    suggest: "Galaxy Z Fold6 • Galaxy S25 Ultra",
    bg: "radial-gradient(circle at 70% 30%, rgba(124,58,237,0.45), rgba(15,16,32,0.95) 75%)",
  },
  {
    id: 3,
    code: "04 // BATTERY LIFE",
    badge: "6.500MAH + 120W",
    badgeColor: "text-brandMint",
    title: "Pin 3 Ngày & Sạc Siêu Tốc",
    desc: "Công nghệ pin Silicon-Carbon thế hệ mới siêu mỏng, sạc đầy 100% chỉ trong 17 phút.",
    suggest: "Vivo X200 Pro • OPPO Find X8 Pro",
    bg: "radial-gradient(circle at 70% 30%, rgba(52,211,153,0.42), rgba(15,16,32,0.95) 75%)",
  },
];

function NeedAccordionSection() {
  const [activeNeed, setActiveNeed] = useState(0);

  return (
    <section className="py-20 max-w-container mx-auto px-4 select-none">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-brandPink mb-3">
          <span>CÁ NHÂN HÓA TRẢI NGHIỆM // AI ADVISOR</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-textPrimary">
          Chọn Máy Theo <span className="text-aurora">Đúng Chất Của Bạn</span>
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[380px]">
        {NEEDS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveNeed(item.id)}
            onMouseEnter={() => setActiveNeed(item.id)}
            className={`need-accordion-card relative rounded-[24px] overflow-hidden border border-black/10 dark:border-white/15 p-7 flex flex-col justify-between cursor-pointer min-h-[240px] transition-all duration-500 ${
              activeNeed === item.id ? "active-need" : ""
            }`}
            style={{ background: item.bg }}
          >
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
              <div className="pt-2 text-xs font-mono text-brandCyan">
                Gợi ý: {item.suggest}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========================================================================
 * 9. ARTICLES SECTION — Tạp chí công nghệ MD Journal
 * ======================================================================== */

const ARTICLES = [
  {
    title: "Vì sao tiến trình 3nm thế hệ thứ 2 thay đổi hoàn toàn nhiếp ảnh điện toán?",
    category: "Phân tích phần cứng",
    date: "12 Tháng 05, 2026 • 6 phút đọc",
    tag: "3nm NPU",
    color: "from-brandViolet/60 via-[#0F1020] to-brandCyan/60",
  },
  {
    title: "Đọ sức Zoom quang 10X tại Sài Gòn về đêm: Khi Flagship vượt qua máy ảnh Mirrorless",
    category: "Nhiếp ảnh di động",
    date: "09 Tháng 05, 2026 • 8 phút đọc",
    tag: "200MP PERISCOPE",
    color: "from-brandCoral/60 via-[#0F1020] to-brandGold/60",
  },
  {
    title: "Bí mật đằng sau viên pin Silicon-Carbon 6.000mAh trong thân máy mỏng chỉ 8.1mm",
    category: "Công nghệ Pin",
    date: "04 Tháng 05, 2026 • 5 phút đọc",
    tag: "6.000mAh Si-C",
    color: "from-brandMint/60 via-[#0F1020] to-brandBlue/60",
  },
];

function ArticlesSection() {
  return (
    <section className="py-20 max-w-container mx-auto px-4 select-none">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brandCyan">
            TẠP CHÍ CÔNG NGHỆ // MD JOURNAL
          </span>
          <h3 className="font-display font-extrabold text-3xl md:text-4xl mt-1 text-textPrimary">
            Góc Nhìn Chuyên Sâu
          </h3>
        </div>
        <button
          onClick={() => showToast("MD Journal", "Toàn bộ bài viết chuyên sâu đang được đồng bộ hóa.")}
          className="text-xs font-mono uppercase tracking-wider text-brandCyan hover:underline flex items-center gap-1"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {ARTICLES.map((article, idx) => (
          <article
            key={idx}
            onClick={() => showToast("Đang mở bài viết", article.title)}
            className="col-span-12 md:col-span-4 glass-card rounded-[24px] overflow-hidden group cursor-pointer flex flex-col justify-between border border-black/10 dark:border-white/10 hover:-translate-y-1 transition-all"
          >
            <div className="h-48 overflow-hidden relative bg-[#111328]">
              <div className={`w-full h-full bg-gradient-to-br ${article.color} flex items-center justify-center transition-transform duration-700 ease-expo group-hover:scale-110`}>
                <span className="font-price font-bold text-xl text-white px-4 py-2 rounded-2xl glass-card border border-white/20">
                  {article.tag}
                </span>
              </div>
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-white">
                {article.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-textSecondary mb-2">{article.date}</div>
                <h4 className="font-display font-bold text-base md:text-lg group-hover:text-brandCyan transition-colors text-textPrimary line-clamp-2">
                  {article.title}
                </h4>
              </div>
              <div className="pt-4 mt-4 border-t border-black/10 dark:border-white/10 text-xs font-semibold text-brandCyan flex items-center justify-between">
                <span>Đọc bài phân tích</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ========================================================================
 * MAIN PAGE COMPONENT: HOMEPAGE
 * ======================================================================== */

interface DBBannerRow {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string;
  image_url?: string;
  image?: string;
  linkUrl?: string | null;
  link_url?: string | null;
}

export default function HomePage() {
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);

  // Tự động tải banner thật từ MySQL qua API
  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch("/api/banners");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: HeroBannerItem[] = (json.data as DBBannerRow[]).map((b, idx) => ({
            id: idx + 1,
            title: b.title,
            subtitle: b.subtitle || "Khám phá siêu phẩm công nghệ đỉnh cao tại MD Mobile Flagship Store",
            image: b.imageUrl || b.image_url || b.image || "/images/banners/banner-1.jpg",
            badge: "FLAGSHIP MỚI 2026",
            ctaText: "Khám Phá Ngay",
            link: b.linkUrl || b.link_url || "#featured-section",
            accentColor: "from-brandViolet/30 via-transparent to-brandCyan/20",
          }));
          setBanners(mapped);
        }
      } catch (err) {
        console.error("Lỗi tải banners:", err);
      }
    }

    loadBanners();
  }, []);

  return (
    <main className="min-h-screen bg-bgDark text-textPrimary relative flex flex-col justify-between overflow-x-hidden">
      {/* 0. Màn hình loading chuyển cảnh */}
      <LoadingScreen />

      {/* 1. Thanh thông báo chạy vô hạn */}
      <AnnouncementBar />

      {/* 2. Header cố định tràn viền */}
      <Header />

      {/* 3. Hero Slider Banner chính */}
      <HeroSlider banners={banners} />

      {/* 4. Marquee thương hiệu ủy quyền */}
      <BrandMarquee />

      {/* 5. Bento Grid 6 ô đặc quyền thượng lưu */}
      <BentoSection />

      {/* 6. Khung Flash Sale giờ vàng */}
      <FlashSaleSection />

      {/* 7. Khung Siêu phẩm nổi bật */}
      <FeaturedProductsSection />

      {/* 8. Banner Thu cũ đổi mới & Trả góp 0% */}
      <TradeInSection />

      {/* 9. Chọn máy theo nhu cầu */}
      <NeedAccordionSection />

      {/* 10. Tạp chí công nghệ MD Journal */}
      <ArticlesSection />

      {/* 11. Dark Luxury Footer */}
      <Footer />

      {/* 12. Floating Action Icons (Messenger, Zalo, Map, Scroll To Top) */}
      <FloatingActions />
    </main>
  );
}
