import prisma from "../config/prisma.js";

/**
 * 1. Lấy tất cả thương hiệu đang hoạt động (isActive = true)
 */
export async function getAllBrands() {
  return await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

/**
 * 2. Lấy thông tin chi tiết một thương hiệu theo slug
 */
export async function getBrandBySlug(slug: string) {
  return await prisma.brand.findUnique({
    where: { slug },
  });
}
