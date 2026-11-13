"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchBrands } from "@/services/brands.service";

/**
 * Danh sách các tiêu chí lọc thông số kỹ thuật
 */
const RAM_OPTIONS = ["6GB", "8GB", "12GB", "16GB"];
const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];

/**
 * Component con dùng chung cho từng nhóm lọc accordion
 * Giúp code ngắn gọn, không bị lặp lại cấu trúc đóng/mở
 */
interface FilterGroupProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterGroup({ title, isOpen, onToggle, children }: FilterGroupProps) {
  return (
    <div className="border-b border-white/10 dark:border-white/10 border-stone-200 pb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-textSecondary hover:text-textPrimary mb-3 cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && children}
    </div>
  );
}

/**
 * Component Bộ lọc sản phẩm (Sidebar)
 */
export function FilterSidebarProducts({
  className = "",
}: {
  className?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector((state: RootState) => state.product.brands);

  // Tự động tải danh sách thương hiệu từ database nếu chưa có trong Redux store
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  // 1. Quản lý khoảng giá (0 - 50 triệu VNĐ)
  const [maxPrice, setMaxPrice] = useState<number>(50);

  // 2. Quản lý tiêu chí lọc đang được chọn
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedRam, setSelectedRam] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  // 3. Quản lý trạng thái đóng / mở của các nhóm lọc
  const [openSections, setOpenSections] = useState({
    brand: true,
    price: true,
    ram: true,
    storage: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 4. Đặt lại toàn bộ bộ lọc về mặc định
  const handleResetFilters = () => {
    setMaxPrice(50);
    setSelectedBrand(null);
    setSelectedRam(null);
    setSelectedStorage(null);
  };

  return (
    <aside
      className={`w-full lg:w-72 shrink-0 bg-surfaceDark border border-white/10 dark:border-white/10 border-stone-200 rounded-2xl p-5 space-y-4 lg:sticky lg:top-24 ${className}`}
    >
      {/* Tiêu đề & Nút Xóa lọc */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10 border-stone-200">
        <div className="flex items-center gap-2 font-bold text-sm text-textPrimary">
          <SlidersHorizontal className="w-4 h-4 text-brandSage" />
          <span>Bộ lọc chuyên sâu</span>
        </div>
        <button
          type="button"
          onClick={handleResetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-brandClay hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Xóa lọc
        </button>
      </div>

      {/* Nhóm 1: Hãng sản xuất (Dữ liệu thật từ Redux/Database) */}
      <FilterGroup
        title="Hãng sản xuất"
        isOpen={openSections.brand}
        onToggle={() => toggleSection("brand")}
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          {brands.length === 0 ? (
            <div className="col-span-2 py-3 text-center text-xs text-textSecondary animate-pulse">
              Đang tải hãng...
            </div>
          ) : (
            brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() =>
                  setSelectedBrand(
                    selectedBrand === brand.name ? null : brand.name,
                  )
                }
                className={`h-9 px-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer truncate ${
                  selectedBrand === brand.name
                    ? "bg-brandSage text-white border-brandSage shadow-sm"
                    : "border-white/10 dark:border-white/10 border-stone-200 bg-white/5 text-textSecondary hover:text-textPrimary"
                }`}
                title={brand.name}
              >
                {brand.name}
              </button>
            ))
          )}
        </div>
      </FilterGroup>

      {/* Nhóm 2: Khoảng giá */}
      <FilterGroup
        title="Khoảng giá"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
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
      </FilterGroup>

      {/* Nhóm 3: Dung lượng RAM */}
      <FilterGroup
        title="Dung lượng RAM"
        isOpen={openSections.ram}
        onToggle={() => toggleSection("ram")}
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          {RAM_OPTIONS.map((ram) => (
            <button
              key={ram}
              type="button"
              onClick={() => setSelectedRam(selectedRam === ram ? null : ram)}
              className={`h-9 px-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                selectedRam === ram
                  ? "bg-brandClay text-white border-brandClay"
                  : "border-white/10 dark:border-white/10 border-stone-200 bg-white/5 text-textSecondary hover:text-textPrimary"
              }`}
            >
              {ram}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Nhóm 4: Bộ nhớ trong */}
      <FilterGroup
        title="Bộ nhớ trong"
        isOpen={openSections.storage}
        onToggle={() => toggleSection("storage")}
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          {STORAGE_OPTIONS.map((storage) => (
            <button
              key={storage}
              type="button"
              onClick={() =>
                setSelectedStorage(selectedStorage === storage ? null : storage)
              }
              className={`h-9 px-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                selectedStorage === storage
                  ? "bg-brandClay text-white border-brandClay"
                  : "border-white/10 dark:border-white/10 border-stone-200 bg-white/5 text-textSecondary hover:text-textPrimary"
              }`}
            >
              {storage}
            </button>
          ))}
        </div>
      </FilterGroup>
    </aside>
  );
}

export default FilterSidebarProducts;
