"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Header,
  Footer,
  FloatingActions,
  FilterSidebarProducts,
} from "@/components/common";
import {
  Smartphone,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchProducts } from "@/services/product.service";
import { formatPrice } from "@/utils/format-price";
import usePagination from "@/hooks/usePagination";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // 1. Lấy dữ liệu sản phẩm gốc từ Redux Store
  const products = useSelector((state: RootState) => state.product.products);
  const loading = useSelector((state: RootState) => state.product.loading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 2. State lưu danh sách các Hãng được chọn (chọn nhiều hãng cùng lúc)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Bấm chọn hoặc bỏ chọn một Hãng
  const handleToggleBrand = (brandName: string) => {
    setSelectedBrands(
      (prev) =>
        prev.includes(brandName)
          ? prev.filter((item) => item !== brandName) // Đã có thì bỏ ra
          : [...prev, brandName], // Chưa có thì thêm vào
    );
  };

  // =========================================================================
  // 3. LOGIC LỌC TỰ ĐỘNG THEO HÃNG BẰNG useMemo (CỰC KỲ ĐƠN GIẢN)
  // =========================================================================
  const filteredProducts = useMemo(() => {
    // Nếu chưa chọn hãng nào (mảng rỗng) -> Lấy tất cả sản phẩm
    if (selectedBrands.length === 0) {
      return products;
    }

    // Nếu có chọn -> Chỉ lấy các sản phẩm thuộc hãng nằm trong selectedBrands
    return products.filter((product) =>
      selectedBrands.includes(product.brand_name || ""),
    );
  }, [products, selectedBrands]);

  // 4. Phân trang 40 sản phẩm mỗi trang (5 cột x 8 hàng = 40 sản phẩm)
  const { page, totalPages, currentItems, handlePageChange } = usePagination(
    filteredProducts,
    40,
  );

  return (
    <div className="min-h-screen bg-bgDark text-textPrimary flex flex-col justify-between selection:bg-brandSage selection:text-white transition-colors duration-300">
      {/* Header dùng chung */}
      <Header />

      {/* Nội dung chính */}
      <main className="w-full max-w-[1440px] mx-auto pt-6 pb-16 px-3 sm:px-6 lg:px-8">
        {/* =========================================================
            1. BREADCRUMB
            ========================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-textSecondary mb-4"
        >
          <Link href="/" className="hover:text-brandSage transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-textSecondary">Điện thoại</span>
          <span>/</span>
          <span className="font-semibold text-textPrimary">
            Tất cả sản phẩm
          </span>
        </nav>

        {/* =========================================================
            2. KHUNG BỘ LỌC NGANG (LỌC THEO NHIỀU HÃNG)
            ========================================================= */}
        <FilterSidebarProducts
          selectedBrands={selectedBrands}
          onToggleBrand={handleToggleBrand}
          onClearBrands={() => setSelectedBrands([])}
        />

        {/* =========================================================
            3. KHUNG SẢN PHẨM (LƯỚI 5 CỘT CÓ HEADER GRADIENT)
            ========================================================= */}
        <section className="rounded-2xl border border-[var(--header-border)] overflow-hidden bg-surfaceDark shadow-sm mb-8 transition-colors duration-300">
          {/* Thanh tiêu đề tông màu chuẩn Nordic Sage & Clay của website */}
          <div className="w-full px-5 py-3.5 sm:py-4 bg-gradient-to-r from-brandClay via-[#B8846E] to-brandSage flex items-center justify-between shadow-inner">
            <h2 className="text-base sm:text-xl font-black text-white tracking-wide uppercase drop-shadow-sm flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
              <span>
                {selectedBrands.length > 0
                  ? `${selectedBrands.join(" & ")} Series`
                  : "Điện Thoại Flagship Series"}
              </span>
            </h2>
            <span className="text-xs font-bold text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          {/* Trạng thái đang tải dữ liệu (Skeleton) */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 divide-x divide-y divide-[var(--header-border)]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 animate-pulse flex flex-col justify-between h-72"
                >
                  <div className="w-full h-40 bg-bgDark rounded-xl mb-3" />
                  <div className="h-4 bg-bgDark rounded w-3/4 mb-2" />
                  <div className="h-4 bg-bgDark rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            /* Trạng thái chưa có sản phẩm khớp hãng chọn */
            <div className="py-20 text-center">
              <Smartphone className="w-12 h-12 text-textSecondary/40 mx-auto mb-3" />
              <p className="text-base font-bold text-textPrimary">
                Chưa có sản phẩm thuộc hãng này
              </p>
              <p className="text-xs text-textSecondary mt-1">
                Hãy thử bấm chọn các hãng khác hoặc chọn &quot;Tất cả&quot;.
              </p>
            </div>
          ) : (
            /* Lưới danh sách sản phẩm: 5 cột chia ô bằng border */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 divide-x divide-y divide-[var(--header-border)] border-b border-[var(--header-border)]">
              {currentItems.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative p-3 sm:p-4 lg:p-5 flex flex-col justify-between bg-surfaceDark hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors"
                >
                  {/* Ảnh sản phẩm ở giữa */}
                  <div className="relative w-full h-40 sm:h-48 flex items-center justify-center overflow-hidden mb-3">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <Smartphone className="w-12 h-12 text-textSecondary/40" />
                    )}
                  </div>

                  {/* Thông tin tên và giá bán */}
                  <div className="w-full text-center sm:text-left mt-1">
                    <h3 className="font-bold text-xs sm:text-sm text-textPrimary group-hover:text-brandClay transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    <div className="mt-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <span className="font-black text-sm sm:text-base text-brandClay">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center justify-center sm:justify-start gap-0.5 text-amber-400 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating || "5.0"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================
            4. ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION)
            ========================================================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {/* Nút Trang trước */}
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Trang trước"
              className="w-10 h-10 shrink-0 rounded-xl bg-surfaceDark border border-[var(--header-border)] flex items-center justify-center text-textPrimary hover:border-brandSage hover:text-brandSage disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Các nút số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={`w-10 h-10 shrink-0 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  p === page
                    ? "bg-brandSage text-white shadow-md shadow-brandSage/25 border border-brandSage"
                    : "bg-surfaceDark border border-[var(--header-border)] text-textPrimary hover:border-brandSage hover:text-brandSage shadow-sm"
                }`}
              >
                {p}
              </button>
            ))}

            {/* Nút Trang sau */}
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Trang sau"
              className="w-10 h-10 shrink-0 rounded-xl bg-surfaceDark border border-[var(--header-border)] flex items-center justify-center text-textPrimary hover:border-brandSage hover:text-brandSage disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer dùng chung */}
      <Footer />

      {/* Các nút hành động nổi */}
      <FloatingActions />
    </div>
  );
}
