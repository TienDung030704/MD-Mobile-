import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "./http";
import type { Product, ProductFilterParams, ApiResponse } from "@/types";

// 1. Lấy tất cả sản phẩm
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get<unknown, ApiResponse<Product[]>>("/api/products");
      return res.data;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi tải danh sách sản phẩm");
    }
  }
);

// 2. Lấy chi tiết sản phẩm theo slug hoặc id
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await http.get<unknown, ApiResponse<Product>>(`/api/products/${slug}`);
      return res.data;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi tải chi tiết sản phẩm");
    }
  }
);

// 3. Lọc sản phẩm theo tiêu chí
export const fetchFilterProduct = createAsyncThunk(
  "product/fetchFilterProduct",
  async (params: ProductFilterParams, { rejectWithValue }) => {
    try {
      const res = await http.get<unknown, ApiResponse<Product[]>>("/api/products", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi lọc sản phẩm");
    }
  }
);

// 4. Lấy sản phẩm nổi bật
export const fetchFeaturedProducts = createAsyncThunk(
  "product/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get<unknown, ApiResponse<Product[]>>("/api/products/featured");
      return res.data;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi tải sản phẩm nổi bật");
    }
  }
);
