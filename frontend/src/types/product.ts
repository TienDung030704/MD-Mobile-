/**
 * Product & Catalog Types
 */

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Titan Tự Nhiên", "256GB"
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  color?: string;
  storage?: string;
  image?: string;
}

export interface ProductSpecification {
  screen?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  camera?: string;
  os?: string;
  weight?: string;
  [key: string]: string | undefined;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: Brand | string;
  category?: Category | string;
  brand_id?: string;
  category_id?: string;
  brand_name?: string;
  category_name?: string;
  price: number | string;
  originalPrice?: number;
  original_price?: number | string;
  discountPercentage?: number;
  discount_percentage?: number;
  thumbnail: string;
  images?: string[];
  description?: string;
  rating?: number | string;
  reviewCount?: number;
  review_count?: number;
  inStock?: boolean | number;
  in_stock?: boolean | number;
  stockQuantity?: number;
  stock_quantity?: number;
  isFeatured?: boolean | number;
  is_featured?: boolean | number;
  isNewArrival?: boolean | number;
  is_new_arrival?: boolean | number;
  isBestSeller?: boolean | number;
  is_best_seller?: boolean | number;
  status?: string;
  variants?: ProductVariant[];
  specifications?: ProductSpecification | string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface ProductFilterParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price-asc" | "price-desc" | "newest" | "rating" | "popular";
  page?: number;
  limit?: number;
  query?: string;
}

/**
 * Chế độ hiển thị danh sách sản phẩm: Lưới (Grid) hoặc Danh sách ngang (List)
 */
export type ProductViewMode = "grid" | "list";

/**
 * Trạng thái đóng / mở của các mục accordion trong bộ lọc sản phẩm
 */
export interface ProductFilterAccordionState {
  brand: boolean;
  price: boolean;
  ram: boolean;
  storage: boolean;
  specs: boolean;
  features: boolean;
  colors: boolean;
}
