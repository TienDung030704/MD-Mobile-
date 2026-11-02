"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { showToast } from "@/components/ui/toast-box";
import type { FeaturedProduct } from "@/types";

interface NavLinkItem {
  href: string;
  label: string;
  isPulse?: boolean;
  isGold?: boolean;
}

interface HeaderProps {
  cartCount?: number;
  searchProducts?: FeaturedProduct[];
}

export function Header({ cartCount = 2, searchProducts = [] }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const navRef = useRef<HTMLElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navLinks: NavLinkItem[] = [
    { href: "#hero-section", label: "Flagship", isPulse: false },
    { href: "#flash-sale-section", label: "Flash Sale", isPulse: true },
    { href: "#featured-section", label: "Sản phẩm", isPulse: false },
    { href: "#scroll-story-section", label: "Công nghệ AI", isPulse: false },
    { href: "#trade-in-section", label: "Thu cũ đổi mới", isPulse: false },
  ];

  // Update underline position
  const updateUnderline = (index: number) => {
    const el = navItemsRef.current[index];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setUnderlineStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
      setActiveNavIndex(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => updateUnderline(0), 300);
    return () => clearTimeout(timer);
  }, []);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const nextState = !isLightMode;
    setIsLightMode(nextState);
    if (nextState) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  // Motion toggle
  const toggleMotion = () => {
    const nextState = !isReducedMotion;
    setIsReducedMotion(nextState);
    if (nextState) {
      document.body.classList.add("reduced-motion");
      showToast("Chế độ tiết kiệm chuyển động", "Đã bật Reduced Motion");
    } else {
      document.body.classList.remove("reduced-motion");
      showToast("Hiệu ứng chuyển động", "Đã bật 60FPS Full Motion");
    }
  };

  const filteredProducts = searchQuery.trim()
    ? searchProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchProducts.slice(0, 4);

  return (
    <header
      id="main-header"
      className={`sticky top-0 left-0 right-0 w-full z-[100] transition-all duration-300 border-b border-white/10 bg-[#07070F]/90 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none ${
        isScrolled ? "h-[58px]" : "h-[66px]"
      }`}
    >
      <div className="w-full h-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-aurora p-[1px] transition-transform duration-400 ease-expo group-hover:rotate-12 group-hover:scale-105">
            <div className="w-full h-full bg-[#07070F] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 5L34 31H27L20 18L13 31H6L20 5Z"
                  fill="url(#navLogoGrad)"
                />
                <circle cx="20" cy="27" r="3" fill="#22D3EE" />
                <defs>
                  <linearGradient
                    id="navLogoGrad"
                    x1="6"
                    y1="5"
                    x2="34"
                    y2="31"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7C3AED" />
                    <stop offset="0.5" stopColor="#2563EB" />
                    <stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-[0.14em] leading-none text-white">
              MD Mobile
            </span>
          </div>
        </Link>

          {/* Navigation Menu */}
          <nav
            ref={navRef}
            id="header-nav"
            className="relative hidden lg:flex items-center gap-[28px] whitespace-nowrap py-2"
          >
            {navLinks.map((link, idx) => (
              <a
                key={link.href}
                ref={(el) => {
                  navItemsRef.current[idx] = el;
                }}
                href={link.href}
                onMouseEnter={() => updateUnderline(idx)}
                className={`nav-link text-sm font-medium py-1 transition-opacity ${
                  link.isGold
                    ? "text-brandGold hover:opacity-100"
                    : activeNavIndex === idx
                    ? "text-white opacity-100"
                    : "text-textSecondary hover:text-white opacity-85 hover:opacity-100"
                } flex items-center gap-1.5`}
              >
                {link.isPulse && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brandCoral animate-pulse"></span>
                )}
                {link.label}
              </a>
            ))}

            {/* Sliding Underline */}
            <div
              id="nav-underline"
              className="absolute bottom-0 h-[2.5px] rounded-full bg-aurora transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
              }}
            />
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Expanding Search Input */}
            <div className="relative">
              <div
                id="search-wrapper"
                className={`flex items-center glass-pill px-3.5 py-1.5 transition-all duration-300 ease-out ${
                  isSearchOpen
                    ? "w-[240px] border-brandCyan/60 bg-[#0F1020]/90"
                    : "w-[150px] sm:w-[160px]"
                }`}
              >
                <svg
                  className="w-4 h-4 text-textSecondary shrink-0 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Tìm flagship..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 250)}
                  className="bg-transparent text-xs focus:outline-none w-full placeholder:text-textSecondary text-white"
                  autoComplete="off"
                />
              </div>

              {/* Live Search Suggestions Dropdown */}
              {isSearchOpen && (
                <div
                  id="search-dropdown"
                  className="absolute right-0 mt-3 w-[320px] sm:w-[350px] glass-card rounded-2xl p-3 shadow-2xl z-50 border border-white/10 bg-[#0F1020]/95 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/10">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-textSecondary">
                      Gợi ý AI thông minh
                    </span>
                    <span className="text-[11px] text-brandCyan font-mono">
                      Fast Search
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                    {filteredProducts.map((p) => (
                      <a
                        key={p.id}
                        href="#featured-section"
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ backgroundColor: p.blob }}
                          >
                            AI
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-brandCyan transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-textSecondary">
                              {p.specs.join(" • ")}
                            </div>
                          </div>
                        </div>
                        <div className="font-price font-bold text-xs text-brandGold">
                          {p.price}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reduced Motion Toggle */}
            <button
              onClick={toggleMotion}
              title="Chế độ chuyển động (60FPS / Tiết kiệm)"
              className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:border-brandCyan/50 transition-all text-xs font-mono text-textSecondary hover:text-brandCyan"
            >
              <span>{isReducedMotion ? "ECO" : "60F"}</span>
            </button>

            {/* Light / Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Chuyển giao diện Sáng / Tối"
              className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:border-brandViolet/60 transition-all duration-300"
            >
              {isLightMode ? (
                <svg
                  className="w-4 h-4 text-brandGold"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-brandCyan"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-button"
              onClick={() => showToast("Giỏ hàng của bạn", `Hiện có ${cartCount} sản phẩm sẵn sàng thanh toán.`)}
              className="relative h-9 px-3.5 rounded-full bg-aurora text-white flex items-center gap-2 text-xs font-semibold shadow-[0_0_24px_rgba(124,58,237,0.45)] hover:shadow-[0_0_32px_rgba(34,211,238,0.65)] transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span
                id="cart-badge"
                className="font-mono font-bold text-xs px-1.5 py-0.5 rounded-full bg-black/40 transition-transform duration-300"
              >
                {cartCount}
              </span>
            </button>
          </div>
      </div>
    </header>
  );
}
