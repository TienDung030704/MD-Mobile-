import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "./http";
import type { Brand, ApiResponse } from "@/types";

// Lấy danh sách tất cả thương hiệu
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get<unknown, ApiResponse<Brand[]>>("/api/brands");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Lỗi tải danh sách thương hiệu"
      );
    }
  }
);
