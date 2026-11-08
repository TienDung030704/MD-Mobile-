"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { FloatingActions } from "@/components/common/floating-actions";
import {
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  ShoppingCart,
  RotateCcw,
  Cpu,
  Layers,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type {
  ProductViewMode,
  ProductFilterAccordionState,
} from "@/types/product";

export default function ProductsPage() {
  // 1. Chế độ xem: 'grid' (lưới 3 cột) hoặc 'list' (danh sách ngang)
  const [viewMode, setViewMode] = useState<ProductViewMode>("grid");

  // 2. Khoảng giá (triệu đồng)
  const [maxPrice, setMaxPrice] = useState<number>(50);

  // 3. Trạng thái đóng/mở của các mục accordion bên cột lọc
  const [openAccordions, setOpenAccordions] = useState<ProductFilterAccordionState>({
    brand: true,
    price: true,
    ram: true,
    storage: true,
    specs: true,
    features: true,
    colors: true,
  });

  // Hàm chuyển đổi trạng thái đóng / mở của từng accordion
  const toggleAccordion = (key: keyof ProductFilterAccordionState) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Hàm đặt lại toàn bộ bộ lọc về mặc định
  const handleResetFilters = () => {
    setMaxPrice(50);
  };

  return (
    <div className="min-h-screen bg-bgDark text-textPrimary flex flex-col justify-between selection:bg-brandSage selection:text-white">
      {/* 1. Header dùng chung của trang web */}
      <Header />

      {/* 2. Nội dung chính của trang sản phẩm */}
      <main className="w-full max-w-[1440px] mx-auto pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-[1240px] mx-auto">
          {/* =========================================================
              PHẦN A: BREADCRUMB (THANH ĐIỀU HƯỚNG VỊ TRÍ)
              ========================================================= */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-textSecondary mb-5"
          >
            <Link
              href="/"
              className="hover:text-brandSage transition-colors"
            >
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-textSecondary">Điện thoại</span>
            <span>/</span>
            <span className="text-brandClay font-semibold">Tất cả sản phẩm</span>
          </nav>

          {/* =========================================================
              PHẦN B: BANNER DANH MỤC (NORDIC SAGE & CLAY PALETTE)
              ========================================================= */}
          <section className="relative w-full rounded-2xl overflow-hidden mb-6 p-6 md:p-8 bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 shadow-xl">
            {/* Lớp nền phát sáng nhẹ tone Sage và Clay */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brandSage/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brandClay/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                {/* Huy hiệu nhỏ trên tiêu đề */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brandSage/20 text-brandSage border border-brandSage/30">
                    Flagship Store Chính Hãng
                  </span>
                </div>

                {/* Tiêu đề danh mục */}
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-textPrimary mb-2">
                  Bộ Sưu Tập Điện Thoại Cao Cấp
                </h1>

                {/* Mô tả danh mục */}
                <p className="text-sm text-textSecondary leading-relaxed">
                  Trải nghiệm công nghệ AI đỉnh cao cùng đặc quyền mua sắm: Trả góp
                  0%, Bảo hành 1 đổi 1 trong 30 ngày và Thu cũ trợ giá đến 5
                  Triệu đồng.
                </p>
              </div>

              {/* Nút hành động xem nhanh */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brandClay/15 text-brandClay border border-brandClay/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ưu đãi độc quyền hôm nay
                </span>
              </div>
            </div>
          </section>

          {/* =========================================================
              PHẦN C: BỐ CỤC 2 CỘT CHÍNH (SIDEBAR TRÁI + NỘI DUNG PHẢI)
              ========================================================= */}
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* -------------------------------------------------------
                CỘT TRÁI (288PX): BỘ LỌC CHUYÊN SÂU (SIDEBAR WIREFRAME)
                ------------------------------------------------------- */}
            <aside className="w-full lg:w-72 shrink-0 bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 rounded-2xl p-5 space-y-4 lg:sticky lg:top-24">
              {/* Tiêu đề sidebar và nút xoá bộ lọc */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10 border-stone-200">
                <div className="flex items-center gap-2 font-bold text-sm text-textPrimary">
                  <SlidersHorizontal className="w-4 h-4 text-brandSage" />
                  <span>Bộ lọc chuyên sâu</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-brandClay hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  Xóa lọc
                </button>
              </div>

              {/* MỤC 1: HÃNG SẢN XUẤT (KHUNG WIREFRAME) */}
              <div className="border-b border-white/10 dark:border-white/10 border-stone-200 pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("brand")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textSecondary hover:text-textPrimary mb-3"
                >
                  <span>Hãng sản xuất</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordions.brand ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordions.brand && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-9 px-3 rounded-xl border border-white/10 dark:border-white/10 border-stone-200 bg-white/5 flex items-center justify-center"
                      >
                        <div className="h-3 w-14 rounded bg-white/10 dark:bg-white/10 bg-stone-200" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MỤC 2: KHOẢNG GIÁ (SLIDER GIAO DIỆN) */}
              <div className="border-b border-white/10 dark:border-white/10 border-stone-200 pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("price")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textSecondary hover:text-textPrimary mb-3"
                >
                  <span>Khoảng giá</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordions.price ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordions.price && (
                  <div className="pt-2 pb-1 space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={1}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-brandClay cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-xs font-mono text-textSecondary">
                      <span>0đ</span>
                      <span className="font-bold text-brandClay">
                        Đến: {maxPrice}.000.000đ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* MỤC 3: DUNG LƯỢNG RAM (KHUNG WIREFRAME) */}
              <div className="border-b border-white/10 dark:border-white/10 border-stone-200 pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("ram")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textSecondary hover:text-textPrimary mb-3"
                >
                  <span>Dung lượng RAM</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordions.ram ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordions.ram && (
                  <div className="space-y-2.5 text-xs">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded border border-white/20 bg-white/5" />
                        <div className="h-3.5 w-20 rounded bg-white/10 dark:bg-white/10 bg-stone-200" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MỤC 4: BỘ NHỚ TRONG (KHUNG WIREFRAME) */}
              <div className="border-b border-white/10 dark:border-white/10 border-stone-200 pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("storage")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textSecondary hover:text-textPrimary mb-3"
                >
                  <span>Bộ nhớ trong</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordions.storage ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordions.storage && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-8 rounded-lg border border-white/10 dark:border-white/10 border-stone-200 bg-white/5 flex items-center justify-center"
                      >
                        <div className="h-3 w-12 rounded bg-white/10 dark:bg-white/10 bg-stone-200" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MỤC 5: TÍNH NĂNG CAO CẤP (KHUNG WIREFRAME) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("features")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textSecondary hover:text-textPrimary mb-3"
                >
                  <span>Tính năng cao cấp</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordions.features ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordions.features && (
                  <div className="space-y-2.5 text-xs">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded border border-white/20 bg-white/5" />
                        <div className="h-3.5 w-28 rounded bg-white/10 dark:bg-white/10 bg-stone-200" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* -------------------------------------------------------
                CỘT PHẢI (FLEX-1): TOOLBAR + KHUNG DANH SÁCH SẢN PHẨM
                ------------------------------------------------------- */}
            <div className="flex-1 w-full min-w-0">
              {/* TOOLBAR: TIÊU ĐỀ KHUNG + SẮP XẾP + CHUYỂN GRID/LIST */}
              <div className="bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 rounded-2xl px-5 py-3.5 mb-5 flex flex-wrap items-center justify-between gap-4">
                {/* Tiêu đề khung danh sách */}
                <div className="text-sm font-semibold text-textPrimary">
                  Danh sách sản phẩm
                </div>

                {/* Hành động: Dropdown sắp xếp và nút chuyển dạng xem */}
                <div className="flex items-center gap-3">
                  {/* Dropdown sắp xếp */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-textSecondary hidden sm:inline">
                      Sắp xếp:
                    </span>
                    <select
                      defaultValue="featured"
                      aria-label="Sắp xếp sản phẩm"
                      className="h-9 px-3 rounded-xl bg-white/5 border border-white/15 dark:border-white/15 border-stone-300 text-textPrimary focus:outline-none focus:border-brandSage text-xs cursor-pointer"
                    >
                      <option value="featured" className="bg-surfaceDark text-textPrimary">
                        Nổi bật nhất
                      </option>
                      <option value="price-asc" className="bg-surfaceDark text-textPrimary">
                        Giá: Thấp đến Cao
                      </option>
                      <option value="price-desc" className="bg-surfaceDark text-textPrimary">
                        Giá: Cao đến Thấp
                      </option>
                      <option value="newest" className="bg-surfaceDark text-textPrimary">
                        Mới nhất
                      </option>
                    </select>
                  </div>

                  {/* Nút chuyển xem dạng Lưới (Grid) hoặc Danh sách (List) */}
                  <div className="flex items-center bg-white/5 border border-white/10 dark:border-white/10 border-stone-200 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      aria-label="Xem dạng lưới 3 cột"
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-brandSage text-white"
                          : "text-textSecondary hover:text-textPrimary"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      aria-label="Xem dạng danh sách ngang"
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-brandSage text-white"
                          : "text-textSecondary hover:text-textPrimary"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* KHUNG THẺ SẢN PHẨM THUẦN TÚY (WIREFRAME - KHÔNG CÓ DỮ LIỆU MOCK) */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "grid grid-cols-1 gap-4"
                }
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <article
                    key={index}
                    className={`group relative bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 rounded-2xl p-5 hover:border-brandSage/50 hover:shadow-xl transition-all duration-300 flex ${
                      viewMode === "list"
                        ? "flex-col sm:flex-row items-start sm:items-center gap-6"
                        : "flex-col justify-between"
                    }`}
                  >
                    {/* VÙNG KHUNG HÌNH ẢNH */}
                    <div
                      className={
                        viewMode === "list"
                          ? "w-full sm:w-48 shrink-0"
                          : "w-full"
                      }
                    >
                      {/* Khung nhãn badge và icon */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-16 h-5 rounded-full bg-white/10 dark:bg-white/10 bg-stone-200" />
                        <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-white/10 bg-stone-200" />
                      </div>

                      {/* Khung ảnh placeholder */}
                      <div className="relative h-44 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center my-2 text-textSecondary/50 gap-2">
                        <div className="w-16 h-28 rounded-xl border border-dashed border-brandSage/30 bg-surfaceDark flex items-center justify-center">
                          <Smartphone className="w-7 h-7 text-brandSage/40" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                          Khung hình ảnh
                        </span>
                      </div>
                    </div>

                    {/* VÙNG KHUNG THÔNG TIN VÀ NÚT BẤM */}
                    <div className="flex-1 w-full flex flex-col justify-between mt-2 sm:mt-0">
                      {/* Khung dòng tên sản phẩm */}
                      <div className="space-y-1.5 mb-3">
                        <div className="h-4.5 w-4/5 rounded bg-white/10 dark:bg-white/10 bg-stone-200" />
                        <div className="h-3.5 w-1/2 rounded bg-white/5 dark:bg-white/5 bg-stone-100" />
                      </div>

                      {/* 3 Khung thông số kỹ thuật ngắn */}
                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        <div className="h-6 rounded-lg bg-white/5 dark:bg-white/5 bg-stone-100 flex items-center justify-center">
                          <Cpu className="w-3 h-3 text-brandSage/40" />
                        </div>
                        <div className="h-6 rounded-lg bg-white/5 dark:bg-white/5 bg-stone-100 flex items-center justify-center">
                          <Layers className="w-3 h-3 text-brandClay/40" />
                        </div>
                        <div className="h-6 rounded-lg bg-white/5 dark:bg-white/5 bg-stone-100 flex items-center justify-center">
                          <Smartphone className="w-3 h-3 text-brandSage/40" />
                        </div>
                      </div>

                      {/* Khung dòng đánh giá sao */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-3.5 w-24 rounded bg-white/10 dark:bg-white/10 bg-stone-200" />
                        <div className="h-3.5 w-14 rounded bg-white/10 dark:bg-white/10 bg-stone-200" />
                      </div>

                      {/* Khung dòng giá tiền */}
                      <div className="h-6 w-32 rounded bg-white/10 dark:bg-white/10 bg-stone-200 mb-4" />

                      {/* Khung nút thêm vào giỏ */}
                      <div className="w-full h-10 rounded-xl bg-brandClay/15 text-brandClay border border-brandClay/30 flex items-center justify-center gap-2 font-bold text-xs">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Thêm vào giỏ hàng</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* NÚT XEM THÊM KHUNG GIAO DIỆN */}
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  className="px-8 py-3 rounded-full bg-surfaceDark border border-brandSage/40 text-textPrimary hover:border-brandSage hover:text-brandSage font-bold text-xs tracking-wider transition-colors shadow-lg"
                >
                  Tải thêm sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer dùng chung của trang web */}
      <Footer />

      {/* 4. Các nút hành động nổi (Zalo, Hotline, Lên đầu trang) */}
      <FloatingActions />
    </div>
  );
}
