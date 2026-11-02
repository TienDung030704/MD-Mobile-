import pool from "../config/db.js";
import { ProductRow } from "../types/index.js";

/**
 * ========================================================================
 * PRODUCT SERVICE — Tầng xử lý truy vấn dữ liệu Sản phẩm từ MySQL
 * Tất cả các hàm đều viết dạng hàm thuần (pure function) đơn giản, dễ hiểu
 * ========================================================================
 */

/**
 * 1. Lấy tất cả sản phẩm đang mở bán (PUBLISHED)
 */
export async function getAllProducts() {
  const [rows] = await pool.query<ProductRow[]>(`
    SELECT 
      p.*, 
      b.name AS brand_name, 
      c.name AS category_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'PUBLISHED'
    ORDER BY p.created_at DESC
  `);
  return rows;
}

/**
 * 2. Lấy danh sách sản phẩm nổi bật cho trang chủ (is_featured = 1)
 */
export async function getFeaturedProducts() {
  const [rows] = await pool.query<ProductRow[]>(`
    SELECT 
      p.*, 
      b.name AS brand_name, 
      c.name AS category_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'PUBLISHED' AND p.is_featured = 1
    ORDER BY p.rating DESC, p.created_at DESC
  `);
  return rows;
}

/**
 * 3. Lấy sản phẩm Flash Sale (có giảm giá discount_percentage > 0)
 */
export async function getFlashSaleProducts() {
  const [rows] = await pool.query<ProductRow[]>(`
    SELECT 
      p.*, 
      b.name AS brand_name, 
      c.name AS category_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'PUBLISHED' AND p.discount_percentage > 0
    ORDER BY p.discount_percentage DESC
    LIMIT 8
  `);
  return rows;
}

/**
 * 4. Lấy chi tiết 1 sản phẩm theo slug (URL thân thiện)
 */
export async function getProductBySlug(slug: string) {
  const [rows] = await pool.query<ProductRow[]>(`
    SELECT 
      p.*, 
      b.name AS brand_name, 
      c.name AS category_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.status = 'PUBLISHED'
    LIMIT 1
  `, [slug]);

  return rows[0] || null;
}
