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
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: Brand | string;
  category: Category | string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  thumbnail: string;
  images: string[];
  description: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  variants?: ProductVariant[];
  specifications?: ProductSpecification;
  createdAt?: string;
  updatedAt?: string;
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
