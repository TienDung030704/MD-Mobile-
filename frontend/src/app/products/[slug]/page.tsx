"use client";

import React, { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, ShoppingBag, Gift, ShieldCheck } from "lucide-react";
import { Header, Footer } from "@/components/common";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductById } from "@/services";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductsPageID({ params }: PageProps) {
  // 1. Lấy slug từ thanh URL (Next.js 16)
  const { slug } = use(params);

  // 2. Lấy dữ liệu từ Redux Store
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector((state: RootState) => state.product.productDetail);
  const loading = useSelector((state: RootState) => state.product.loading);

  // 3. Tự động gọi API tải máy theo slug khi vào trang
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductById(slug));
    }
  }, [dispatch, slug]);

  // State người dùng bấm chọn màu & dung lượng
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  // Nếu đang tải hoặc chưa có sản phẩm trong Redux
  if (loading || !product) {
    return (
      <div className="min-h-screen bg-bgDark text-textPrimary flex flex-col justify-between">
        <Header />
        <main className="w-full max-w-[1240px] mx-auto px-4 py-24 text-center text-textSecondary text-sm animate-pulse">
          Đang tải thông tin sản phẩm...
        </main>
        <Footer />
      </div>
    );
  }

  // Lấy danh sách biến thể màu & dung lượng của máy từ database
  const variants = product.variants || [];
  const activeColor = selectedColor || variants[0]?.color || "Mặc định";
  const activeStorage = selectedStorage || variants[0]?.storage || "Tiêu chuẩn";
  const availableStorages = Array.from(new Set(variants.map((v) => v.storage).filter(Boolean)));

  return (
    <div className="min-h-screen bg-bgDark text-textPrimary flex flex-col justify-between transition-colors duration-300">
      {/* Header dùng chung */}
      <Header />

      {/* Nội dung trang chi tiết */}
      <main className="w-full max-w-[1240px] mx-auto px-4 py-6 flex-1">
        {/* Breadcrumb: Trang chủ / Điện thoại / Tên sản phẩm */}
        <div className="flex items-center gap-2 text-xs text-textSecondary mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-brandSage">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brandSage">Điện thoại</Link>
          <span>/</span>
          <span className="text-brandClay font-bold truncate">{product.name}</span>
        </div>

        {/* Khung mua hàng 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* CỘT TRÁI (7/12): Hình ảnh sản phẩm trực tiếp từ API */}
          <div className="lg:col-span-7 bg-surfaceDark border border-[var(--header-border)] rounded-2xl p-6">
            <div className="relative w-full h-80 sm:h-96 flex items-center justify-center bg-bgDark rounded-xl border border-[var(--header-border)] mb-4">
              <Image
                src={product.thumbnail || "/images/products/iphone-16-pro-max-desert.svg"}
                alt={product.name}
                width={320}
                height={320}
                className="object-contain max-h-72"
                priority
              />
            </div>

            {/* Dòng cam kết bảo hành */}
            <div className="flex items-center justify-around text-xs text-textSecondary pt-2 border-t border-[var(--header-border)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brandSage" />
                <span>Bảo hành chính hãng 24 tháng</span>
              </span>
              <span>•</span>
              <span>1 đổi 1 trong 30 ngày</span>
            </div>
          </div>

          {/* CỘT PHẢI (5/12): Đặt hàng & Tùy chọn trực tiếp từ API */}
          <div className="lg:col-span-5 bg-surfaceDark border border-[var(--header-border)] rounded-2xl p-6 space-y-5">
            {/* Tên máy & Đánh giá sao */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brandClay/15 text-brandClay border border-brandClay/30">
                  {product.brand_name || "MD Flagship"}
                </span>
                <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating || "5.0"}</span>
                  <span className="text-textSecondary font-normal">
                    ({product.reviewCount || 420} đánh giá)
                  </span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-textPrimary tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Giá bán trực tiếp từ product.price */}
            <div className="p-3.5 rounded-xl bg-bgDark border border-[var(--header-border)] flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-brandClay font-price">
                {formatCurrency(Number(product.price))}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-textSecondary line-through font-price">
                  {formatCurrency(Number(product.originalPrice))}
                </span>
              )}
              {product.discountPercentage && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brandClay/20 text-brandClay">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>

            {/* 1. Chọn màu sắc (Card theo Hình 2) */}
            {variants.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-textSecondary mb-2">
                  Màu sắc: <strong className="text-brandClay">{activeColor}</strong>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {variants.map((v) => {
                    const isSelected = activeColor === v.color;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          if (v.color) setSelectedColor(v.color);
                        }}
                        className={`relative flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all overflow-hidden ${
                          isSelected
                            ? "border-brandClay bg-brandClay/5 ring-1 ring-brandClay"
                            : "border-[var(--header-border)] bg-bgDark hover:border-brandSage/40"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-4.5 h-4 bg-brandClay rounded-bl flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-7 h-8 relative shrink-0">
                          <Image
                            src={v.image || product.thumbnail || "/images/products/iphone-16-pro-max-desert.svg"}
                            alt={v.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[11px] font-bold truncate ${isSelected ? "text-brandClay" : "text-textPrimary"}`}>
                            {v.color || v.name}
                          </div>
                          <div className="text-[10px] text-textSecondary truncate font-price mt-0.5">
                            {formatCurrency(Number(v.price))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Chọn dung lượng */}
            {availableStorages.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-textSecondary mb-2">
                  Dung lượng: <strong className="text-brandSage">{activeStorage}</strong>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {availableStorages.map((storage) => {
                    const isSelected = activeStorage === storage;
                    return (
                      <button
                        key={storage}
                        type="button"
                        onClick={() => setSelectedStorage(storage as string)}
                        className={`py-2 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                          isSelected
                            ? "border-brandSage bg-brandSage/15 text-brandSage"
                            : "border-[var(--header-border)] bg-bgDark text-textSecondary hover:text-textPrimary"
                        }`}
                      >
                        {storage}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Khung ưu đãi ngắn gọn */}
            <div className="p-3.5 rounded-xl bg-bgDark border border-brandSage/30 space-y-1.5 text-xs text-textSecondary">
              <div className="font-bold text-brandClay flex items-center gap-1.5 uppercase text-[11px]">
                <Gift className="w-3.5 h-3.5" />
                <span>Ưu đãi mua kèm</span>
              </div>
              <p>• Trợ giá thu cũ đổi mới lên đến <strong>5.000.000₫</strong></p>
              <p>• Giảm thêm <strong>1.000.000₫</strong> khi thanh toán qua thẻ</p>
              <p>• Miễn phí giao hàng hỏa tốc trong 2h</p>
            </div>

            {/* 4. Cụm nút Mua ngay & Thêm giỏ hàng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                className="py-3 px-4 rounded-xl font-black text-xs uppercase bg-gradient-to-r from-brandClay to-brandSage text-white hover:opacity-90 transition-opacity cursor-pointer shadow-sm text-center"
              >
                MUA NGAY
              </button>
              <button
                type="button"
                className="py-3 px-4 rounded-xl font-bold text-xs border border-[var(--header-border)] bg-bgDark hover:border-brandSage/60 text-textPrimary hover:text-brandSage transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-brandClay" />
                <span>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thông số kỹ thuật từ database (nếu có) */}
        {product.specifications && typeof product.specifications === "object" && (
          <div className="bg-surfaceDark border border-[var(--header-border)] rounded-2xl p-6">
            <h2 className="text-base font-bold text-textPrimary mb-4">Thông số kỹ thuật</h2>
            <div className="divide-y divide-[var(--header-border)] text-xs sm:text-sm">
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <div
                  key={key}
                  className={`grid grid-cols-3 py-3 px-2 ${idx % 2 === 0 ? "bg-bgDark/30" : ""}`}
                >
                  <span className="text-textSecondary capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="col-span-2 font-medium text-textPrimary">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer dùng chung */}
      <Footer />
    </div>
  );
}
