/**
 * Global Constants & Configurations for MD Mobile
 */

export const SITE_CONFIG = {
  name: "MD Mobile",
  shortName: "MDMobile",
  description:
    "Hệ thống bán lẻ điện thoại di động, máy tính bảng và phụ kiện chính hãng hàng đầu.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  contact: {
    hotline: "1900 1234",
    phone: "0987 654 321",
    email: "support@mdmobile.vn",
    address: "123 Đường Điện Biên Phủ, Quận 1, TP. Hồ Chí Minh",
    workingHours: "08:00 - 21:30 hàng ngày",
  },
  socials: {
    facebook: "https://facebook.com/mdmobile",
    youtube: "https://youtube.com/@mdmobile",
    tiktok: "https://tiktok.com/@mdmobile",
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Điện thoại", href: "/products?category=smartphones" },
  { label: "Apple (iPhone)", href: "/products?brand=apple" },
  { label: "Samsung", href: "/products?brand=samsung" },
  { label: "Phụ kiện", href: "/products?category=accessories" },
  { label: "Khuyến mãi", href: "/promotions", badge: "Hot" },
] as const;

export const STORAGE_KEYS = {
  CART: "md_mobile_cart",
  THEME: "md_mobile_theme",
  AUTH_TOKEN: "md_mobile_token",
  RECENTLY_VIEWED: "md_mobile_recent_products",
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 12,
} as const;

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  PROCESSING: { label: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
  SHIPPED: { label: "Đang giao hàng", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "Giao thành công", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};
