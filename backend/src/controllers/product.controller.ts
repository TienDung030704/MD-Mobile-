import { Request, Response } from "express";
import { productService } from "../services/product.service.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, featured } = req.query;

    const products = await productService.getAllProducts({
      categoryId: category as string,
      brandId: brand as string,
      featured: featured === "true",
    });

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải danh sách sản phẩm",
    });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải sản phẩm nổi bật",
    });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = typeof req.params.slug === "string" ? req.params.slug : req.params.slug?.[0] || "";
    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tải thông tin sản phẩm",
    });
  }
};
