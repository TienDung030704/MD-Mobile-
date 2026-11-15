"use client";

import React, { useEffect } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchBrands } from "@/services/brands.service";

interface FilterSidebarProductsProps {
  selectedBrands?: string[];
  onToggleBrand?: (brandName: string) => void;
  onClearBrands?: () => void;
}

export function FilterSidebarProducts({
  selectedBrands = [],
  onToggleBrand,
  onClearBrands,
}: FilterSidebarProductsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector((state: RootState) => state.product.brands);

  // Tự động tải thương hiệu từ database nếu store chưa có
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  return (
    <div className="bg-surfaceDark border border-[var(--header-border)] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm transition-colors duration-300">
      {/* HÀNG 1: LOGIC CHỌN NHIỀU HÃNG (MULTI-SELECT BRANDS) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[var(--header-border)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black tracking-wider uppercase text-textSecondary mr-1">
            BỘ LỌC
          </span>

          {/* Nút Tất cả: Bấm vào để bỏ chọn hết các hãng */}
          <button
            type="button"
            onClick={onClearBrands}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedBrands.length === 0
                ? "bg-brandSage text-white shadow-sm"
                : "bg-bgDark text-textSecondary hover:text-textPrimary border border-[var(--header-border)]"
            }`}
          >
            Tất cả
          </button>

          {/* Các nút Hãng từ Database: Bấm để chọn / bỏ chọn nhiều hãng */}
          {brands.map((b) => {
            const isSelected = selectedBrands.includes(b.name);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onToggleBrand?.(b.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brandSage text-white shadow-sm"
                    : "bg-bgDark border border-[var(--header-border)] text-textSecondary hover:text-textPrimary hover:border-brandSage/40"
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>

        {/* Nút sắp xếp */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bgDark border border-[var(--header-border)] text-xs font-semibold text-textPrimary cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-brandClay" />
          <span>Giá bán giảm dần</span>
          <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />
        </button>
      </div>

      {/* HÀNG 2: GIAO DIỆN CŨ (DUNG LƯỢNG, GIÁ BÁN, RAM, TÌNH TRẠNG MÁY) */}
      <div className="flex flex-wrap items-center gap-2 pt-3">
        {["Dung Lượng", "Giá Bán", "RAM", "Tình Trạng Máy"].map(
          (filterName) => (
            <button
              key={filterName}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--header-border)] bg-bgDark text-xs font-medium text-textSecondary hover:text-textPrimary hover:border-brandSage/40 transition-colors cursor-pointer"
            >
              <span>{filterName}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export default FilterSidebarProducts;
