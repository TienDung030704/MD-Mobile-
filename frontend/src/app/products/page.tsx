"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Header,
  Footer,
  FloatingActions,
  FilterSidebarProducts,
} from "@/components/common";
import {
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchProducts } from "@/services/product.service";
import { formatPrice } from "@/utils/format-price";
import usePagination from "@/hooks/usePagination";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const getProducts = useSelector((state: RootState) => state.product.products);
  const loading = useSelector((state: RootState) => state.product.loading);

  // Phân trang 9 sản phẩm mỗi trang (lưới 3x3)
  const { page, totalPages, currentItems, handlePageChange } = usePagination(
    getProducts,
    9
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
            <Link href="/" className="hover:text-brandSage transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-textSecondary">Điện thoại</span>
            <span>/</span>
            <span className="text-brandClay font-semibold">
              Tất cả sản phẩm
            </span>
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
                  Trải nghiệm công nghệ AI đỉnh cao cùng đặc quyền mua sắm: Trả
                  góp 0%, Bảo hành 1 đổi 1 trong 30 ngày và Thu cũ trợ giá đến 5
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
                CỘT TRÁI (288PX): BỘ LỌC CHUYÊN SÂU (SIDEBAR)
                ------------------------------------------------------- */}
            <FilterSidebarProducts />

            {/* -------------------------------------------------------
                CỘT PHẢI (FLEX-1): TOOLBAR + KHUNG DANH SÁCH SẢN PHẨM
                ------------------------------------------------------- */}
            <div className="flex-1 w-full min-w-0">
              {/* TOOLBAR: TIÊU ĐỀ KHUNG + SẮP XẾP + CHUYỂN GRID/LIST */}
              <div className="bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 rounded-2xl px-5 py-3.5 mb-5 flex flex-wrap items-center justify-between gap-4">
                {/* Tiêu đề khung danh sách & số lượng sản phẩm */}
                <div className="text-sm font-semibold text-textPrimary flex items-center gap-2">
                  <span>Danh sách sản phẩm</span>
                  {getProducts.length > 0 && (
                    <span className="text-xs text-textSecondary font-normal">
                      ({getProducts.length} sản phẩm — Trang {page}/{totalPages})
                    </span>
                  )}
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
                      <option
                        value="featured"
                        className="bg-surfaceDark text-textPrimary"
                      >
                        Nổi bật nhất
                      </option>
                      <option
                        value="price-asc"
                        className="bg-surfaceDark text-textPrimary"
                      >
                        Giá: Thấp đến Cao
                      </option>
                      <option
                        value="price-desc"
                        className="bg-surfaceDark text-textPrimary"
                      >
                        Giá: Cao đến Thấp
                      </option>
                      <option
                        value="newest"
                        className="bg-surfaceDark text-textPrimary"
                      >
                        Mới nhất
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* KHUNG THẺ SẢN PHẨM: SKELETON / EMPTY / DANH SÁCH THỰC TẾ (LƯỚI 3 CỘT) */}
              {loading && getProducts.length === 0 ? (
                /* 1. Trạng thái đang tải dữ liệu (Skeleton) */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-surfaceDark border border-white/10 rounded-2xl p-5 animate-pulse flex flex-col justify-between"
                    >
                      <div className="h-44 rounded-xl bg-white/5 mb-4" />
                      <div className="h-4 w-3/4 rounded bg-white/10 mb-2" />
                      <div className="h-3 w-1/2 rounded bg-white/5 mb-4" />
                      <div className="h-6 w-1/3 rounded bg-white/10 mb-4" />
                      <div className="h-10 rounded-xl bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : getProducts.length === 0 ? (
                /* 2. Trạng thái không tìm thấy sản phẩm */
                <div className="bg-surfaceDark border border-white/10 rounded-2xl p-12 text-center">
                  <Smartphone className="w-12 h-12 text-brandSage/40 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-textPrimary">
                    Chưa có sản phẩm nào
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    Hệ thống đang cập nhật danh mục sản phẩm.
                  </p>
                </div>
              ) : (
                /* 3. Render danh sách sản phẩm dạng lưới 3 cột */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {currentItems.map((product) => (
                    <article
                      key={product.id}
                      className="group bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 rounded-2xl p-5 hover:border-brandSage/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Ảnh sản phẩm */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="relative w-full h-44 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden mb-3"
                      >
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        ) : (
                          <Smartphone className="w-8 h-8 text-textSecondary/50" />
                        )}
                      </Link>

                      {/* Thông tin sản phẩm */}
                      <div className="flex-1 w-full flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-brandSage uppercase mb-1">
                            {product.brand_name || "MD Mobile"}
                          </p>
                          <Link
                            href={`/products/${product.slug}`}
                            className="font-bold text-sm text-textPrimary hover:text-brandSage line-clamp-2 transition-colors leading-snug"
                          >
                            {product.name}
                          </Link>
                        </div>

                        <div className="mt-4">
                          {/* Đánh giá sao & Giá tiền */}
                          <div className="flex items-center justify-between text-xs mb-3">
                            <span className="text-base font-extrabold text-brandClay">
                              {formatPrice(product.price)}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{product.rating || "5.0"}</span>
                            </div>
                          </div>

                          {/* Nút thêm vào giỏ */}
                          <button
                            type="button"
                            className="w-full h-10 rounded-xl bg-brandClay/15 text-brandClay hover:bg-brandClay hover:text-white border border-brandClay/30 transition-all font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Thêm vào giỏ hàng</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* BỘ ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {/* Nút trang trước */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Trang trước"
                    className="w-10 h-10 rounded-xl bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 flex items-center justify-center text-textPrimary hover:border-brandSage hover:text-brandSage disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Danh sách các số trang */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        p === page
                          ? "bg-brandSage text-white shadow-lg shadow-brandSage/25 border border-brandSage"
                          : "bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 text-textPrimary hover:border-brandSage hover:text-brandSage"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {/* Nút trang sau */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Trang sau"
                    className="w-10 h-10 rounded-xl bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 flex items-center justify-center text-textPrimary hover:border-brandSage hover:text-brandSage disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
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
