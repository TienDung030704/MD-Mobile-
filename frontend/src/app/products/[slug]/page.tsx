"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, ShoppingBag, Gift, ShieldCheck } from "lucide-react";
import { Header, Footer } from "@/components/common";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductsPageID({ params }: PageProps) {
  // Lấy slug từ URL (Next.js 16)
  const { slug } = use(params);
  const productName = slug
    ? slug.replace(/-/g, " ").toUpperCase()
    : "ĐIỆN THOẠI FLAGSHIP";

  // State đơn giản chọn màu & dung lượng
  const [selectedColor, setSelectedColor] = useState("Titan Sa Mạc");
  const [selectedStorage, setSelectedStorage] = useState("256GB");

  // Danh sách màu rút gọn (Chuẩn theo kiểu dáng Hình 2)
  const colors = [
    {
      name: "Titan Sa Mạc",
      price: "32.990.000₫",
      img: "/images/products/iphone-16-pro-max-desert.svg",
    },
    {
      name: "Titan Xanh",
      price: "32.990.000₫",
      img: "/images/products/iphone-16-plus-ultramarine.svg",
    },
    {
      name: "Titan Đen",
      price: "32.990.000₫",
      img: "/images/products/iphone-16-teal.svg",
    },
  ];

  // Danh sách dung lượng rút gọn
  const storages = ["256GB", "512GB", "1TB"];

  return (
    <div className="min-h-screen bg-bgDark text-textPrimary flex flex-col justify-between transition-colors duration-300">
      {/* 1. Header dùng chung */}
      <Header />

      {/* 2. Nội dung trang chi tiết */}
      <main className="w-full max-w-[1240px] mx-auto px-4 py-6 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-textSecondary mb-6">
          <Link href="/" className="hover:text-brandSage">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brandSage">
            Điện thoại
          </Link>
          <span>/</span>
          <span className="text-brandClay font-bold truncate">
            {productName}
          </span>
        </div>

        {/* Khung mua hàng 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* CỘT TRÁI (7/12): Hình ảnh sản phẩm */}
          <div className="lg:col-span-7 bg-surfaceDark border border-[var(--header-border)] rounded-2xl p-6">
            {/* Ảnh lớn ở giữa */}
            <div className="relative w-full h-80 sm:h-96 flex items-center justify-center bg-bgDark rounded-xl border border-[var(--header-border)] mb-4">
              <Image
                src="/images/products/iphone-16-pro-max-desert.svg"
                alt={productName}
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

          {/* CỘT PHẢI (5/12): Đặt hàng & Tùy chọn */}
          <div className="lg:col-span-5 bg-surfaceDark border border-[var(--header-border)] rounded-2xl p-6 space-y-5">
            {/* Tên máy & Đánh giá sao */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.9</span>
                <span className="text-textSecondary font-normal">
                  (428 đánh giá)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-textPrimary tracking-tight">
                {productName}
              </h1>
            </div>

            {/* Giá bán */}
            <div className="p-3.5 rounded-xl bg-bgDark border border-[var(--header-border)] flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-brandClay font-price">
                32.990.000₫
              </span>
              <span className="text-xs text-textSecondary line-through font-price">
                37.990.000₫
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brandClay/20 text-brandClay">
                -14%
              </span>
            </div>

            {/* 1. Chọn màu sắc (Chuẩn card theo Hình 2) */}
            <div>
              <div className="text-xs font-semibold text-textSecondary mb-2">
                Màu sắc:{" "}
                <strong className="text-brandClay">{selectedColor}</strong>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all overflow-hidden ${
                        isSelected
                          ? "border-brandClay bg-brandClay/5 ring-1 ring-brandClay"
                          : "border-[var(--header-border)] bg-bgDark hover:border-brandSage/40"
                      }`}
                    >
                      {/* Dấu tích góc phải */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-4.5 h-4 bg-brandClay rounded-bl flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Ảnh nhỏ */}
                      <div className="w-7 h-8 relative shrink-0">
                        <Image
                          src={c.img}
                          alt={c.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Tên & giá */}
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-[11px] font-bold truncate ${isSelected ? "text-brandClay" : "text-textPrimary"}`}
                        >
                          {c.name}
                        </div>
                        <div className="text-[10px] text-textSecondary truncate font-price mt-0.5">
                          {c.price}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Chọn dung lượng */}
            <div>
              <div className="text-xs font-semibold text-textSecondary mb-2">
                Dung lượng:{" "}
                <strong className="text-brandSage">{selectedStorage}</strong>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {storages.map((storage) => {
                  const isSelected = selectedStorage === storage;
                  return (
                    <button
                      key={storage}
                      type="button"
                      onClick={() => setSelectedStorage(storage)}
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

            {/* 3. Khung ưu đãi ngắn gọn */}
            <div className="p-3.5 rounded-xl bg-bgDark border border-brandSage/30 space-y-1.5 text-xs text-textSecondary">
              <div className="font-bold text-brandClay flex items-center gap-1.5 uppercase text-[11px]">
                <Gift className="w-3.5 h-3.5" />
                <span>Ưu đãi mua kèm</span>
              </div>
              <p>
                • Trợ giá thu cũ đổi mới lên đến <strong>5.000.000₫</strong>
              </p>
              <p>
                • Giảm thêm <strong>1.000.000₫</strong> khi thanh toán qua thẻ
              </p>
              <p>• Tặng củ sạc nhanh chính hãng khi mua hôm nay</p>
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

        {/* Thông số kỹ thuật cơ bản */}
        <div className="bg-surfaceDark border border-[var(--header-border)] rounded-2xl p-6">
          <h2 className="text-base font-bold text-textPrimary mb-4">
            Thông số kỹ thuật
          </h2>
          <div className="divide-y divide-[var(--header-border)] text-xs sm:text-sm">
            {[
              {
                label: "Màn hình",
                value: "6.9 inch, Super Retina XDR OLED, 120Hz",
              },
              { label: "Chip xử lý", value: "Apple A18 Pro (3nm)" },
              { label: "RAM / Bộ nhớ trong", value: "8GB / 256GB NVMe" },
              { label: "Camera sau", value: "48MP + 48MP + 12MP (Zoom 5x)" },
              { label: "Dung lượng pin", value: "4.685 mAh, sạc nhanh 25W" },
            ].map((item, idx) => (
              <div
                key={item.label}
                className={`grid grid-cols-3 py-3 px-2 ${idx % 2 === 0 ? "bg-bgDark/30" : ""}`}
              >
                <span className="text-textSecondary">{item.label}</span>
                <span className="col-span-2 font-medium text-textPrimary">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3. Footer dùng chung */}
      <Footer />
    </div>
  );
}
