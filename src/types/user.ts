/**
 * User & Authentication Types
 */
import type { ShippingAddress } from "./cart";

export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  addresses?: ShippingAddress[];
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  token?: string;
  isAuthenticated: boolean;
}
