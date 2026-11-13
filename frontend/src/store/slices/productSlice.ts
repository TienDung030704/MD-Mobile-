import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductFilterParams, Brand } from "@/types/product";
import {
  fetchProducts,
  fetchProductById,
  fetchFilterProduct,
  fetchFeaturedProducts,
} from "@/services/product.service";
import { fetchBrands } from "@/services/brands.service";

export interface ProductState {
  // Danh sách sản phẩm chính
  products: Product[];
  // Danh sách thương hiệu
  brands: Brand[];
  // Chi tiết sản phẩm đang xem (null khi chưa chọn / đã unmount trang)
  productDetail: Product | null;
  // Danh sách sản phẩm sau khi lọc
  filterProduct: Product[];
  // Danh sách sản phẩm nổi bật trang chủ
  featuredProducts: Product[];
  // Tiêu chí bộ lọc hiện tại
  filters: ProductFilterParams;
  // Trạng thái tải và lỗi
  loading: boolean;
  error: string | null;
}

const initialFilters: ProductFilterParams = {
  category: undefined,
  brand: undefined,
  minPrice: 0,
  maxPrice: 50000000,
  sortBy: "newest",
  page: 1,
  limit: 12,
  query: "",
};

const initialState: ProductState = {
  products: [],
  brands: [],
  productDetail: null,
  filterProduct: [],
  featuredProducts: [],
  filters: initialFilters,
  loading: false,
  error: null,
};

/**
 * ========================================================================
 * PRODUCT SLICE DEFINITION
 * ========================================================================
 */
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Cập nhật tiêu chí lọc
    setFilterParams: (
      state,
      action: PayloadAction<Partial<ProductFilterParams>>,
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    // Đặt lại bộ lọc về mặc định
    clearFilter: (state) => {
      state.filterProduct = [];
      state.filters = initialFilters;
    },

    // Dọn dẹp chi tiết sản phẩm khi rời trang (tránh lỗi stale data trong Next.js)
    clearProductDetail: (state) => {
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    // 1. Lấy danh sách sản phẩm
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi tải sản phẩm";
      });

    // 2. Lấy chi tiết sản phẩm theo id/slug cụ thể
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi tải chi tiết sản phẩm";
      });

    // 3. Lọc sản phẩm
    builder
      .addCase(fetchFilterProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.filterProduct = action.payload;
      })
      .addCase(fetchFilterProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi lọc sản phẩm";
      });

    // 4. Sản phẩm nổi bật trang chủ
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi tải sản phẩm nổi bật";
      });

    // 5. Lấy danh sách thương hiệu (Brands)
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi tải danh sách thương hiệu";
      });
  },
});

// Xuất các actions đồng bộ
export const { setFilterParams, clearFilter, clearProductDetail } =
  productSlice.actions;

// Xuất reducer mặc định
export default productSlice.reducer;
