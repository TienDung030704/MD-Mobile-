import prisma from "../config/prisma.js";

/**
 * ========================================================================
 * PRODUCT SERVICE — Tầng xử lý truy vấn dữ liệu Sản phẩm dùng PRISMA ORM
 * Code ngắn gọn, cú pháp chuẩn ORM, dễ hiểu và dễ bảo trì
 * ========================================================================
 */

/**
 * 1. Lấy tất cả sản phẩm đang mở bán (PUBLISHED)
 */
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      brand: {
        select: { id: true, name: true, slug: true, logoUrl: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Gắn thêm brand_name và category_name để tương thích với Frontend
  return products.map((p) => ({
    ...p,
    brand_name: p.brand?.name,
    category_name: p.category?.name,
  }));
}

/**
 * 2. Lấy danh sách sản phẩm nổi bật cho trang chủ (isFeatured = true)
 */
export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
    },
    include: {
      brand: {
        select: { id: true, name: true, slug: true, logoUrl: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
  });

  return products.map((p) => ({
    ...p,
    brand_name: p.brand?.name,
    category_name: p.category?.name,
  }));
}

/**
 * 3. Lấy sản phẩm Flash Sale (có giảm giá discountPercentage > 0)
 */
export async function getFlashSaleProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      discountPercentage: { gt: 0 },
    },
    include: {
      brand: {
        select: { id: true, name: true, slug: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { discountPercentage: "desc" },
    take: 8,
  });

  return products.map((p) => ({
    ...p,
    brand_name: p.brand?.name,
    category_name: p.category?.name,
  }));
}

/**
 * 4. Lấy chi tiết 1 sản phẩm theo slug
 */
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      brand: true,
      category: true,
      images: true,
      variants: true,
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    brand_name: product.brand?.name,
    category_name: product.category?.name,
  };
}
