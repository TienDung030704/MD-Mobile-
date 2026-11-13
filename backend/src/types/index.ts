/**
 * ========================================================================
 * BACKEND TYPE DEFINITIONS — MD MOBILE
 * Chuẩn hóa kiểu dữ liệu cho toàn bộ Backend (Prisma ORM & RESTful API)
 * ========================================================================
 */

// 1. Cấu trúc phản hồi API chuẩn
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

// 2. Thương hiệu (Brand)
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  is_active?: number | boolean;
  isActive?: boolean;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

// 3. Danh mục sản phẩm (Category)
export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  parent_id?: string | null;
  parentId?: string | null;
  is_active?: number | boolean;
  isActive?: boolean;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

// 4. Biến thể sản phẩm (Màu sắc, Dung lượng, Giá riêng cho từng phiên bản)
export interface ProductVariant {
  id: string;
  productId?: string;
  product_id?: string;
  name: string;
  sku: string;
  price: number | string;
  originalPrice?: number | string | null;
  original_price?: number | string | null;
  stock: number;
  color?: string | null;
  storage?: string | null;
  image?: string | null;
  createdAt?: Date | string;
  created_at?: Date | string;
  updatedAt?: Date | string;
  updated_at?: Date | string;
}

// 5. Album hình ảnh chi tiết của sản phẩm
export interface ProductImage {
  id: string;
  productId?: string;
  product_id?: string;
  imageUrl?: string;
  image_url?: string;
  displayOrder?: number;
  display_order?: number;
  createdAt?: Date | string;
  created_at?: Date | string;
}

// 6. Sản phẩm cốt lõi (Product)
export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id?: string;
  brandId?: string;
  brand_name?: string;
  brand?: Brand;
  category_id?: string;
  categoryId?: string;
  category_name?: string;
  category?: Category;
  price: number | string;
  original_price?: number | string | null;
  originalPrice?: number | string | null;
  discount_percentage?: number | string | null;
  discountPercentage?: number | null;
  thumbnail: string;
  images?: ProductImage[] | string[];
  variants?: ProductVariant[];
  description?: string | null;
  specifications?: string | Record<string, unknown> | null;
  rating?: number | string;
  review_count?: number;
  reviewCount?: number;
  in_stock?: number | boolean;
  inStock?: boolean;
  stock_quantity?: number | null;
  stockQuantity?: number | null;
  is_featured?: number | boolean;
  isFeatured?: boolean;
  is_new_arrival?: number | boolean;
  isNewArrival?: boolean;
  is_best_seller?: number | boolean;
  isBestSeller?: boolean;
  status: string;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

// 7. Banner quảng cáo
export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  imageUrl?: string;
  link_url?: string | null;
  linkUrl?: string | null;
  position: string;
  sort_order?: number;
  sortOrder?: number;
  is_active?: number | boolean;
  isActive?: boolean;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

// 8. Người dùng (User)
export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  password?: string | null;
  address?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  is_active?: number | boolean;
  isActive?: boolean;
  is_verified?: number | boolean | null;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

// 9. Đơn hàng (Order)
export interface Order {
  id: string;
  orderNumber?: string;
  order_number?: string;
  user_id?: string | null;
  userId?: string | null;
  recipientName?: string;
  recipientPhone?: string;
  shippingProvince?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  shippingAddress?: string;
  shipping_address?: string;
  paymentMethod?: string;
  payment_method?: string;
  paymentStatus?: string;
  status?: string;
  order_status?: string;
  subtotal?: number | string;
  shippingFee?: number | string;
  discountAmount?: number | string;
  total?: number | string;
  total_amount?: number | string;
  note?: string | null;
  notes?: string | null;
  items?: OrderItem[];
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

// 10. Chi tiết món hàng trong đơn (OrderItem)
export interface OrderItem {
  id: string;
  orderId?: string;
  order_id?: string;
  productId?: string;
  product_id?: string;
  variantId?: string | null;
  variant_id?: string | null;
  productName?: string;
  product_name?: string;
  variantName?: string | null;
  variant_name?: string | null;
  sku?: string | null;
  thumbnail?: string | null;
  price?: number | string;
  product_price?: number | string;
  quantity: number;
  totalPrice?: number | string;
  subtotal?: number | string;
  createdAt?: Date | string;
}

// 11. Đánh giá sản phẩm (Review)
export interface Review {
  id: string;
  productId?: string;
  product_id?: string;
  userId?: string;
  user_id?: string;
  userName?: string;
  user_name?: string;
  userAvatar?: string | null;
  user_avatar?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  comment?: string;
  images?: string[] | unknown;
  isVerifiedPurchase?: boolean;
  is_verified_purchase?: number | boolean;
  status?: string;
  createdAt?: Date | string;
  created_at?: Date | string;
  updatedAt?: Date | string;
  updated_at?: Date | string;
}

// 12. Lịch sử tìm kiếm (SearchHistory)
export interface SearchHistory {
  id: string;
  userId?: string;
  user_id?: string;
  query: string;
  searchDate?: Date | string;
  search_date?: Date | string;
}
