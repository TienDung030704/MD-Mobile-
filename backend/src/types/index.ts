import { RowDataPacket } from "mysql2";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ProductRow extends RowDataPacket {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  category_id: string;
  brand_name?: string;
  category_name?: string;
  price: string | number;
  original_price: string | number | null;
  discount_percentage: number;
  thumbnail: string;
  description: string;
  specifications: string | object | null;
  rating: string | number;
  review_count: number;
  in_stock: number;
  stock_quantity: number;
  is_featured: number;
  is_new_arrival: number;
  is_best_seller: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface BannerRow extends RowDataPacket {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  position: string;
  sort_order: number;
  is_active: number;
}

