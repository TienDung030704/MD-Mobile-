"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Phone,
  Truck,
  ShoppingBag,
  User,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Watch,
  Laptop,
  Headphones,
  Cable,
  ArrowLeftRight,
  Newspaper,
} from "lucide-react";
import { showToast } from "@/components/ui/toast-box";
import { useThemeToggle } from "@/utils/theme-toggle";
import type { FeaturedProduct } from "@/types";

interface HeaderProps {
  cartCount?: number;
  searchProducts?: FeaturedProduct[];
}

// Danh mục menu hàng 2 (Chuẩn theo bố cục và icon của MD Mobile)
const NAV_CATEGORIES = [
  {
    label: "iPhone đã qua sử dụng",
    href: "/products?type=used",
    icon: Smartphone,
  },
  {
    label: "iPhone New",
    href: "/products?type=new",
    icon: Smartphone,
  },
  {
    label: "iPad",
    href: "/products?category=ipad",
    icon: Tablet,
  },
  {
    label: "Watch",
    href: "/products?category=watch",
    icon: Watch,
  },
  {
    label: "Mac",
    href: "/products?category=mac",
    icon: Laptop,
  },
  {
    label: "AirPods",
    href: "/products?category=airpods",
    icon: Headphones,
  },
  {
    label: "Phụ kiện",
    href: "/products?category=accessories",
    icon: Cable,
  },
  {
    label: "Trade-In",
    href: "/#trade-in-section",
    icon: ArrowLeftRight,
  },
  {
    label: "Tin Tức",
    href: "/news",
    icon: Newspaper,
  },
];

export function Header({ cartCount = 0, searchProducts = [] }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isLight: isLightMode, toggleTheme: handleToggleTheme } = useThemeToggle();

  // Bật/tắt Dark Mode kèm Toast thông báo
  const toggleTheme = () => {
    handleToggleTheme((isDark) => {
      if (isDark) {
        showToast("Chế độ tối", "Đã chuyển sang giao diện Dark Flagship");
      } else {
        showToast("Chế độ sáng", "Đã chuyển sang giao diện Light Luxury");
      }
    });
  };

  // Gợi ý tìm kiếm nhanh
  const filteredProducts = searchQuery.trim()
    ? searchProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchProducts.slice(0, 4);

  return (
    <header
      id="main-header"
      className="sticky top-0 left-0 right-0 w-full z-[100] transition-colors duration-300 shadow-sm select-none"
    >
      {/* =======================================================================
          HÀNG 1: LOGO + THANH TÌM KIẾM + HOTLINE + GIỎ HÀNG + TIỆN ÍCH
          ======================================================================= */}
      <div className="w-full bg-surfaceDark/95 backdrop-blur-xl border-b border-[var(--header-border)]">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* 1. Logo Thương hiệu */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-aurora p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[var(--bg-primary)] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 5L34 31H27L20 18L13 31H6L20 5Z"
                    fill="url(#headerLogoGrad)"
                  />
                  <circle cx="20" cy="27" r="3" fill="#D87D56" />
                  <defs>
                    <linearGradient
                      id="headerLogoGrad"
                      x1="6"
                      y1="5"
                      x2="34"
                      y2="31"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#7F9C8B" />
                      <stop offset="0.6" stopColor="#688574" />
                      <stop offset="1" stopColor="#D87D56" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg sm:text-xl tracking-wider text-textPrimary uppercase">
                MD <span className="text-brandClay">Mobile</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-textSecondary uppercase hidden sm:block">
                Flagship Store
              </span>
            </div>
          </Link>

          {/* 2. Thanh tìm kiếm tiêu chuẩn (Rộng rãi, cố định, không co giãn khi bấm) */}
          <div className="relative w-[200px] sm:w-[300px] md:w-[380px] lg:w-[420px] mx-1 sm:mx-2">
            <div
              id="search-wrapper"
              className="flex items-center w-full rounded-full border border-[var(--header-border)] bg-bgDark px-3.5 sm:px-4 py-2 hover:border-brandSage/60 focus-within:border-brandSage focus-within:ring-2 focus-within:ring-brandSage/20 transition-all shadow-inner"
            >
              <Search className="w-4 h-4 text-textSecondary shrink-0 mr-2 sm:mr-2.5" />
              <input
                id="search-input"
                type="text"
                placeholder="Tìm kiếm điện thoại, phụ kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 250)}
                className="bg-transparent text-xs sm:text-sm focus:outline-none w-full placeholder:text-textSecondary/70 text-textPrimary"
                autoComplete="off"
              />
            </div>

            {/* Menu gợi ý sản phẩm khi tìm kiếm */}
            {isSearchOpen && (
              <div
                id="search-dropdown"
                className="absolute left-0 right-0 top-full mt-2 w-full glass-card rounded-2xl p-3 shadow-2xl z-50 border border-[var(--header-border)] bg-[var(--bg-surface)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[var(--header-border)]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-textSecondary">
                    Gợi ý sản phẩm
                  </span>
                  <span className="text-[11px] text-brandSage font-mono">
                    Fast Search
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                  {filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      href="/products"
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: p.blob }}
                        >
                          MD
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-textPrimary group-hover:text-brandSage transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-textSecondary">
                            {p.specs.join(" • ")}
                          </div>
                        </div>
                      </div>
                      <div className="font-price font-bold text-xs text-brandClay">
                        {p.price}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Khu vực bên phải: HOTLINE + GIỎ HÀNG + CHUYỂN THEME / USER */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Widget HOTLINE */}
            <a
              href="tel:0903232323"
              className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer"
              title="Gọi Hotline tư vấn"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brandClay/25 to-brandClay/10 border border-brandClay/30 flex items-center justify-center text-brandClay group-hover:scale-105 transition-transform shrink-0 shadow-xs">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[10px] font-black uppercase text-textSecondary tracking-wider leading-none mb-1">
                  HOTLINE
                </span>
                <span className="text-xs sm:text-sm font-black text-brandClay tracking-tight leading-none group-hover:underline">
                  0903 23 23 23
                </span>
              </div>
            </a>

            {/* Widget TRA CỨU ĐƠN HÀNG */}
            <Link
              href="/orders"
              className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer"
              title="Tra cứu tình trạng đơn hàng"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brandSage/25 to-brandSage/10 border border-brandSage/30 flex items-center justify-center text-brandSage group-hover:scale-105 transition-transform shrink-0 shadow-xs">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] font-black uppercase text-textSecondary tracking-wider leading-none mb-1">
                  TRA CỨU
                </span>
                <span className="text-xs sm:text-sm font-black text-brandSage tracking-tight leading-none group-hover:underline">
                  ĐƠN HÀNG
                </span>
              </div>
            </Link>

            {/* Widget GIỎ HÀNG */}
            <Link
              href="/cart"
              id="cart-button"
              className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer"
              title="Xem giỏ hàng"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brandSage/25 to-brandSage/10 border border-brandSage/30 flex items-center justify-center text-brandSage group-hover:scale-105 transition-transform shrink-0 shadow-xs">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span
                    id="cart-badge"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brandClay text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] font-black uppercase text-brandClay tracking-wider leading-none mb-1">
                  GIỎ HÀNG
                </span>
                <span className="text-xs sm:text-sm font-bold text-textPrimary tracking-tight leading-none">
                  CỦA BẠN
                </span>
              </div>
            </Link>

            {/* Phím đổi giao diện Sáng / Tối */}
            <button
              onClick={toggleTheme}
              aria-label="Chuyển giao diện Sáng / Tối"
              className="w-9 h-9 rounded-xl border border-[var(--header-border)] bg-bgDark flex items-center justify-center hover:border-brandClay/50 transition-all text-textSecondary hover:text-brandClay cursor-pointer"
            >
              {isLightMode ? (
                <Sun className="w-4 h-4 text-brandClay" />
              ) : (
                <Moon className="w-4 h-4 text-brandSage" />
              )}
            </button>

            {/* Nút Đăng nhập / Tài khoản */}
            <Link
              href="/login"
              title="Tài khoản cá nhân"
              className="w-9 h-9 rounded-xl border border-[var(--header-border)] bg-bgDark flex items-center justify-center hover:border-brandSage/50 transition-all text-textSecondary hover:text-brandSage"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* =======================================================================
          HÀNG 2: THANH DANH MỤC SẢN PHẨM (MÀU CHỦ ĐẠO GRADIENT BRAND CLAY & SAGE)
          ======================================================================= */}
      <nav
        aria-label="Danh mục sản phẩm"
        className="w-full bg-gradient-to-r from-brandClay via-[#B8846E] to-brandSage text-white shadow-md overflow-x-auto scrollbar-none"
      >
        <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8 py-2.5 flex items-center justify-start lg:justify-between gap-1 sm:gap-2 whitespace-nowrap min-w-max lg:min-w-0">
          {NAV_CATEGORIES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/95 hover:text-white hover:bg-white/20 active:bg-white/25 transition-all cursor-pointer drop-shadow-xs"
              >
                <Icon className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
