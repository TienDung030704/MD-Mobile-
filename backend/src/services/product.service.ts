import pool from "../config/db.js";
import { ProductRow } from "../types/index.js";

export class ProductService {
  /**
   * Lấy danh sách toàn bộ sản phẩm đang active
   */
  async getAllProducts(filters?: { categoryId?: string; brandId?: string; featured?: boolean }) {
    let sql = `
      SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'PUBLISHED'
    `;
    const params: (string | number)[] = [];

    if (filters?.categoryId) {
      sql += " AND p.category_id = ?";
      params.push(filters.categoryId);
    }

    if (filters?.brandId) {
      sql += " AND p.brand_id = ?";
      params.push(filters.brandId);
    }

    if (filters?.featured) {
      sql += " AND p.is_featured = 1";
    }

    sql += " ORDER BY p.created_at DESC";

    const [rows] = await pool.query<ProductRow[]>(sql, params);
    return rows;
  }

  /**
   * Lấy sản phẩm nổi bật cho trang chủ
   */
  async getFeaturedProducts() {
    const sql = `
      SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'PUBLISHED' AND p.is_featured = 1
      ORDER BY p.rating DESC, p.created_at DESC
    `;
    const [rows] = await pool.query<ProductRow[]>(sql);
    return rows;
  }

  /**
   * Lấy chi tiết sản phẩm theo slug
   */
  async getProductBySlug(slug: string) {
    const sql = `
      SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.status = 'PUBLISHED'
      LIMIT 1
    `;
    const [rows] = await pool.query<ProductRow[]>(sql, [slug]);
    return rows[0] || null;
  }
}

export const productService = new ProductService();

