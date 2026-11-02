/**
 * Cart & Order Types
 */
import type { Product, ProductVariant } from "./product";

export interface CartItem {
  id: string; // unique item id in cart (combination of productId and variantId)
  productId: string;
  product: Pick<Product, "id" | "name" | "slug" | "thumbnail" | "price" | "originalPrice">;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER";

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
