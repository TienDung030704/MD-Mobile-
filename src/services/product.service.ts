/**
 * Product Service for fetching catalog and product details
 */
import { apiClient } from "./api-client";
import type { Product, ProductFilterParams, PaginatedResponse, Category } from "@/types";

export const productService = {
  /**
   * Get all products with optional filters
   */
  async getProducts(params?: ProductFilterParams) {
    return apiClient.get<PaginatedResponse<Product>>("/api/products", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get product detail by slug
   */
  async getProductBySlug(slug: string) {
    return apiClient.get<Product>(`/api/products/${slug}`);
  },

  /**
   * Get featured products for homepage
   */
  async getFeaturedProducts() {
    return apiClient.get<Product[]>("/api/products/featured");
  },

  /**
   * Get product categories list
   */
  async getCategories() {
    return apiClient.get<Category[]>("/api/categories");
  },
};
