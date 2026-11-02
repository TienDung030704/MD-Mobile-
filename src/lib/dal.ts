import pool from "./db";
import { RowDataPacket } from "mysql2";

export interface RealProductRow extends RowDataPacket {
  id: string;
  name: string;
  slug: string;
  brand_name: string;
  category_name: string;
  price: string;
  original_price: string | null;
  discount_percentage: number;
  thumbnail: string;
  description: string;
  specifications: string | object | null;
  rating: string;
  review_count: number;
  in_stock: number;
  stock_quantity: number;
  is_featured: number;
  is_new_arrival: number;
  is_best_seller: number;
}

export interface RealBannerRow extends RowDataPacket {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  position: string;
  sort_order: number;
  is_active: number;
}

/**
 * Lấy danh sách sản phẩm nổi bật từ cơ sở dữ liệu MySQL
 */
export async function getFeaturedProductsFromDB() {
  try {
    const [rows] = await pool.query<RealProductRow[]>(`
      SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'PUBLISHED' AND p.is_featured = 1
      ORDER BY p.rating DESC, p.created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error("Lỗi khi truy vấn products từ MySQL:", error);
    return [];
  }
}

/**
 * Lấy danh sách sản phẩm Flash Sale từ cơ sở dữ liệu MySQL
 */
export async function getFlashSaleProductsFromDB() {
  try {
    const [rows] = await pool.query<RealProductRow[]>(`
      SELECT p.*, b.name as brand_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.status = 'PUBLISHED' AND p.discount_percentage > 0
      ORDER BY p.discount_percentage DESC
      LIMIT 8
    `);
    return rows;
  } catch (error) {
    console.error("Lỗi khi truy vấn Flash Sale từ MySQL:", error);
    return [];
  }
}

/**
 * Lấy danh sách Hero Banners từ cơ sở dữ liệu MySQL
 */
export async function getHeroBannersFromDB() {
  try {
    const [rows] = await pool.query<RealBannerRow[]>(`
      SELECT * FROM banners
      WHERE is_active = 1 AND position = 'hero_slider'
      ORDER BY sort_order ASC
    `);
    return rows;
  } catch (error) {
    console.error("Lỗi khi truy vấn banners từ MySQL:", error);
    return [];
  }
}
