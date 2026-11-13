-- ============================================================
-- DỰ ÁN: MD MOBILE - COMPLETE PRODUCTION SEED DATA
-- HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU: MySQL 8.0+ / MariaDB
-- XUẤT BỞI: Antigravity AI Assistant
-- DÙNG TRỰC TIẾP TRONG NAVICAT HOẶC MYSQL CLI
-- TỔNG SẢN PHẨM: 42 SP | BIẾN THỂ: 85 | ẢNH: 126
-- ============================================================

CREATE DATABASE IF NOT EXISTS `md_mobile` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `md_mobile`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DỰ ÁN: MD MOBILE (Cửa hàng điện thoại & thiết bị di động cao cấp)
-- HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU: MySQL 8.0+ / MariaDB 10.5+
-- PHẦN MỀM THỰC THI: Navicat for MySQL / Navicat Premium
-- BẢNG MÃ KÝ TỰ: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================

-- 1. TẠO DATABASE (NẾU CHƯA CÓ) VÀ SỬ DỤNG
CREATE DATABASE IF NOT EXISTS `md_mobile` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `md_mobile`;

-- Tắt kiểm tra khóa ngoại tạm thời để tránh xung đột khi drop/tạo bảng
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa các bảng cũ nếu tồn tại (theo thứ tự quan hệ)
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `brands`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `user_addresses`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `banners`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- BẢNG 1: users (Người dùng & Quản trị viên)
-- ============================================================
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã được mã hóa bằng bcrypt',
  `name` VARCHAR(100) NOT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `role` ENUM('CUSTOMER', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'CUSTOMER',
  `status` ENUM('ACTIVE', 'BLOCKED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng người dùng và phân quyền quản trị';

-- ============================================================
-- BẢNG 2: user_addresses (Sổ địa chỉ giao hàng của người dùng)
-- ============================================================
CREATE TABLE `user_addresses` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `province` VARCHAR(100) NOT NULL COMMENT 'Tỉnh / Thành phố',
  `district` VARCHAR(100) NOT NULL COMMENT 'Quận / Huyện',
  `ward` VARCHAR(100) NOT NULL COMMENT 'Phường / Xã',
  `street_address` VARCHAR(255) NOT NULL COMMENT 'Số nhà, tên đường',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1: Địa chỉ mặc định, 0: Bình thường',
  `notes` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_addresses_user_id` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sổ địa chỉ người dùng';

-- ============================================================
-- BẢNG 3: categories (Danh mục sản phẩm: Điện thoại, Phụ kiện, Tablet,...)
-- ============================================================
CREATE TABLE `categories` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `parent_id` VARCHAR(36) DEFAULT NULL COMMENT 'ID danh mục cha (danh mục đa cấp)',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`),
  KEY `idx_categories_parent_id` (`parent_id`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm';

-- ============================================================
-- BẢNG 4: brands (Thương hiệu: Apple, Samsung, Xiaomi, ASUS, Vivo...)
-- ============================================================
CREATE TABLE `brands` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_brands_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thương hiệu sản phẩm';

-- ============================================================
-- BẢNG 5: products (Sản phẩm cốt lõi)
-- ============================================================
CREATE TABLE `products` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `brand_id` VARCHAR(36) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `price` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá bán hiện tại hoặc giá khởi điểm',
  `original_price` DECIMAL(15,2) DEFAULT NULL COMMENT 'Giá niêm yết ban đầu trước giảm',
  `discount_percentage` INT NOT NULL DEFAULT 0 COMMENT 'Phần trăm giảm giá (%)',
  `thumbnail` VARCHAR(500) NOT NULL COMMENT 'Ảnh đại diện chính',
  `description` LONGTEXT DEFAULT NULL COMMENT 'Mô tả chi tiết bài viết sản phẩm',
  `specifications` JSON DEFAULT NULL COMMENT 'Thông số kỹ thuật: CPU, RAM, Màn hình, Pin, Camera...',
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00 COMMENT 'Điểm đánh giá trung bình 1.0 - 5.0',
  `review_count` INT NOT NULL DEFAULT 0 COMMENT 'Số lượt đánh giá',
  `in_stock` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái còn hàng',
  `stock_quantity` INT NOT NULL DEFAULT 0 COMMENT 'Tổng số lượng tồn kho',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Sản phẩm nổi bật trang chủ',
  `is_new_arrival` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Sản phẩm mới ra mắt',
  `is_best_seller` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Sản phẩm bán chạy nhất',
  `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_products_slug` (`slug`),
  KEY `idx_products_brand` (`brand_id`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_price` (`price`),
  KEY `idx_products_flags` (`is_featured`, `is_new_arrival`, `is_best_seller`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sản phẩm';

-- ============================================================
-- BẢNG 6: product_images (Thư viện hình ảnh sản phẩm)
-- ============================================================
CREATE TABLE `product_images` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product_id` (`product_id`),
  CONSTRAINT `fk_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Album ảnh sản phẩm';

-- ============================================================
-- BẢNG 7: product_variants (Phiên bản màu sắc & dung lượng bộ nhớ)
-- ============================================================
CREATE TABLE `product_variants` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL COMMENT 'VD: Titan Sa Mạc - 256GB',
  `sku` VARCHAR(100) NOT NULL COMMENT 'Mã định danh kho hàng duy nhất',
  `price` DECIMAL(15,2) NOT NULL,
  `original_price` DECIMAL(15,2) DEFAULT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `color` VARCHAR(50) DEFAULT NULL COMMENT 'Màu sắc',
  `storage` VARCHAR(50) DEFAULT NULL COMMENT 'Dung lượng bộ nhớ',
  `image` VARCHAR(500) DEFAULT NULL COMMENT 'Ảnh riêng theo màu',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_variants_sku` (`sku`),
  KEY `idx_variants_product_id` (`product_id`),
  CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Biến thể phiên bản sản phẩm (màu sắc/dung lượng)';

-- ============================================================
-- BẢNG 8: carts (Giỏ hàng của khách hàng)
-- ============================================================
CREATE TABLE `carts` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `session_token` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_carts_user_id` (`user_id`),
  KEY `idx_carts_session_token` (`session_token`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Giỏ hàng lưu trữ';

-- ============================================================
-- BẢNG 9: cart_items (Các mặt hàng trong giỏ)
-- ============================================================
CREATE TABLE `cart_items` (
  `id` VARCHAR(36) NOT NULL,
  `cart_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `variant_id` VARCHAR(36) DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cart_product_variant` (`cart_id`, `product_id`, `variant_id`),
  KEY `idx_cart_items_cart` (`cart_id`),
  KEY `idx_cart_items_product` (`product_id`),
  KEY `idx_cart_items_variant` (`variant_id`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết mặt hàng trong giỏ';

-- ============================================================
-- BẢNG 10: orders (Đơn hàng)
-- ============================================================
CREATE TABLE `orders` (
  `id` VARCHAR(36) NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `recipient_name` VARCHAR(100) NOT NULL,
  `recipient_phone` VARCHAR(20) NOT NULL,
  `shipping_province` VARCHAR(100) NOT NULL,
  `shipping_district` VARCHAR(100) NOT NULL,
  `shipping_ward` VARCHAR(100) NOT NULL,
  `shipping_address` VARCHAR(255) NOT NULL,
  `payment_method` ENUM('COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER') NOT NULL DEFAULT 'COD',
  `payment_status` ENUM('UNPAID', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
  `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `subtotal` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `shipping_fee` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_orders_order_number` (`order_number`),
  KEY `idx_orders_user_id` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_created_at` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đơn đặt hàng';

-- ============================================================
-- BẢNG 11: order_items (Chi tiết sản phẩm trong đơn hàng)
-- ============================================================
CREATE TABLE `order_items` (
  `id` VARCHAR(36) NOT NULL,
  `order_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `variant_id` VARCHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `variant_name` VARCHAR(255) DEFAULT NULL,
  `sku` VARCHAR(100) DEFAULT NULL,
  `thumbnail` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(15,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(15,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_product_id` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết các mặt hàng trong đơn';

-- ============================================================
-- BẢNG 12: reviews (Đánh giá & nhận xét sản phẩm)
-- ============================================================
CREATE TABLE `reviews` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `rating` TINYINT NOT NULL DEFAULT 5,
  `title` VARCHAR(200) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `images` JSON DEFAULT NULL,
  `is_verified_purchase` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_product` (`product_id`),
  KEY `idx_reviews_user` (`user_id`),
  KEY `idx_reviews_status` (`status`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đánh giá và nhận xét của khách hàng';

-- ============================================================
-- BẢNG 13: coupons (Mã giảm giá & Khuyến mãi)
-- ============================================================
CREATE TABLE `coupons` (
  `id` VARCHAR(36) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `discount_type` ENUM('PERCENT', 'FIXED_AMOUNT') NOT NULL DEFAULT 'PERCENT',
  `discount_value` DECIMAL(15,2) NOT NULL,
  `min_order_value` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `max_discount` DECIMAL(15,2) DEFAULT NULL,
  `usage_limit` INT NOT NULL DEFAULT 100,
  `used_count` INT NOT NULL DEFAULT 0,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_coupons_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Mã giảm giá khuyến mãi';

-- ============================================================
-- BẢNG 14: banners (Quản lý Banner Slider & Khuyến mãi trang chủ)
-- ============================================================
CREATE TABLE `banners` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `link_url` VARCHAR(500) DEFAULT NULL,
  `position` VARCHAR(50) NOT NULL DEFAULT 'hero_slider',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner và Slide khuyến mãi trang chủ';

-- ============================================================
-- ============================================================
-- DỮ LIỆU MẪU ĐẦY ĐỦ VÀ PHONG PHÚ (COMPREHENSIVE SEED DATA)
-- ============================================================

-- Data for table `categories` (6 rows)
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `parent_id`, `sort_order`, `is_active`) VALUES
  ('cat-smartphones', 'Điện Thoại Di Động', 'smartphones', 'Toàn bộ smartphone chính hãng Apple, Samsung, Xiaomi, ASUS, OPPO, Vivo, Sony...', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80', NULL, 1, 1),
  ('cat-tablets', 'Máy Tính Bảng', 'tablets', 'iPad và máy tính bảng Android màn hình lớn, phục vụ công việc và học tập giải trí', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', NULL, 2, 1),
  ('cat-smartwatches', 'Đồng Hồ Thông Minh', 'smartwatches', 'Apple Watch, Galaxy Watch, Garmin thời thượng theo dõi sức khỏe và thể thao đỉnh cao', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', NULL, 3, 1),
  ('cat-audio', 'Tai Nghe & Âm Thanh', 'audio', 'Tai nghe chống ồn không dây TWS, tai nghe chụp tai và loa bluetooth cao cấp', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', NULL, 4, 1),
  ('cat-accessories', 'Phụ Kiện Công Nghệ', 'accessories', 'Củ sạc nhanh GaN, sạc dự phòng, cáp sạc, ốp lưng chống sốc cao cấp chính hãng', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80', NULL, 5, 1),
  ('cat-laptops', 'Laptop & MacBook', 'laptops', 'MacBook Air, MacBook Pro chip Apple Silicon và laptop gaming cao cấp', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80', NULL, 6, 1);

-- Data for table `brands` (10 rows)
INSERT INTO `brands` (`id`, `name`, `slug`, `logo_url`, `description`, `is_active`) VALUES
  ('brand-apple', 'Apple', 'apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 'Thương hiệu công nghệ hàng đầu thế giới với iPhone, iPad, Mac, Apple Watch.', 1),
  ('brand-samsung', 'Samsung', 'samsung', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 'Tập đoàn công nghệ dẫn đầu thế giới với dòng Galaxy S, Galaxy Z Fold/Flip và Galaxy AI.', 1),
  ('brand-xiaomi', 'Xiaomi', 'xiaomi', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', 'Tiên phong camera quang học đồng chế tác cùng Leica và sạc siêu tốc HyperCharge.', 1),
  ('brand-asus', 'ASUS', 'asus', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', 'Hãng công nghệ hàng đầu với dòng gaming smartphone ROG Phone huyền thoại.', 1),
  ('brand-oppo', 'OPPO', 'oppo', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg', 'Bậc thầy nhiếp ảnh di động Hasselblad, thiết kế mỏng nhẹ thời trang.', 1),
  ('brand-vivo', 'Vivo', 'vivo', 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png', 'Dẫn đầu công nghệ chụp ảnh chân dung cùng ống kính Zeiss huyền thoại.', 1),
  ('brand-sony', 'Sony', 'sony', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', 'Đẳng cấp âm thanh Hi-Res, cảm biến máy ảnh Alpha và màn hình Bravia đỉnh cao.', 1),
  ('brand-google', 'Google', 'google', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'Smartphone thuần Android với trí tuệ nhân tạo Gemini AI và camera nhiếp ảnh thuật toán.', 1),
  ('brand-anker', 'Anker', 'anker', 'https://upload.wikimedia.org/wikipedia/commons/d/da/Anker_logo.svg', 'Thương hiệu phụ kiện củ sạc, cáp sạc GaN và pin dự phòng số 1 thế giới.', 1),
  ('brand-marshall', 'Marshall', 'marshall', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Marshall_Amplification_logo.svg/1200px-Marshall_Amplification_logo.svg.png', 'Biểu tượng âm thanh cổ điển từ Anh Quốc với chất âm rock đặc trưng đầy uy lực.', 1);

-- Data for table `users` (12 rows)
INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone_number`, `avatar_url`, `role`, `status`) VALUES
  ('usr-admin-01', 'admin@mdmobile.vn', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Admin MD Mobile', '0987654321', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'ADMIN', 'ACTIVE'),
  ('usr-staff-01', 'staff@mdmobile.vn', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Nguyễn Thu Trang (Quản Lý Kho)', '0901234567', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'STAFF', 'ACTIVE'),
  ('usr-cust-01', 'khachhang@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Nguyễn Văn An', '0912345678', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-02', 'tran.minh.tri@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Trần Minh Trí', '0938112233', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-03', 'le.hoang.nam@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Lê Hoàng Nam', '0988776655', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-04', 'pham.thu.huong@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Phạm Thu Hương', '0977223344', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-05', 'dang.quoc.huy@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Đặng Quốc Huy', '0966554433', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-06', 'vo.kim.ngan@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Võ Kim Ngân', '0919888999', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-07', 'hoang.duc.thanh@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Hoàng Đức Thành', '0903456789', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-08', 'bui.mai.anh@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Bùi Mai Anh', '0983123456', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-09', 'do.quang.vinh@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Đỗ Quang Vinh', '0944556677', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE'),
  ('usr-cust-10', 'dinh.phuong.thao@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Đinh Phương Thảo', '0979667788', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE');

-- Data for table `user_addresses` (10 rows)
INSERT INTO `user_addresses` (`id`, `user_id`, `full_name`, `phone_number`, `province`, `district`, `ward`, `street_address`, `is_default`, `notes`) VALUES
  ('addr-01', 'usr-cust-01', 'Nguyễn Văn An', '0912345678', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng Hậu', 'Số 18 Phố Duy Tân, Tòa nhà FPT', 1, 'Giao giờ hành chính từ thứ 2 đến thứ 6'),
  ('addr-02', 'usr-cust-01', 'Nguyễn Văn An (Nhà riêng)', '0912345678', 'Hà Nội', 'Nam Từ Liêm', 'Mỹ Đình 1', 'Căn hộ 1205, Tòa CT2 KĐT Mỹ Đình', 0, 'Gọi trước khi đến 15 phút'),
  ('addr-03', 'usr-cust-02', 'Trần Minh Trí', '0938112233', 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', '68 Nguyễn Huệ, Tòa nhà Bitexco', 1, 'Giao tại quầy lễ tân tầng 1'),
  ('addr-04', 'usr-cust-03', 'Lê Hoàng Nam', '0988776655', 'Đà Nẵng', 'Hải Châu', 'Thạch Thang', '42 Bạch Đằng, P. Thạch Thang', 1, 'Giao ban ngày'),
  ('addr-05', 'usr-cust-04', 'Phạm Thu Hương', '0977223344', 'Hồ Chí Minh', 'Quận 7', 'Tân Phú', 'Căn A08-12 Chung cư Scenic Valley, Nguyễn Văn Linh', 1, 'Bấm chuông gọi phòng hoặc gọi điện thoại'),
  ('addr-06', 'usr-cust-05', 'Đặng Quốc Huy', '0966554433', 'Hải Phòng', 'Lê Chân', 'An Dương', 'Số 15/45 Tôn Đức Thắng', 1, 'Giao tận tay người nhận'),
  ('addr-07', 'usr-cust-06', 'Võ Kim Ngân', '0919888999', 'Cần Thơ', 'Ninh Kiều', 'Xuân Khánh', 'Số 120 Đường 30 Tháng 4', 1, 'Gọi trước khi giao'),
  ('addr-08', 'usr-cust-07', 'Hoàng Đức Thành', '0903456789', 'Bình Dương', 'Thủ Dầu Một', 'Phú Hòa', 'Đường D1, Khu dân cư Phú Hòa 1', 1, 'Giao buổi chiều'),
  ('addr-09', 'usr-cust-08', 'Bùi Mai Anh', '0983123456', 'Hà Nội', 'Đống Đa', 'Láng Hạ', 'Số 22 Ngõ 105 Láng Hạ', 1, 'Được kiểm tra hàng trước khi nhận'),
  ('addr-10', 'usr-cust-09', 'Đỗ Quang Vinh', '0944556677', 'Hồ Chí Minh', 'Bình Thạnh', 'Phường 25', 'Tòa Landmark 81, 720A Điện Biên Phủ', 1, 'Giao lễ tân tầng sảnh B1');

-- Data for table `products` (42 rows)
INSERT INTO `products` (`id`, `name`, `slug`, `brand_id`, `category_id`, `price`, `original_price`, `discount_percentage`, `thumbnail`, `description`, `specifications`, `rating`, `review_count`, `in_stock`, `stock_quantity`, `is_featured`, `is_new_arrival`, `is_best_seller`, `status`) VALUES
  ('prod-iphone-16-pro-max', 'iPhone 16 Pro Max 256GB VN/A', 'iphone-16-pro-max-256gb', 'brand-apple', 'cat-smartphones', 34490000, 37990000, 9, '/images/products/iphone-16-pro-max-desert.svg', 'Đỉnh cao flagship Apple với chip xử lý Apple A18 Pro tiến trình 3nm, nút chụp ảnh Camera Control chuyên nghiệp, khung viền Titan Cấp Độ 5 Sa Mạc siêu nhẹ và thời lượng pin dài nhất từ trước đến nay trên iPhone.', '{"screen":"6.9 inch Super Retina XDR OLED 120Hz ProMotion","cpu":"Apple A18 Pro 6 lõi (3nm)","ram":"8GB","storage":"256GB","battery":"4685 mAh sạc không dây MagSafe 25W","camera":"Chính Fusion 48MP, Siêu rộng 48MP, Tele 5x 12MP Tetraprism","os":"iOS 18","weight":"227g"}', 4.98, 246, 1, 65, 1, 1, 1, 'PUBLISHED'),
  ('prod-galaxy-s24-ultra', 'Samsung Galaxy S24 Ultra 5G 256GB', 'samsung-galaxy-s24-ultra-5g', 'brand-samsung', 'cat-smartphones', 29990000, 33990000, 12, '/images/products/samsung-s24-ultra.svg', 'Kỷ nguyên quyền năng Galaxy AI mở ra những trải nghiệm chưa từng có: Khoanh tròn để tìm kiếm, Trợ lý phiên dịch trực tiếp cuộc gọi, camera 200MP đột phá và bút S-Pen quyền lực tích hợp sẵn.', '{"screen":"6.8 inch Dynamic AMOLED 2X 120Hz phẳng Corning Gorilla Armor","cpu":"Qualcomm Snapdragon 8 Gen 3 for Galaxy","ram":"12GB","storage":"256GB","battery":"5000 mAh sạc nhanh 45W","camera":"Chính 200MP OIS, Tele 50MP 5x quang học, Tele 10MP 3x, Góc siêu rộng 12MP","os":"One UI 6.1 (Android 14)","weight":"232g"}', 4.95, 188, 1, 45, 1, 1, 1, 'PUBLISHED'),
  ('prod-xiaomi-14-ultra', 'Xiaomi 14 Ultra Leica 512GB', 'xiaomi-14-ultra-leica-512gb', 'brand-xiaomi', 'cat-smartphones', 27490000, 31990000, 14, '/images/products/xiaomi-14-ultra.svg', 'Tuyệt tác quang học đồng chế tác cùng Leica với cảm biến Sony LYT-900 kích thước 1-inch, khẩu độ biến thiên vô cấp f/1.63 – f/4.0 cùng công nghệ sạc thần tốc 90W HyperCharge.', '{"screen":"6.73 inch LTPO AMOLED 120Hz WQHD+ 3000 nits","cpu":"Snapdragon 8 Gen 3 (4nm)","ram":"16GB","storage":"512GB","battery":"5000 mAh sạc 90W có dây, 80W không dây","camera":"Bộ 4 camera 50MP Leica quang học Vario-Summilux","os":"Xiaomi HyperOS","weight":"219.8g"}', 4.94, 92, 1, 30, 1, 1, 0, 'PUBLISHED'),
  ('prod-galaxy-z-fold6', 'Samsung Galaxy Z Fold6 5G 256GB', 'samsung-galaxy-z-fold6-5g-256gb', 'brand-samsung', 'cat-smartphones', 38990000, 43990000, 11, '/images/products/samsung-z-fold6.svg', 'Đỉnh cao công nghệ màn hình gập mỏng nhẹ nhất lịch sử Galaxy Z Fold, bản lề Flex Hinge kép bền bỉ và tích hợp trọn vẹn sức mạnh trí tuệ nhân tạo Galaxy AI trên màn hình cực đại 7.6 inch.', '{"screen":"Chính: 7.6 inch Dynamic AMOLED 2X 120Hz; Phụ: 6.3 inch","cpu":"Snapdragon 8 Gen 3 for Galaxy","ram":"12GB","storage":"256GB","battery":"4400 mAh sạc nhanh 25W","camera":"Chính 50MP OIS, Tele 10MP 3x, Góc rộng 12MP","os":"Android 14 One UI 6.1.1","weight":"239g"}', 4.93, 74, 1, 20, 1, 1, 1, 'PUBLISHED'),
  ('prod-iphone-16-plus', 'iPhone 16 Plus 128GB VN/A', 'iphone-16-plus-128gb', 'brand-apple', 'cat-smartphones', 25490000, 27990000, 9, '/images/products/iphone-16-plus-ultramarine.svg', 'Màn hình lớn 6.7 inch rực rỡ, chip Apple A18 mạnh mẽ tối ưu cho Apple Intelligence, nút Action đa năng và thời lượng xem video lên đến 27 giờ ấn tượng.', '{"screen":"6.7 inch Super Retina XDR OLED","cpu":"Apple A18 (3nm)","ram":"8GB","storage":"128GB","battery":"4674 mAh","camera":"Chính 48MP Fusion 2X, Siêu rộng 12MP chụp macro","os":"iOS 18","weight":"199g"}', 4.91, 115, 1, 50, 1, 1, 0, 'PUBLISHED'),
  ('prod-rog-phone-8-pro', 'ASUS ROG Phone 8 Pro 512GB', 'asus-rog-phone-8-pro-512gb', 'brand-asus', 'cat-smartphones', 26990000, 29990000, 10, '/images/products/rog-phone-8-pro.svg', 'Quái vật gaming smartphone với màn hình Samsung AMOLED 165Hz siêu mượt, hệ thống phím cảm ứng siêu âm AirTrigger độc quyền và vi xử lý Snapdragon 8 Gen 3 ép xung tối đa.', '{"screen":"6.78 inch LTPO AMOLED 165Hz 2500 nits","cpu":"Snapdragon 8 Gen 3 (4nm)","ram":"16GB","storage":"512GB","battery":"5500 mAh sạc 65W","camera":"Chính 50MP Gimbal OIS, Tele 32MP 3x, Góc rộng 13MP","os":"ROG UI (Android 14)","weight":"225g"}', 4.97, 83, 1, 25, 1, 1, 1, 'PUBLISHED'),
  ('prod-iphone-16-128gb', 'iPhone 16 128GB VN/A', 'iphone-16-128gb', 'brand-apple', 'cat-smartphones', 21990000, 23990000, 8, '/images/products/iphone-16-teal.svg', 'iPhone thế hệ mới với nút Camera Control và nút Action hoàn toàn mới, cụm camera kép xếp dọc hỗ trợ quay Không Gian cho Apple Vision Pro.', '{"screen":"6.1 inch Super Retina XDR OLED","cpu":"Apple A18 (3nm)","ram":"8GB","storage":"128GB","battery":"3561 mAh","camera":"Chính 48MP Fusion, Siêu rộng 12MP","os":"iOS 18","weight":"170g"}', 4.92, 162, 1, 70, 1, 1, 1, 'PUBLISHED'),
  ('prod-redmi-note-13-pro-plus', 'Xiaomi Redmi Note 13 Pro+ 5G 256GB', 'xiaomi-redmi-note-13-pro-plus-5g', 'brand-xiaomi', 'cat-smartphones', 8990000, 10490000, 14, '/images/products/redmi-note-13-pro-plus.svg', 'Vua phân khúc tầm trung với camera độ phân giải khủng 200MP OIS, sạc siêu nhanh 120W HyperCharge đầy pin trong 19 phút và chuẩn kháng nước kháng bụi IP68 hàng đầu.', '{"screen":"6.67 inch CrystalRes AMOLED 120Hz cong 1.5K","cpu":"MediaTek Dimensity 7200-Ultra","ram":"8GB","storage":"256GB","battery":"5000 mAh sạc 120W","camera":"Chính 200MP OIS, Góc rộng 8MP, Macro 2MP","os":"HyperOS","weight":"204.5g"}', 4.89, 310, 1, 90, 0, 0, 1, 'PUBLISHED'),
  ('prod-iphone-16-pro', 'iPhone 16 Pro 128GB VN/A', 'iphone-16-pro-128gb', 'brand-apple', 'cat-smartphones', 27990000, 29990000, 7, '/images/products/iphone-16-pro-max-desert.svg', 'Phiên bản nhỏ gọn chuyên nghiệp với màn hình 6.3 inch Super Retina XDR 120Hz, chip A18 Pro và camera Telephoto 5x Tetraprism cao cấp.', '{"screen":"6.3 inch Super Retina XDR OLED 120Hz ProMotion","cpu":"Apple A18 Pro 6 lõi (3nm)","ram":"8GB","storage":"128GB","battery":"3582 mAh","camera":"Chính 48MP, Siêu rộng 48MP, Tele 5x 12MP","os":"iOS 18","weight":"199g"}', 4.96, 140, 1, 40, 1, 1, 1, 'PUBLISHED'),
  ('prod-iphone-15-pro-max', 'iPhone 15 Pro Max 256GB VN/A', 'iphone-15-pro-max-256gb', 'brand-apple', 'cat-smartphones', 28490000, 32990000, 14, '/images/products/iphone-16-pro-max-desert.svg', 'Flagship được yêu thích nhất mọi thời đại với khung viền Titan Tự Nhiên, chip A17 Pro chơi game AAA đỉnh cao và cổng sạc Type-C tốc độ cao USB 3.', '{"screen":"6.7 inch Super Retina XDR OLED 120Hz","cpu":"Apple A17 Pro (3nm)","ram":"8GB","storage":"256GB","battery":"4422 mAh","camera":"Chính 48MP, Siêu rộng 12MP, Tele 5x 12MP","os":"iOS 17","weight":"221g"}', 4.94, 512, 1, 35, 1, 0, 1, 'PUBLISHED'),
  ('prod-iphone-15-128gb', 'iPhone 15 128GB VN/A', 'iphone-15-128gb', 'brand-apple', 'cat-smartphones', 18490000, 21990000, 16, '/images/products/iphone-16-teal.svg', 'Thiết kế mặt lưng kính nhám pha màu độc đáo, Dynamic Island thông minh, camera 48MP sắc nét cùng cổng USB-C tiện lợi.', '{"screen":"6.1 inch Super Retina XDR OLED","cpu":"Apple A16 Bionic (4nm)","ram":"6GB","storage":"128GB","battery":"3349 mAh","camera":"Chính 48MP, Siêu rộng 12MP","os":"iOS 17","weight":"171g"}', 4.9, 320, 1, 60, 0, 0, 1, 'PUBLISHED'),
  ('prod-iphone-13-128gb', 'iPhone 13 128GB Chính Hãng VN/A', 'iphone-13-128gb', 'brand-apple', 'cat-smartphones', 13490000, 15990000, 16, '/images/products/iphone-16-teal.svg', 'Chiếc iPhone quốc dân bán chạy nhất phân khúc dưới 15 triệu: pin trâu, camera kép chéo chống rung OIS cảm biến dịch chuyển, chip A15 mượt mà nhiều năm.', '{"screen":"6.1 inch Super Retina XDR OLED","cpu":"Apple A15 Bionic (5nm)","ram":"4GB","storage":"128GB","battery":"3227 mAh","camera":"Kép 12MP + 12MP chống rung Sensor-shift","os":"iOS 15 (lên iOS 18)","weight":"174g"}', 4.88, 670, 1, 80, 0, 0, 1, 'PUBLISHED'),
  ('prod-galaxy-s24-plus', 'Samsung Galaxy S24+ 5G 256GB', 'samsung-galaxy-s24-plus-5g', 'brand-samsung', 'cat-smartphones', 22490000, 26990000, 17, '/images/products/samsung-s24-ultra.svg', 'Sự cân bằng hoàn hảo với màn hình lớn 6.7 inch QHD+ Dynamic AMOLED 2X, RAM 12GB đa nhiệm mượt mà cùng toàn bộ các tính năng Galaxy AI tân tiến.', '{"screen":"6.7 inch QHD+ Dynamic AMOLED 2X 120Hz","cpu":"Exynos 2400 10 nhân (4nm)","ram":"12GB","storage":"256GB","battery":"4900 mAh sạc nhanh 45W","camera":"Chính 50MP OIS, Tele 10MP 3x, Góc siêu rộng 12MP","os":"One UI 6.1 (Android 14)","weight":"196g"}', 4.91, 86, 1, 35, 0, 1, 0, 'PUBLISHED'),
  ('prod-galaxy-s24', 'Samsung Galaxy S24 5G 256GB', 'samsung-galaxy-s24-5g', 'brand-samsung', 'cat-smartphones', 17990000, 22990000, 22, '/images/products/samsung-s24-ultra.svg', 'Smartphone cao cấp kích thước nhỏ gọn vừa vặn lòng bàn tay, viền nhôm Armor Aluminum siêu cứng cáp và tính năng Trợ lý chat AI thông minh.', '{"screen":"6.2 inch FHD+ Dynamic AMOLED 2X 120Hz","cpu":"Exynos 2400","ram":"8GB","storage":"256GB","battery":"4000 mAh sạc 25W","camera":"Chính 50MP OIS, Tele 10MP 3x, Góc rộng 12MP","os":"One UI 6.1","weight":"167g"}', 4.87, 104, 1, 40, 0, 0, 0, 'PUBLISHED'),
  ('prod-galaxy-z-flip6', 'Samsung Galaxy Z Flip6 5G 256GB', 'samsung-galaxy-z-flip6-5g', 'brand-samsung', 'cat-smartphones', 24990000, 28990000, 14, '/images/products/samsung-z-fold6.svg', 'Gập mở phong cách cùng màn hình Flex Window thông minh, camera nâng cấp vượt bậc 50MP sắc nét và tản nhiệt buồng hơi Vapor Chamber lần đầu tiên.', '{"screen":"Chính 6.7 inch FHD+ Dynamic AMOLED 2X; Phụ 3.4 inch Super AMOLED","cpu":"Snapdragon 8 Gen 3 for Galaxy","ram":"12GB","storage":"256GB","battery":"4000 mAh","camera":"Chính 50MP OIS, Góc siêu rộng 12MP","os":"One UI 6.1.1","weight":"187g"}', 4.92, 65, 1, 30, 1, 1, 0, 'PUBLISHED'),
  ('prod-galaxy-a55-5g', 'Samsung Galaxy A55 5G 128GB', 'samsung-galaxy-a55-5g', 'brand-samsung', 'cat-smartphones', 8990000, 9990000, 10, '/images/products/samsung-s24-ultra.svg', 'Điện thoại tầm trung sang trọng bậc nhất với khung kim loại vát phẳng nguyên khối, mặt lưng kính Gorilla Glass Victus+ và bảo mật Samsung Knox Vault.', '{"screen":"6.6 inch Super AMOLED 120Hz FHD+","cpu":"Exynos 1480 GPU Xclipse 530 AMD","ram":"8GB","storage":"128GB","battery":"5000 mAh","camera":"Chính 50MP OIS, Góc rộng 12MP, Macro 5MP","os":"Android 14 One UI 6.1","weight":"213g"}', 4.86, 220, 1, 75, 0, 0, 1, 'PUBLISHED'),
  ('prod-xiaomi-14t-pro', 'Xiaomi 14T Pro 5G 512GB (Leica)', 'xiaomi-14t-pro-5g', 'brand-xiaomi', 'cat-smartphones', 16490000, 17990000, 8, '/images/products/xiaomi-14-ultra.svg', 'Đột phá nhiếp ảnh ban đêm cùng ống kính quang học Leica Summilux cao cấp, vi xử lý Dimensity 9300+ mạnh mẽ và sạc siêu tốc 120W cùng sạc không dây 50W.', '{"screen":"6.67 inch AMOLED 144Hz 1.5K 4000 nits","cpu":"MediaTek Dimensity 9300+ (4nm)","ram":"12GB","storage":"512GB","battery":"5000 mAh sạc 120W HyperCharge","camera":"Cảm biến Light Fusion 900 50MP Leica, Tele 50MP, Siêu rộng 12MP","os":"Xiaomi HyperOS","weight":"209g"}', 4.93, 58, 1, 30, 1, 1, 0, 'PUBLISHED'),
  ('prod-xiaomi-14-256gb', 'Xiaomi 14 5G 256GB (Ống kính Leica)', 'xiaomi-14-5g-256gb', 'brand-xiaomi', 'cat-smartphones', 18990000, 22990000, 17, '/images/products/xiaomi-14-ultra.svg', 'Flagship nhỏ gọn đỉnh nhất thế giới Android: màn hình 6.36 inch viền siêu mỏng đối xứng, chip Snapdragon 8 Gen 3 và cụm 3 camera Leica 50MP chuyên nghiệp.', '{"screen":"6.36 inch OLED LTPO 120Hz 1.5K 3000 nits","cpu":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB","battery":"4610 mAh sạc 90W","camera":"Bộ 3 camera Leica 50MP (Chính + Tele 3.2x + Góc siêu rộng)","os":"Xiaomi HyperOS","weight":"193g"}', 4.92, 78, 1, 35, 0, 0, 0, 'PUBLISHED'),
  ('prod-poco-f6-pro', 'Xiaomi POCO F6 Pro 5G 512GB', 'xiaomi-poco-f6-pro-5g', 'brand-xiaomi', 'cat-smartphones', 12490000, 13990000, 11, '/images/products/redmi-note-13-pro-plus.svg', 'Quái vật hiệu năng phân khúc cận cao cấp với Snapdragon 8 Gen 2, màn hình 2K WQHD+ 120Hz 4000 nits cực phẩm và sạc siêu tốc 120W.', '{"screen":"6.67 inch Flow AMOLED WQHD+ 2K 120Hz","cpu":"Qualcomm Snapdragon 8 Gen 2 (4nm)","ram":"12GB","storage":"512GB","battery":"5000 mAh sạc nhanh 120W","camera":"Chính 50MP OIS Light Fusion 800, Góc rộng 8MP","os":"Xiaomi HyperOS","weight":"209g"}', 4.88, 145, 1, 45, 0, 0, 1, 'PUBLISHED'),
  ('prod-oppo-find-x7-ultra', 'OPPO Find X7 Ultra 512GB (Hasselblad)', 'oppo-find-x7-ultra-512gb', 'brand-oppo', 'cat-smartphones', 24990000, 27990000, 11, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80', 'Smartphone đầu tiên trên thế giới trang bị cụm camera kép tiềm vọng Quad Main Camera cùng hệ thống màu sắc huyền thoại Hasselblad Portrait.', '{"screen":"6.82 inch LTPO AMOLED 120Hz 2K 4500 nits","cpu":"Qualcomm Snapdragon 8 Gen 3","ram":"16GB","storage":"512GB","battery":"5000 mAh sạc 100W SuperVOOC","camera":"Cảm biến 1-inch Sony LYT-900 50MP + 2 camera tele tiềm vọng 50MP (3x & 6x)","os":"ColorOS 14 (Android 14)","weight":"221g"}', 4.95, 42, 1, 20, 1, 1, 0, 'PUBLISHED'),
  ('prod-oppo-reno12-pro', 'OPPO Reno12 Pro 5G 512GB', 'oppo-reno12-pro-5g', 'brand-oppo', 'cat-smartphones', 15490000, 16990000, 9, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80', 'Chuyên gia chân dung AI với thiết kế tương lai dòng chảy bạc, kính cường lực Corning Gorilla Glass 7i chống va đập siêu bền và kết nối BeaconLink không cần mạng.', '{"screen":"6.7 inch AMOLED 120Hz cong vô cực 4 cạnh","cpu":"MediaTek Dimensity 7300-Energy","ram":"12GB","storage":"512GB","battery":"5000 mAh sạc nhanh 80W SUPERVOOC","camera":"Chính 50MP Sony LYT-600 OIS, Tele chân dung 50MP 2x, Selfie 50MP AF","os":"ColorOS 14.1","weight":"180g"}', 4.89, 89, 1, 40, 0, 1, 0, 'PUBLISHED'),
  ('prod-vivo-x100-pro', 'Vivo X100 Pro 5G 512GB (Zeiss APO)', 'vivo-x100-pro-5g-zeiss', 'brand-vivo', 'cat-smartphones', 21990000, 24990000, 12, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80', 'Vua chụp hoàng hôn và chân dung với thấu kính quang học Zeiss APO đạt chứng nhận Floating Telephoto, chip xử lý hình ảnh độc quyền Vivo V3.', '{"screen":"6.78 inch LTPO AMOLED 120Hz 1.5K 3000 nits","cpu":"MediaTek Dimensity 9300 (4nm)","ram":"16GB","storage":"512GB","battery":"5400 mAh sạc 100W FlashCharge, 50W không dây","camera":"Chính 50MP 1-inch Sony IMX989, Tele Zeiss APO 50MP 4.3x, Góc rộng 50MP","os":"Funtouch OS 14 (Android 14)","weight":"221g"}', 4.96, 54, 1, 25, 1, 1, 0, 'PUBLISHED'),
  ('prod-vivo-v40-5g', 'Vivo V40 5G 256GB (Đồng chế tác Zeiss)', 'vivo-v40-5g-256gb', 'brand-vivo', 'cat-smartphones', 11990000, 12990000, 8, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80', 'Thiết kế siêu mỏng thanh lịch nhưng ẩn chứa viên pin khủng 5500 mAh BlueVolt, chuẩn kháng nước kháng bụi IP68/IP69 đỉnh cao và vòng sáng Aura Light thông minh.', '{"screen":"6.78 inch AMOLED 120Hz 1.5K cong 3D","cpu":"Snapdragon 7 Gen 3 (4nm)","ram":"12GB","storage":"256GB","battery":"5500 mAh sạc 80W FlashCharge","camera":"Kép 50MP Zeiss OIS + 50MP Zeiss Góc rộng, Selfie 50MP Zeiss","os":"Funtouch OS 14","weight":"190g"}', 4.87, 67, 1, 35, 0, 1, 0, 'PUBLISHED'),
  ('prod-google-pixel-9-pro-xl', 'Google Pixel 9 Pro XL 256GB', 'google-pixel-9-pro-xl-256gb', 'brand-google', 'cat-smartphones', 27990000, 30990000, 10, 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80', 'Trải nghiệm Android thuần khiết thông minh nhất với chip Google Tensor G4, trợ lý Gemini Live tích hợp sâu, camera chụp đêm Night Sight và Zoom Enhance AI.', '{"screen":"6.8 inch Super Actua OLED LTPO 120Hz 3000 nits","cpu":"Google Tensor G4 (4nm) đồng bộ Titan M2 security","ram":"16GB","storage":"256GB","battery":"5060 mAh sạc 37W","camera":"Chính 50MP OIS, Tele 48MP 5x quang, Siêu rộng 48MP Macro, Selfie 42MP","os":"Android 15 cập nhật 7 năm","weight":"221g"}', 4.96, 63, 1, 20, 1, 1, 0, 'PUBLISHED'),
  ('prod-sony-xperia-1-vi', 'Sony Xperia 1 VI 256GB', 'sony-xperia-1-vi-256gb', 'brand-sony', 'cat-smartphones', 30990000, 33990000, 9, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80', 'Tuyệt tác của các nhà sáng tạo nội dung với ống kính zoom quang học thực tế 85mm - 170mm (3.5x - 7.1x), màn hình Bravia OLED hỗ trợ Sunlight Vision và jack 3.5mm vàng Hi-Res.', '{"screen":"6.5 inch LTPO OLED 120Hz FHD+ tỷ lệ 19.5:9","cpu":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB (hỗ trợ thẻ MicroSD)","battery":"5000 mAh thời lượng 2 ngày","camera":"Cảm biến Exmor T 48MP 24mm/48mm, Tele zoom quang thực thụ 85-170mm 12MP","os":"Android 14","weight":"192g"}', 4.93, 36, 1, 15, 0, 1, 0, 'PUBLISHED'),
  ('prod-ipad-pro-m4-11', 'iPad Pro 11 inch M4 Wi-Fi 256GB', 'ipad-pro-11-inch-m4-wifi-256gb', 'brand-apple', 'cat-tablets', 27990000, 29990000, 7, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 'Sản phẩm mỏng nhất lịch sử Apple với màn hình Ultra Retina XDR công nghệ Tandem OLED đột phá, chip Apple M4 sức mạnh đồ họa vượt tầm tương lai và Apple Pencil Pro.', '{"screen":"11 inch Tandem OLED Ultra Retina XDR 120Hz ProMotion 1600 nits HDR","cpu":"Apple M4 9 lõi CPU, 10 lõi GPU, 16 lõi Neural Engine","ram":"8GB","storage":"256GB","battery":"31.29 Wh","camera":"Sau 12MP Wide LiDAR, Trước 12MP Ultra Wide ngang Center Stage","os":"iPadOS 18","weight":"444g"}', 4.97, 98, 1, 30, 1, 1, 1, 'PUBLISHED'),
  ('prod-ipad-air-6-m2', 'iPad Air 11 inch M2 Wi-Fi 128GB', 'ipad-air-11-inch-m2-wifi-128gb', 'brand-apple', 'cat-tablets', 15990000, 17490000, 9, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80', 'Sức mạnh chip Apple M2 vượt trội, hỗ trợ bút Apple Pencil Pro mới và Magic Keyboard, hoàn hảo cho học sinh sinh viên và đồ họa chuyên nghiệp.', '{"screen":"11 inch Liquid Retina LED IPS 500 nits True Tone","cpu":"Apple M2 8 nhân CPU, 10 nhân GPU","ram":"8GB","storage":"128GB","battery":"28.93 Wh","camera":"Sau 12MP Wide 4K, Trước 12MP Ultra Wide nằm ngang","os":"iPadOS 18","weight":"462g"}', 4.91, 142, 1, 45, 0, 1, 1, 'PUBLISHED'),
  ('prod-ipad-gen-10', 'iPad 10.9 inch (Gen 10) Wi-Fi 64GB', 'ipad-10-9-inch-gen-10-wifi-64gb', 'brand-apple', 'cat-tablets', 8990000, 10490000, 14, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 'Thiết kế viền mỏng 4 màu sắc trẻ trung, màn hình Liquid Retina 10.9 inch, cổng sạc Type-C hiện đại và chip Apple A14 Bionic đáp ứng trọn vẹn mọi nhu cầu gia đình.', '{"screen":"10.9 inch Liquid Retina IPS 500 nits","cpu":"Apple A14 Bionic","ram":"4GB","storage":"64GB","battery":"28.6 Wh","camera":"Trước & sau 12MP","os":"iPadOS 18","weight":"477g"}', 4.88, 280, 1, 70, 0, 0, 1, 'PUBLISHED'),
  ('prod-galaxy-tab-s9-ultra', 'Samsung Galaxy Tab S9 Ultra 5G 256GB', 'samsung-galaxy-tab-s9-ultra-5g', 'brand-samsung', 'cat-tablets', 25990000, 32990000, 21, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 'Chiếc máy tính bảng Android vĩ đại nhất với màn hình khổng lồ 14.6 inch Dynamic AMOLED 2X, chuẩn kháng nước IP68 cho cả máy và bút S-Pen đi kèm.', '{"screen":"14.6 inch Dynamic AMOLED 2X 120Hz WQXGA+","cpu":"Snapdragon 8 Gen 2 for Galaxy","ram":"12GB","storage":"256GB","battery":"11200 mAh sạc nhanh 45W","camera":"Kép sau 13MP + 8MP; Kép trước 12MP + 12MP","os":"Android 14 One UI 6","weight":"732g"}', 4.95, 51, 1, 20, 1, 0, 0, 'PUBLISHED'),
  ('prod-xiaomi-pad-6', 'Xiaomi Pad 6 128GB Chính Hãng', 'xiaomi-pad-6-128gb', 'brand-xiaomi', 'cat-tablets', 6490000, 7990000, 19, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 'Tablet giải trí và học tập đỉnh cao phân khúc 6 triệu với màn hình 144Hz WQHD+, 4 loa stereo Dolby Atmos và vi xử lý Snapdragon 870 cực ổn định.', '{"screen":"11 inch IPS LCD 144Hz WQHD+ (2880 x 1800)","cpu":"Qualcomm Snapdragon 870 5G","ram":"6GB","storage":"128GB","battery":"8840 mAh sạc 33W","camera":"Sau 13MP, Trước 8MP","os":"Xiaomi HyperOS","weight":"490g"}', 4.87, 195, 1, 60, 0, 0, 1, 'PUBLISHED'),
  ('prod-apple-watch-s10-46', 'Apple Watch Series 10 Nhôm GPS 46mm', 'apple-watch-series-10-nhom-gps-46mm', 'brand-apple', 'cat-smartwatches', 11490000, 11990000, 4, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 'Chiếc Apple Watch mỏng nhất từ trước đến nay với diện tích màn hình OLED góc nhìn rộng lớn hơn cả Ultra 2, sạc nhanh 80% chỉ trong 30 phút.', '{"screen":"OLED góc rộng LTPO3 Always-On sáng đến 2000 nits","chip":"Apple S10 SiP 64-bit lõi kép","features":"Phát hiện ngưng thở khi ngủ, Cảm biến đo độ sâu, Nhiệt độ nước, ECG, SpO2","battery":"18 giờ dùng tiêu chuẩn, 36 giờ chế độ tiết kiệm","waterproof":"Chống nước 50m chuẩn WR50","material":"Vỏ nhôm tái chế 100%"}', 4.94, 112, 1, 40, 1, 1, 1, 'PUBLISHED'),
  ('prod-apple-watch-ultra-2', 'Apple Watch Ultra 2 GPS + Cellular 49mm Titan Đen', 'apple-watch-ultra-2-gps-cellular-49mm-titan-den', 'brand-apple', 'cat-smartwatches', 21490000, 22990000, 7, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 'Đồng hồ thể thao mạo hiểm tối thượng với lớp hoàn thiện Titan Đen Satin phủ kim cương nhân tạo DLC, màn hình sáng 3000 nits và GPS tần số kép L1 & L5 cực chính xác.', '{"screen":"49mm Mặt kính Sapphire LTPO OLED 3000 nits","chip":"Apple S9 SiP","features":"Nút Hành Động Cam, Còi báo động 86dB, Lặn tự do đến 40m, Đo độ cao -500m đến 9000m","battery":"36 giờ sử dụng thông thường, lên đến 72 giờ tiết kiệm pin","waterproof":"Chống nước 100m chuẩn EN13319","weight":"61.8g"}', 4.98, 87, 1, 25, 1, 1, 1, 'PUBLISHED'),
  ('prod-galaxy-watch-ultra', 'Samsung Galaxy Watch Ultra 47mm LTE', 'samsung-galaxy-watch-ultra-47mm-lte', 'brand-samsung', 'cat-smartwatches', 14990000, 16990000, 12, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 'Thiết kế đệm Cushion thời thượng, vỏ Titan Cấp Độ 4 siêu nhẹ bền bỉ, chỉ số năng lượng Energy Score thông minh từ Galaxy AI và kháng nước 10ATM.', '{"screen":"1.5 inch Super AMOLED 480x480 Sapphire 3000 nits","chip":"Exynos W1000 tiến trình 3nm 5 nhân","features":"Galaxy AI Energy Score, Kháng nước 10ATM, Còi cứu hộ 85dB","battery":"590 mAh thời lượng lên đến 100 giờ ở chế độ tiết kiệm năng lượng tập luyện","os":"Wear OS Powered by Samsung (One UI 6 Watch)"}', 4.92, 49, 1, 30, 1, 1, 0, 'PUBLISHED'),
  ('prod-galaxy-watch-7', 'Samsung Galaxy Watch7 40mm Bluetooth', 'samsung-galaxy-watch7-40mm-bluetooth', 'brand-samsung', 'cat-smartwatches', 6490000, 7490000, 13, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 'Cảm biến BioActive thế hệ mới theo dõi sức khỏe chuyên sâu, GPS kép định vị từng góc phố và hiệu năng tăng gấp 3 lần nhờ chip 3nm.', '{"screen":"1.3 inch Super AMOLED Sapphire","chip":"Exynos W1000 (3nm)","features":"Cảm biến BioActive 13 bóng LED, Theo dõi giấc ngủ AI, Đo thành phần cơ thể BIA","battery":"300 mAh sạc không dây nhanh WPC"}', 4.88, 76, 1, 40, 0, 1, 0, 'PUBLISHED'),
  ('prod-airpods-pro-2-usbc', 'Tai nghe Bluetooth Apple AirPods Pro 2 MagSafe USB-C', 'apple-airpods-pro-2-magsafe-usb-c', 'brand-apple', 'cat-audio', 5490000, 6190000, 11, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 'Khả năng Chống Ồn Chủ Động (ANC) gấp 2 lần, Chế độ Âm Thanh Thích Ứng Adaptive Audio, Cảm Nhận Cuộc Trò Chuyện và chuẩn chống bụi kháng nước IP54 cả tai nghe lẫn hộp sạc USB-C.', '{"chip":"Apple H2 ở tai nghe, chip U1 ở hộp sạc","audio":"Spatial Audio cá nhân hóa theo dõi cử động đầu, Adaptive EQ","battery":"6 giờ nghe nhạc khi bật ANC, tổng cộng 30 giờ cùng hộp sạc","charging":"Cổng Type-C, MagSafe, Apple Watch Charger, Qi"}', 4.97, 420, 1, 85, 1, 0, 1, 'PUBLISHED'),
  ('prod-airpods-4-anc', 'Tai nghe Bluetooth Apple AirPods 4 Chống Ồn Chủ Động (ANC)', 'apple-airpods-4-chong-on-chu-dong-anc', 'brand-apple', 'cat-audio', 4490000, 4790000, 6, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 'Lần đầu tiên trên thế giới tai nghe thiết kế mở (open-ear) được trang bị công nghệ Chống Ồn Chủ Động ANC, chip Apple H2 và hộp sạc nhỏ nhất hỗ trợ loa Find My.', '{"chip":"Apple H2","audio":"Chống ồn chủ động ANC trên thiết kế mở, Adaptive Audio, Chế độ Xuyên Âm","battery":"Lên đến 30 giờ nghe cùng hộp sạc","charging":"USB-C, Sạc không dây Qi & Apple Watch Charger"}', 4.92, 110, 1, 50, 0, 1, 1, 'PUBLISHED'),
  ('prod-sony-wf-1000xm5', 'Tai nghe Chống Ồn True Wireless Sony WF-1000XM5', 'sony-wf-1000xm5-true-wireless', 'brand-sony', 'cat-audio', 5990000, 6990000, 14, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80', 'Ông hoàng chống ồn TWS với bộ xử lý tích hợp V2 và bộ xử lý khử tiếng ồn QN2e, màng loa Dynamic Driver X tái tạo âm bass sâu trầm và chi tiết tinh khiết chuẩn Hi-Res LDAC.', '{"driver":"Dynamic Driver X 8.4mm độc quyền","codecs":"LDAC, LC3, AAC, SBC, DSEE Extreme","battery":"8 giờ tai nghe + 16 giờ hộp sạc (bật ANC), sạc nhanh 3 phút được 60 phút nghe","weight":"Tai nghe siêu nhẹ chỉ 5.9g mỗi bên"}', 4.95, 88, 1, 35, 1, 0, 1, 'PUBLISHED'),
  ('prod-sony-wh-1000xm5', 'Tai nghe Chụp Tai Chống Ồn Không Dây Sony WH-1000XM5', 'sony-wh-1000xm5-wireless-anc-headphone', 'brand-sony', 'cat-audio', 7990000, 8990000, 11, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', 'Chống ồn dẫn đầu ngành công nghiệp với 8 micro và 2 bộ xử lý Auto NC Optimizer, thiết kế không khớp nối Noiseless thanh thoát và đệm da mềm Fit Leather êm ái cả ngày.', '{"driver":"Màng loa 30mm vòm sợi carbon tổng hợp siêu nhẹ","battery":"30 giờ (bật chống ồn), sạc nhanh 3 phút nghe được 3 giờ với sạc USB-PD","codecs":"LDAC, AAC, SBC, DSEE Extreme, 360 Reality Audio","weight":"250g"}', 4.97, 156, 1, 25, 1, 0, 1, 'PUBLISHED'),
  ('prod-marshall-emberton-ii', 'Loa Bluetooth Marshall Emberton II 20W', 'loa-bluetooth-marshall-emberton-ii', 'brand-marshall', 'cat-audio', 3990000, 4990000, 20, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80', 'Âm thanh đa hướng 360 độ True Stereophonic đặc trưng của Marshall, thời lượng pin bền bỉ trên 30 giờ và chuẩn kháng nước kháng bụi bền bỉ IP67.', '{"power":"2 x 10W Class D Amplifier","frequency":"60 Hz – 20 kHz, Max SPL 87 dB","battery":"30+ giờ nghe nhạc, sạc đầy trong 3 giờ","waterproof":"IP67 chống nước và bụi hoàn toàn","weight":"0.7 kg"}', 4.91, 134, 1, 40, 0, 0, 1, 'PUBLISHED'),
  ('prod-apple-20w-charger', 'Củ sạc nhanh Apple 20W Type-C Chính Hãng', 'cu-sac-nhanh-apple-20w-type-c-chinh-hang', 'brand-apple', 'cat-accessories', 490000, 590000, 17, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 'Củ sạc chính hãng Apple tối ưu công nghệ Power Delivery 20W, sạc nhanh 50% pin iPhone trong 30 phút, đảm bảo tuổi thọ pin và an toàn tuyệt đối chống cháy nổ.', '{"input":"100-240V ~ 50-60Hz 0.5A","output":"5V/3A hoặc 9V/2.22A (Max 20W PD)","port":"1 x USB Type-C","compatibility":"iPhone 8 đến iPhone 16 Pro Max, iPad"}', 4.93, 580, 1, 150, 0, 0, 1, 'PUBLISHED'),
  ('prod-anker-gan-65w', 'Củ sạc nhanh Anker 735 GaNPrime 65W (2C1A)', 'cu-sac-nhanh-anker-735-ganprime-65w', 'brand-anker', 'cat-accessories', 890000, 1190000, 25, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 'Công nghệ bán dẫn GaN thế hệ mới nhỏ hơn 53%, hỗ trợ sạc đồng thời 3 thiết bị cùng lúc gồm laptop MacBook, iPad và điện thoại với phân bổ công suất thông minh PowerIQ 4.0.', '{"ports":"2 cổng USB-C + 1 cổng USB-A","power":"Tổng công suất tối đa 65W PD/PPS","tech":"GaNPrime, PowerIQ 4.0, ActiveShield 2.0 kiểm soát nhiệt độ 3 triệu lần/ngày","size":"38 x 29 x 66 mm siêu nhỏ gọn"}', 4.96, 230, 1, 90, 0, 0, 1, 'PUBLISHED'),
  ('prod-anker-magsafe-10000', 'Pin sạc dự phòng không dây Từ Tính Anker MagGo Qi2 10.000mAh 15W', 'pin-sac-du-phong-anker-maggo-qi2-10000mah', 'brand-anker', 'cat-accessories', 1390000, 1690000, 18, 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80', 'Chuẩn sạc không dây thế hệ mới Qi2 công suất cực đại 15W hít nam châm chắc chắn cho iPhone 12 - 16 Series, tích hợp màn hình thông minh LED báo % pin và chân đế kim loại tiện lợi.', '{"capacity":"10,000 mAh (38.5Wh)","wireless_output":"15W chuẩn Qi2 MagSafe","wired_output":"USB-C sạc hai chiều tối đa 27W","display":"Màn hình hiển thị phần trăm pin và thời gian sạc đầy"}', 4.94, 175, 1, 65, 1, 1, 1, 'PUBLISHED');

-- Data for table `product_variants` (85 rows)
INSERT INTO `product_variants` (`id`, `product_id`, `name`, `sku`, `price`, `original_price`, `stock`, `color`, `storage`, `image`) VALUES
  ('var-ip16pm-256-desert', 'prod-iphone-16-pro-max', 'Titan Sa Mạc 256GB', 'IP16PM-256-DESERT', 34490000, 37990000, 25, 'Titan Sa Mạc', '256GB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-ip16pm-256-natural', 'prod-iphone-16-pro-max', 'Titan Tự Nhiên 256GB', 'IP16PM-256-NATURAL', 34490000, 37990000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-ip16pm-512-black', 'prod-iphone-16-pro-max', 'Titan Đen 512GB', 'IP16PM-512-BLACK', 40490000, 44490000, 15, 'Titan Đen', '512GB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-ip16pm-1tb-white', 'prod-iphone-16-pro-max', 'Titan Trắng 1TB', 'IP16PM-1TB-WHITE', 46490000, 49990000, 5, 'Titan Trắng', '1TB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-s24u-256-gray', 'prod-galaxy-s24-ultra', 'Xám Titan 256GB', 'S24U-256-GRAY', 29990000, 33990000, 25, 'Xám Titan', '256GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-s24u-256-black', 'prod-galaxy-s24-ultra', 'Đen Titan 256GB', 'S24U-256-BLACK', 29990000, 33990000, 15, 'Đen Titan', '256GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-s24u-512-yellow', 'prod-galaxy-s24-ultra', 'Vàng Titan 512GB', 'S24U-512-YELLOW', 34490000, 37990000, 10, 'Vàng Titan', '512GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-xm14u-512-white', 'prod-xiaomi-14-ultra', 'Trắng Gốm 512GB', 'XM14U-512-WHITE', 27490000, 31990000, 18, 'Trắng Gốm', '512GB', '/images/products/xiaomi-14-ultra.svg'),
  ('var-xm14u-512-black', 'prod-xiaomi-14-ultra', 'Đen Da Thuần Chay 512GB', 'XM14U-512-BLACK', 27490000, 31990000, 12, 'Đen Da Thuần Chay', '512GB', '/images/products/xiaomi-14-ultra.svg'),
  ('var-zfold6-256-gray', 'prod-galaxy-z-fold6', 'Xám Metal 256GB', 'ZFOLD6-256-GRAY', 38990000, 43990000, 12, 'Xám Metal', '256GB', '/images/products/samsung-z-fold6.svg'),
  ('var-zfold6-512-navy', 'prod-galaxy-z-fold6', 'Xanh Navy 512GB', 'ZFOLD6-512-NAVY', 43990000, 48990000, 8, 'Xanh Navy', '512GB', '/images/products/samsung-z-fold6.svg'),
  ('var-ip16p-128-ultra', 'prod-iphone-16-plus', 'Xanh Lưu Ly 128GB', 'IP16P-128-ULTRA', 25490000, 27990000, 25, 'Xanh Lưu Ly (Ultramarine)', '128GB', '/images/products/iphone-16-plus-ultramarine.svg'),
  ('var-ip16p-128-pink', 'prod-iphone-16-plus', 'Hồng Pastel 128GB', 'IP16P-128-PINK', 25490000, 27990000, 15, 'Hồng Pastel', '128GB', '/images/products/iphone-16-plus-ultramarine.svg'),
  ('var-ip16p-256-black', 'prod-iphone-16-plus', 'Đen 256GB', 'IP16P-256-BLACK', 28490000, 30990000, 10, 'Đen', '256GB', '/images/products/iphone-16-plus-ultramarine.svg'),
  ('var-rog8p-512-black', 'prod-rog-phone-8-pro', 'Đen Phantom 512GB', 'ROG8P-512-BLACK', 26990000, 29990000, 15, 'Đen Phantom', '512GB', '/images/products/rog-phone-8-pro.svg'),
  ('var-rog8p-1tb-edition', 'prod-rog-phone-8-pro', 'Đen Phantom AniMe Vision 1TB (24GB RAM)', 'ROG8P-1TB-EDITION', 34990000, 38990000, 10, 'Đen Phantom', '1TB', '/images/products/rog-phone-8-pro.svg'),
  ('var-ip16-128-teal', 'prod-iphone-16-128gb', 'Xanh Mòng Két 128GB', 'IP16-128-TEAL', 21990000, 23990000, 30, 'Xanh Mòng Két (Teal)', '128GB', '/images/products/iphone-16-teal.svg'),
  ('var-ip16-128-white', 'prod-iphone-16-128gb', 'Trắng 128GB', 'IP16-128-WHITE', 21990000, 23990000, 25, 'Trắng', '128GB', '/images/products/iphone-16-teal.svg'),
  ('var-ip16-256-black', 'prod-iphone-16-128gb', 'Đen 256GB', 'IP16-256-BLACK', 24990000, 26990000, 15, 'Đen', '256GB', '/images/products/iphone-16-teal.svg'),
  ('var-rn13pp-256-purple', 'prod-redmi-note-13-pro-plus', 'Tím Cực Quang 256GB', 'RN13PP-256-PURPLE', 8990000, 10490000, 50, 'Tím Cực Quang', '256GB', '/images/products/redmi-note-13-pro-plus.svg'),
  ('var-rn13pp-512-black', 'prod-redmi-note-13-pro-plus', 'Đen Bán Dạ 512GB', 'RN13PP-512-BLACK', 9990000, 11490000, 40, 'Đen Bán Dạ', '512GB', '/images/products/redmi-note-13-pro-plus.svg'),
  ('var-ip16p-128-desert', 'prod-iphone-16-pro', 'Titan Sa Mạc 128GB', 'IP16P-128-DESERT', 27990000, 29990000, 20, 'Titan Sa Mạc', '128GB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-ip16p-256-natural', 'prod-iphone-16-pro', 'Titan Tự Nhiên 256GB', 'IP16P-256-NATURAL', 30990000, 33490000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-ip15pm-256-natural', 'prod-iphone-15-pro-max', 'Titan Tự Nhiên 256GB', 'IP15PM-256-NATURAL', 28490000, 32990000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-ip15pm-256-blue', 'prod-iphone-15-pro-max', 'Titan Xanh Blue 256GB', 'IP15PM-256-BLUE', 28490000, 32990000, 15, 'Titan Xanh Blue', '256GB', '/images/products/iphone-16-pro-max-desert.svg'),
  ('var-ip15-128-pink', 'prod-iphone-15-128gb', 'Hồng Nhạt 128GB', 'IP15-128-PINK', 18490000, 21990000, 30, 'Hồng Nhạt', '128GB', '/images/products/iphone-16-teal.svg'),
  ('var-ip15-128-blue', 'prod-iphone-15-128gb', 'Xanh Lam 128GB', 'IP15-128-BLUE', 18490000, 21990000, 30, 'Xanh Lam', '128GB', '/images/products/iphone-16-teal.svg'),
  ('var-ip13-128-starlight', 'prod-iphone-13-128gb', 'Trắng Starlight 128GB', 'IP13-128-STARLIGHT', 13490000, 15990000, 40, 'Trắng Ánh Sao (Starlight)', '128GB', '/images/products/iphone-16-teal.svg'),
  ('var-ip13-128-midnight', 'prod-iphone-13-128gb', 'Đen Midnight 128GB', 'IP13-128-MIDNIGHT', 13490000, 15990000, 40, 'Đen Nửa Đêm (Midnight)', '128GB', '/images/products/iphone-16-teal.svg'),
  ('var-s24p-256-gray', 'prod-galaxy-s24-plus', 'Xám Cobalt 256GB', 'S24P-256-GRAY', 22490000, 26990000, 20, 'Xám Cobalt', '256GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-s24p-256-purple', 'prod-galaxy-s24-plus', 'Tím Sapphire 256GB', 'S24P-256-PURPLE', 22490000, 26990000, 15, 'Tím Sapphire', '256GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-s24-256-black', 'prod-galaxy-s24', 'Đen Onyx 256GB', 'S24-256-BLACK', 17990000, 22990000, 20, 'Đen Onyx', '256GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-s24-256-yellow', 'prod-galaxy-s24', 'Vàng Amber 256GB', 'S24-256-YELLOW', 17990000, 22990000, 20, 'Vàng Amber', '256GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-zflip6-256-mint', 'prod-galaxy-z-flip6', 'Xanh Mint 256GB', 'ZFLIP6-256-MINT', 24990000, 28990000, 18, 'Xanh Mint', '256GB', '/images/products/samsung-z-fold6.svg'),
  ('var-zflip6-256-yellow', 'prod-galaxy-z-flip6', 'Vàng Solar 256GB', 'ZFLIP6-256-YELLOW', 24990000, 28990000, 12, 'Vàng Solar', '256GB', '/images/products/samsung-z-fold6.svg'),
  ('var-a55-128-blue', 'prod-galaxy-a55-5g', 'Xanh Iceblue 128GB', 'A55-128-BLUE', 8990000, 9990000, 45, 'Xanh Iceblue', '128GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-a55-128-navy', 'prod-galaxy-a55-5g', 'Xanh Đen Navy 128GB', 'A55-128-NAVY', 8990000, 9990000, 30, 'Xanh Đen Navy', '128GB', '/images/products/samsung-s24-ultra.svg'),
  ('var-xm14tp-512-gray', 'prod-xiaomi-14t-pro', 'Xám Titan 512GB', 'XM14TP-512-GRAY', 16490000, 17990000, 18, 'Xám Titan', '512GB', '/images/products/xiaomi-14-ultra.svg'),
  ('var-xm14tp-512-black', 'prod-xiaomi-14t-pro', 'Đen Titan 512GB', 'XM14TP-512-BLACK', 16490000, 17990000, 12, 'Đen Titan', '512GB', '/images/products/xiaomi-14-ultra.svg'),
  ('var-xm14-256-green', 'prod-xiaomi-14-256gb', 'Xanh Ngọc Cẩm Thạch 256GB', 'XM14-256-GREEN', 18990000, 22990000, 20, 'Xanh Ngọc Cẩm Thạch', '256GB', '/images/products/xiaomi-14-ultra.svg'),
  ('var-xm14-256-black', 'prod-xiaomi-14-256gb', 'Đen 256GB', 'XM14-256-BLACK', 18990000, 22990000, 15, 'Đen Cổ Điển', '256GB', '/images/products/xiaomi-14-ultra.svg'),
  ('var-pocof6p-512-white', 'prod-poco-f6-pro', 'Trắng Tinh Thể 512GB', 'POCOF6P-512-WHITE', 12490000, 13990000, 25, 'Trắng Tinh Thể', '512GB', '/images/products/redmi-note-13-pro-plus.svg'),
  ('var-pocof6p-512-black', 'prod-poco-f6-pro', 'Đen Sao Băng 512GB', 'POCOF6P-512-BLACK', 12490000, 13990000, 20, 'Đen Sao Băng', '512GB', '/images/products/redmi-note-13-pro-plus.svg'),
  ('var-oppo-x7u-brown', 'prod-oppo-find-x7-ultra', 'Nâu Biển Sâu Da Thuần Chay 512GB', 'OPPO-X7U-BROWN', 24990000, 27990000, 12, 'Nâu Biển Sâu', '512GB', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80'),
  ('var-oppo-x7u-black', 'prod-oppo-find-x7-ultra', 'Đen Vực Thẳm 512GB', 'OPPO-X7U-BLACK', 24990000, 27990000, 8, 'Đen Vực Thẳm', '512GB', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80'),
  ('var-oppo-r12p-silver', 'prod-oppo-reno12-pro', 'Bạc Dòng Chảy 512GB', 'OPPO-R12P-SILVER', 15490000, 16990000, 25, 'Bạc Dòng Chảy', '512GB', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80'),
  ('var-oppo-r12p-brown', 'prod-oppo-reno12-pro', 'Nâu Tinh Tế 512GB', 'OPPO-R12P-BROWN', 15490000, 16990000, 15, 'Nâu Hổ Phách', '512GB', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80'),
  ('var-vivo-x100p-orange', 'prod-vivo-x100-pro', 'Cam Ánh Dương Da 512GB', 'VIVO-X100P-ORANGE', 21990000, 24990000, 15, 'Cam Ánh Dương', '512GB', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80'),
  ('var-vivo-x100p-black', 'prod-vivo-x100-pro', 'Đen Tinh Vân 512GB', 'VIVO-X100P-BLACK', 21990000, 24990000, 10, 'Đen Tinh Vân', '512GB', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80'),
  ('var-vivo-v40-silver', 'prod-vivo-v40-5g', 'Bạc Ánh Trăng 256GB', 'VIVO-V40-SILVER', 11990000, 12990000, 20, 'Bạc Ánh Trăng', '256GB', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80'),
  ('var-vivo-v40-purple', 'prod-vivo-v40-5g', 'Tím Thạch Anh 256GB', 'VIVO-V40-PURPLE', 11990000, 12990000, 15, 'Tím Thạch Anh', '256GB', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80'),
  ('var-pixel9pxl-porcelain', 'prod-google-pixel-9-pro-xl', 'Trắng Sứ (Porcelain) 256GB', 'PIXEL9PXL-PORCELAIN', 27990000, 30990000, 12, 'Trắng Sứ (Porcelain)', '256GB', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80'),
  ('var-pixel9pxl-obsidian', 'prod-google-pixel-9-pro-xl', 'Đen Đá (Obsidian) 256GB', 'PIXEL9PXL-OBSIDIAN', 27990000, 30990000, 8, 'Đen Đá (Obsidian)', '256GB', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80'),
  ('var-sony-x1vi-green', 'prod-sony-xperia-1-vi', 'Xanh Rêu Platinum 256GB', 'SONY-X1VI-GREEN', 30990000, 33990000, 8, 'Xanh Rêu Platinum', '256GB', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80'),
  ('var-sony-x1vi-black', 'prod-sony-xperia-1-vi', 'Đen Nhám 256GB', 'SONY-X1VI-BLACK', 30990000, 33990000, 7, 'Đen Nhám Cổ Điển', '256GB', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80'),
  ('var-ipad-m4-11-black', 'prod-ipad-pro-m4-11', 'Đen Không Gian (Space Black) 256GB', 'IPAD-M4-11-BLACK', 27990000, 29990000, 15, 'Đen Không Gian', '256GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'),
  ('var-ipad-m4-11-silver', 'prod-ipad-pro-m4-11', 'Bạc (Silver) 256GB', 'IPAD-M4-11-SILVER', 27990000, 29990000, 15, 'Bạc Tinh Tế', '256GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'),
  ('var-ipad-air6-blue', 'prod-ipad-air-6-m2', 'Xanh Dương Blue 128GB', 'IPAD-AIR6-BLUE', 15990000, 17490000, 25, 'Xanh Dương (Blue)', '128GB', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80'),
  ('var-ipad-air6-gray', 'prod-ipad-air-6-m2', 'Xám Không Gian 128GB', 'IPAD-AIR6-GRAY', 15990000, 17490000, 20, 'Xám Không Gian', '128GB', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80'),
  ('var-ipad-g10-silver', 'prod-ipad-gen-10', 'Bạc Silver 64GB', 'IPAD-G10-SILVER', 8990000, 10490000, 35, 'Bạc Silver', '64GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'),
  ('var-ipad-g10-yellow', 'prod-ipad-gen-10', 'Vàng Hoàng Yến Yellow 64GB', 'IPAD-G10-YELLOW', 8990000, 10490000, 35, 'Vàng Hoàng Yến', '64GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'),
  ('var-tabs9u-256-gray', 'prod-galaxy-tab-s9-ultra', 'Xám Graphite 256GB', 'TABS9U-256-GRAY', 25990000, 32990000, 20, 'Xám Graphite', '256GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'),
  ('var-xmpad6-128-blue', 'prod-xiaomi-pad-6', 'Xanh Thiên Thanh 128GB', 'XMPAD6-128-BLUE', 6490000, 7990000, 35, 'Xanh Thiên Thanh', '128GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'),
  ('var-xmpad6-128-gray', 'prod-xiaomi-pad-6', 'Xám Khoáng Thạch 128GB', 'XMPAD6-128-GRAY', 6490000, 7990000, 25, 'Xám Khoáng Thạch', '128GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'),
  ('var-aws10-46-jetblack', 'prod-apple-watch-s10-46', 'Nhôm Đen Bóng Jet Black 46mm', 'AWS10-46-JETBLACK', 11490000, 11990000, 20, 'Đen Bóng Jet Black', '46mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80'),
  ('var-aws10-46-rosegold', 'prod-apple-watch-s10-46', 'Nhôm Vàng Hồng Rose Gold 46mm', 'AWS10-46-ROSEGOLD', 11490000, 11990000, 20, 'Vàng Hồng Rose Gold', '46mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80'),
  ('var-awu2-49-ocean-black', 'prod-apple-watch-ultra-2', 'Titan Đen - Dây Ocean Đen', 'AWU2-49-OCEAN-BLACK', 21490000, 22990000, 15, 'Titan Đen', '49mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'),
  ('var-awu2-49-trail-orange', 'prod-apple-watch-ultra-2', 'Titan Đen - Dây Trail Loop Cam/Xám', 'AWU2-49-TRAIL-ORANGE', 21490000, 22990000, 10, 'Titan Đen', '49mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'),
  ('var-gw-ultra-47-orange', 'prod-galaxy-watch-ultra', 'Xám Titan - Dây Cam Biển', 'GW-ULTRA-47-ORANGE', 14990000, 16990000, 15, 'Xám Titan', '47mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80'),
  ('var-gw-ultra-47-white', 'prod-galaxy-watch-ultra', 'Trắng Titan - Dây Trắng', 'GW-ULTRA-47-WHITE', 14990000, 16990000, 15, 'Trắng Titan', '47mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80'),
  ('var-gw7-40-green', 'prod-galaxy-watch-7', 'Xanh Quân Đội 40mm', 'GW7-40-GREEN', 6490000, 7490000, 20, 'Xanh Quân Đội', '40mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'),
  ('var-gw7-40-cream', 'prod-galaxy-watch-7', 'Bạc Kem 40mm', 'GW7-40-CREAM', 6490000, 7490000, 20, 'Bạc Kem', '40mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'),
  ('var-app2-usbc-white', 'prod-airpods-pro-2-usbc', 'Trắng White (Hộp Sạc Type-C)', 'APP2-USBC-WHITE', 5490000, 6190000, 85, 'Trắng', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80'),
  ('var-ap4-anc-white', 'prod-airpods-4-anc', 'Trắng White (Bản Chống Ồn ANC)', 'AP4-ANC-WHITE', 4490000, 4790000, 50, 'Trắng', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80'),
  ('var-sony-wf5-black', 'prod-sony-wf-1000xm5', 'Đen Nhám Hi-Res', 'SONY-WF5-BLACK', 5990000, 6990000, 20, 'Đen Nhám', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80'),
  ('var-sony-wf5-silver', 'prod-sony-wf-1000xm5', 'Bạc Bạch Kim', 'SONY-WF5-SILVER', 5990000, 6990000, 15, 'Bạc Bạch Kim', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80'),
  ('var-sony-wh5-black', 'prod-sony-wh-1000xm5', 'Đen Cổ Điển', 'SONY-WH5-BLACK', 7990000, 8990000, 15, 'Đen Cổ Điển', 'Over-Ear', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'),
  ('var-sony-wh5-silver', 'prod-sony-wh-1000xm5', 'Bạc Ánh Bạc', 'SONY-WH5-SILVER', 7990000, 8990000, 10, 'Bạc Ánh Bạc', 'Over-Ear', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'),
  ('var-marshall-emb2-brass', 'prod-marshall-emberton-ii', 'Đen Viền Đồng (Black and Brass)', 'MARSHALL-EMB2-BRASS', 3990000, 4990000, 25, 'Đen Viền Đồng', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80'),
  ('var-marshall-emb2-cream', 'prod-marshall-emberton-ii', 'Màu Kem Cream Vintage', 'MARSHALL-EMB2-CREAM', 3990000, 4990000, 15, 'Kem Vintage', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80'),
  ('var-ap-20w-round', 'prod-apple-20w-charger', 'Trắng White - Chân cắm tròn EU/VN', 'AP-20W-ROUND', 490000, 590000, 150, 'Trắng', '20W', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80'),
  ('var-anker-735-black', 'prod-anker-gan-65w', 'Đen Nhám Xước (Black)', 'ANKER-735-BLACK', 890000, 1190000, 50, 'Đen Nhám Xước', '65W GaN', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80'),
  ('var-anker-735-white', 'prod-anker-gan-65w', 'Trắng Ánh Bạc (Silver White)', 'ANKER-735-WHITE', 890000, 1190000, 40, 'Trắng Bạc', '65W GaN', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80'),
  ('var-anker-mag10k-black', 'prod-anker-magsafe-10000', 'Đen Vũ Trụ (Black)', 'ANKER-MAG10K-BLACK', 1390000, 1690000, 35, 'Đen Vũ Trụ', '10000mAh', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80'),
  ('var-anker-mag10k-white', 'prod-anker-magsafe-10000', 'Trắng Tinh Khiết (White)', 'ANKER-MAG10K-WHITE', 1390000, 1690000, 30, 'Trắng Tinh Khiết', '10000mAh', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80');

-- Data for table `product_images` (126 rows)
INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `display_order`) VALUES
  ('img-prod-iphone-16-pro-max-1', 'prod-iphone-16-pro-max', '/images/products/iphone-16-pro-max-desert.svg', 1),
  ('img-prod-iphone-16-pro-max-2', 'prod-iphone-16-pro-max', '/images/products/iphone-16-pro-max-desert.svg', 2),
  ('img-prod-iphone-16-pro-max-3', 'prod-iphone-16-pro-max', '/images/products/iphone-16-pro-max-desert.svg', 3),
  ('img-prod-galaxy-s24-ultra-1', 'prod-galaxy-s24-ultra', '/images/products/samsung-s24-ultra.svg', 1),
  ('img-prod-galaxy-s24-ultra-2', 'prod-galaxy-s24-ultra', '/images/products/samsung-s24-ultra.svg', 2),
  ('img-prod-galaxy-s24-ultra-3', 'prod-galaxy-s24-ultra', '/images/products/samsung-s24-ultra.svg', 3),
  ('img-prod-xiaomi-14-ultra-1', 'prod-xiaomi-14-ultra', '/images/products/xiaomi-14-ultra.svg', 1),
  ('img-prod-xiaomi-14-ultra-2', 'prod-xiaomi-14-ultra', '/images/products/xiaomi-14-ultra.svg', 2),
  ('img-prod-xiaomi-14-ultra-3', 'prod-xiaomi-14-ultra', '/images/products/xiaomi-14-ultra.svg', 3),
  ('img-prod-galaxy-z-fold6-1', 'prod-galaxy-z-fold6', '/images/products/samsung-z-fold6.svg', 1),
  ('img-prod-galaxy-z-fold6-2', 'prod-galaxy-z-fold6', '/images/products/samsung-z-fold6.svg', 2),
  ('img-prod-galaxy-z-fold6-3', 'prod-galaxy-z-fold6', '/images/products/samsung-z-fold6.svg', 3),
  ('img-prod-iphone-16-plus-1', 'prod-iphone-16-plus', '/images/products/iphone-16-plus-ultramarine.svg', 1),
  ('img-prod-iphone-16-plus-2', 'prod-iphone-16-plus', '/images/products/iphone-16-plus-ultramarine.svg', 2),
  ('img-prod-iphone-16-plus-3', 'prod-iphone-16-plus', '/images/products/iphone-16-plus-ultramarine.svg', 3),
  ('img-prod-rog-phone-8-pro-1', 'prod-rog-phone-8-pro', '/images/products/rog-phone-8-pro.svg', 1),
  ('img-prod-rog-phone-8-pro-2', 'prod-rog-phone-8-pro', '/images/products/rog-phone-8-pro.svg', 2),
  ('img-prod-rog-phone-8-pro-3', 'prod-rog-phone-8-pro', '/images/products/rog-phone-8-pro.svg', 3),
  ('img-prod-iphone-16-128gb-1', 'prod-iphone-16-128gb', '/images/products/iphone-16-teal.svg', 1),
  ('img-prod-iphone-16-128gb-2', 'prod-iphone-16-128gb', '/images/products/iphone-16-teal.svg', 2),
  ('img-prod-iphone-16-128gb-3', 'prod-iphone-16-128gb', '/images/products/iphone-16-teal.svg', 3),
  ('img-prod-redmi-note-13-pro-plus-1', 'prod-redmi-note-13-pro-plus', '/images/products/redmi-note-13-pro-plus.svg', 1),
  ('img-prod-redmi-note-13-pro-plus-2', 'prod-redmi-note-13-pro-plus', '/images/products/redmi-note-13-pro-plus.svg', 2),
  ('img-prod-redmi-note-13-pro-plus-3', 'prod-redmi-note-13-pro-plus', '/images/products/redmi-note-13-pro-plus.svg', 3),
  ('img-prod-iphone-16-pro-1', 'prod-iphone-16-pro', '/images/products/iphone-16-pro-max-desert.svg', 1),
  ('img-prod-iphone-16-pro-2', 'prod-iphone-16-pro', '/images/products/iphone-16-pro-max-desert.svg', 2),
  ('img-prod-iphone-16-pro-3', 'prod-iphone-16-pro', '/images/products/iphone-16-pro-max-desert.svg', 3),
  ('img-prod-iphone-15-pro-max-1', 'prod-iphone-15-pro-max', '/images/products/iphone-16-pro-max-desert.svg', 1),
  ('img-prod-iphone-15-pro-max-2', 'prod-iphone-15-pro-max', '/images/products/iphone-16-pro-max-desert.svg', 2),
  ('img-prod-iphone-15-pro-max-3', 'prod-iphone-15-pro-max', '/images/products/iphone-16-pro-max-desert.svg', 3),
  ('img-prod-iphone-15-128gb-1', 'prod-iphone-15-128gb', '/images/products/iphone-16-teal.svg', 1),
  ('img-prod-iphone-15-128gb-2', 'prod-iphone-15-128gb', '/images/products/iphone-16-teal.svg', 2),
  ('img-prod-iphone-15-128gb-3', 'prod-iphone-15-128gb', '/images/products/iphone-16-teal.svg', 3),
  ('img-prod-iphone-13-128gb-1', 'prod-iphone-13-128gb', '/images/products/iphone-16-teal.svg', 1),
  ('img-prod-iphone-13-128gb-2', 'prod-iphone-13-128gb', '/images/products/iphone-16-teal.svg', 2),
  ('img-prod-iphone-13-128gb-3', 'prod-iphone-13-128gb', '/images/products/iphone-16-teal.svg', 3),
  ('img-prod-galaxy-s24-plus-1', 'prod-galaxy-s24-plus', '/images/products/samsung-s24-ultra.svg', 1),
  ('img-prod-galaxy-s24-plus-2', 'prod-galaxy-s24-plus', '/images/products/samsung-s24-ultra.svg', 2),
  ('img-prod-galaxy-s24-plus-3', 'prod-galaxy-s24-plus', '/images/products/samsung-s24-ultra.svg', 3),
  ('img-prod-galaxy-s24-1', 'prod-galaxy-s24', '/images/products/samsung-s24-ultra.svg', 1),
  ('img-prod-galaxy-s24-2', 'prod-galaxy-s24', '/images/products/samsung-s24-ultra.svg', 2),
  ('img-prod-galaxy-s24-3', 'prod-galaxy-s24', '/images/products/samsung-s24-ultra.svg', 3),
  ('img-prod-galaxy-z-flip6-1', 'prod-galaxy-z-flip6', '/images/products/samsung-z-fold6.svg', 1),
  ('img-prod-galaxy-z-flip6-2', 'prod-galaxy-z-flip6', '/images/products/samsung-z-fold6.svg', 2),
  ('img-prod-galaxy-z-flip6-3', 'prod-galaxy-z-flip6', '/images/products/samsung-z-fold6.svg', 3),
  ('img-prod-galaxy-a55-5g-1', 'prod-galaxy-a55-5g', '/images/products/samsung-s24-ultra.svg', 1),
  ('img-prod-galaxy-a55-5g-2', 'prod-galaxy-a55-5g', '/images/products/samsung-s24-ultra.svg', 2),
  ('img-prod-galaxy-a55-5g-3', 'prod-galaxy-a55-5g', '/images/products/samsung-s24-ultra.svg', 3),
  ('img-prod-xiaomi-14t-pro-1', 'prod-xiaomi-14t-pro', '/images/products/xiaomi-14-ultra.svg', 1),
  ('img-prod-xiaomi-14t-pro-2', 'prod-xiaomi-14t-pro', '/images/products/xiaomi-14-ultra.svg', 2),
  ('img-prod-xiaomi-14t-pro-3', 'prod-xiaomi-14t-pro', '/images/products/xiaomi-14-ultra.svg', 3),
  ('img-prod-xiaomi-14-256gb-1', 'prod-xiaomi-14-256gb', '/images/products/xiaomi-14-ultra.svg', 1),
  ('img-prod-xiaomi-14-256gb-2', 'prod-xiaomi-14-256gb', '/images/products/xiaomi-14-ultra.svg', 2),
  ('img-prod-xiaomi-14-256gb-3', 'prod-xiaomi-14-256gb', '/images/products/xiaomi-14-ultra.svg', 3),
  ('img-prod-poco-f6-pro-1', 'prod-poco-f6-pro', '/images/products/redmi-note-13-pro-plus.svg', 1),
  ('img-prod-poco-f6-pro-2', 'prod-poco-f6-pro', '/images/products/redmi-note-13-pro-plus.svg', 2),
  ('img-prod-poco-f6-pro-3', 'prod-poco-f6-pro', '/images/products/redmi-note-13-pro-plus.svg', 3),
  ('img-prod-oppo-find-x7-ultra-1', 'prod-oppo-find-x7-ultra', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-oppo-find-x7-ultra-2', 'prod-oppo-find-x7-ultra', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-oppo-find-x7-ultra-3', 'prod-oppo-find-x7-ultra', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-oppo-reno12-pro-1', 'prod-oppo-reno12-pro', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-oppo-reno12-pro-2', 'prod-oppo-reno12-pro', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-oppo-reno12-pro-3', 'prod-oppo-reno12-pro', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-vivo-x100-pro-1', 'prod-vivo-x100-pro', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-vivo-x100-pro-2', 'prod-vivo-x100-pro', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-vivo-x100-pro-3', 'prod-vivo-x100-pro', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-vivo-v40-5g-1', 'prod-vivo-v40-5g', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-vivo-v40-5g-2', 'prod-vivo-v40-5g', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-vivo-v40-5g-3', 'prod-vivo-v40-5g', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-google-pixel-9-pro-xl-1', 'prod-google-pixel-9-pro-xl', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-google-pixel-9-pro-xl-2', 'prod-google-pixel-9-pro-xl', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-google-pixel-9-pro-xl-3', 'prod-google-pixel-9-pro-xl', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-sony-xperia-1-vi-1', 'prod-sony-xperia-1-vi', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-sony-xperia-1-vi-2', 'prod-sony-xperia-1-vi', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-sony-xperia-1-vi-3', 'prod-sony-xperia-1-vi', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-ipad-pro-m4-11-1', 'prod-ipad-pro-m4-11', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-ipad-pro-m4-11-2', 'prod-ipad-pro-m4-11', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-ipad-pro-m4-11-3', 'prod-ipad-pro-m4-11', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-ipad-air-6-m2-1', 'prod-ipad-air-6-m2', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-ipad-air-6-m2-2', 'prod-ipad-air-6-m2', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-ipad-air-6-m2-3', 'prod-ipad-air-6-m2', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-ipad-gen-10-1', 'prod-ipad-gen-10', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-ipad-gen-10-2', 'prod-ipad-gen-10', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-ipad-gen-10-3', 'prod-ipad-gen-10', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-galaxy-tab-s9-ultra-1', 'prod-galaxy-tab-s9-ultra', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-galaxy-tab-s9-ultra-2', 'prod-galaxy-tab-s9-ultra', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-galaxy-tab-s9-ultra-3', 'prod-galaxy-tab-s9-ultra', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-xiaomi-pad-6-1', 'prod-xiaomi-pad-6', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-xiaomi-pad-6-2', 'prod-xiaomi-pad-6', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-xiaomi-pad-6-3', 'prod-xiaomi-pad-6', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-apple-watch-s10-46-1', 'prod-apple-watch-s10-46', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-apple-watch-s10-46-2', 'prod-apple-watch-s10-46', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-apple-watch-s10-46-3', 'prod-apple-watch-s10-46', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-apple-watch-ultra-2-1', 'prod-apple-watch-ultra-2', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-apple-watch-ultra-2-2', 'prod-apple-watch-ultra-2', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-apple-watch-ultra-2-3', 'prod-apple-watch-ultra-2', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-galaxy-watch-ultra-1', 'prod-galaxy-watch-ultra', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-galaxy-watch-ultra-2', 'prod-galaxy-watch-ultra', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-galaxy-watch-ultra-3', 'prod-galaxy-watch-ultra', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-galaxy-watch-7-1', 'prod-galaxy-watch-7', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-galaxy-watch-7-2', 'prod-galaxy-watch-7', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-galaxy-watch-7-3', 'prod-galaxy-watch-7', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-airpods-pro-2-usbc-1', 'prod-airpods-pro-2-usbc', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-airpods-pro-2-usbc-2', 'prod-airpods-pro-2-usbc', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-airpods-pro-2-usbc-3', 'prod-airpods-pro-2-usbc', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-airpods-4-anc-1', 'prod-airpods-4-anc', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-airpods-4-anc-2', 'prod-airpods-4-anc', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-airpods-4-anc-3', 'prod-airpods-4-anc', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-sony-wf-1000xm5-1', 'prod-sony-wf-1000xm5', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-sony-wf-1000xm5-2', 'prod-sony-wf-1000xm5', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-sony-wf-1000xm5-3', 'prod-sony-wf-1000xm5', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-sony-wh-1000xm5-1', 'prod-sony-wh-1000xm5', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-sony-wh-1000xm5-2', 'prod-sony-wh-1000xm5', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-sony-wh-1000xm5-3', 'prod-sony-wh-1000xm5', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-marshall-emberton-ii-1', 'prod-marshall-emberton-ii', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-marshall-emberton-ii-2', 'prod-marshall-emberton-ii', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-marshall-emberton-ii-3', 'prod-marshall-emberton-ii', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-apple-20w-charger-1', 'prod-apple-20w-charger', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-apple-20w-charger-2', 'prod-apple-20w-charger', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-apple-20w-charger-3', 'prod-apple-20w-charger', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-anker-gan-65w-1', 'prod-anker-gan-65w', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-anker-gan-65w-2', 'prod-anker-gan-65w', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-anker-gan-65w-3', 'prod-anker-gan-65w', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80', 3),
  ('img-prod-anker-magsafe-10000-1', 'prod-anker-magsafe-10000', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80', 1),
  ('img-prod-anker-magsafe-10000-2', 'prod-anker-magsafe-10000', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80', 2),
  ('img-prod-anker-magsafe-10000-3', 'prod-anker-magsafe-10000', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80', 3);

-- Data for table `reviews` (18 rows)
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `title`, `content`, `images`, `is_verified_purchase`, `status`, `created_at`) VALUES
  ('rev-01', 'prod-iphone-16-pro-max', 'usr-cust-01', 5, 'Màu Titan Sa Mạc bên ngoài quá đẹp!', 'Máy cầm rất đầm tay, viền màn hình siêu mỏng nhìn rất sướng mắt. Nút Camera Control ban đầu bấm hơi lạ nhưng quen rồi chụp ảnh rất tiện, trượt chỉnh zoom cực mượt. Pin trâu dùng cả ngày từ 7h sáng đến đêm còn 35%. Rất đáng tiền!', '["/images/products/iphone-16-pro-max-desert.svg"]', 1, 'APPROVED', '2026-09-25 14:32:00'),
  ('rev-02', 'prod-iphone-16-pro-max', 'usr-cust-02', 5, 'Hiệu năng A18 Pro đỉnh cao, không còn bị nóng máy', 'Apple đã cải thiện tản nhiệt rất tốt trên 16 Pro Max, chơi Genshin Impact với PUBG ở mức đồ họa cao nhất không hề bị bóp xung hay tối màn hình như dòng 15 Pro Max trước đây. Shop đóng gói cẩn thận 3 lớp chống sốc.', NULL, 1, 'APPROVED', '2026-09-28 09:15:20'),
  ('rev-03', 'prod-iphone-16-pro-max', 'usr-cust-04', 5, 'Chụp ảnh sắc nét, mic thu âm lọc gió cực xịn', 'Chức năng Audio Mix mới xử lý lọc tạp âm video như quay trong studio chuyên nghiệp vậy. Giao hàng hỏa tốc trong 2 tiếng tại Hà Nội, nhân viên hỗ trợ dán cường lực nhiệt tình.', NULL, 1, 'APPROVED', '2026-10-02 18:40:11'),
  ('rev-04', 'prod-galaxy-s24-ultra', 'usr-cust-03', 5, 'Màn hình chống chói Gorilla Armor quá đỉnh', 'Đi ngoài trời nắng gắt nhìn rõ như trong nhà luôn, kính Armor chống phản chiếu cực kỳ xuất sắc. Galaxy AI dịch cuộc gọi và tóm tắt văn bản rất hữu ích cho công việc hàng ngày của mình.', '["/images/products/samsung-s24-ultra.svg"]', 1, 'APPROVED', '2026-08-15 11:20:45'),
  ('rev-05', 'prod-galaxy-s24-ultra', 'usr-cust-05', 5, 'Camera zoom 5x 50MP nét căng từng chi tiết', 'Camera zoom đêm cực sáng, khử nhiễu AI quá tốt. Bút S-Pen rút ra ghi chú tiện lợi, khung viền titan hoàn thiện cứng cáp, màu xám sang trọng.', NULL, 1, 'APPROVED', '2026-08-20 16:05:00'),
  ('rev-06', 'prod-galaxy-s24-ultra', 'usr-cust-07', 4, 'Máy rất tốt, chỉ là hơi nặng tay một chút', 'Dùng một tay hơi mỏi nếu nằm lướt web lâu nhưng bù lại màn hình to 6.8 inch xem phim siêu đã mắt. Pin trâu onscreen hơn 8 tiếng.', NULL, 1, 'APPROVED', '2026-09-01 20:30:10'),
  ('rev-07', 'prod-xiaomi-14-ultra', 'usr-cust-06', 5, 'Màu ảnh Leica chân thực và nghệ thuật', 'Đúng chuẩn máy ảnh chuyên nghiệp thu nhỏ. Khẩu độ biến thiên cơ học f/1.63 - f/4.0 chụp xóa phông quang học tự nhiên không hề bị lẹm viền như xóa phông phần mềm.', NULL, 1, 'APPROVED', '2026-09-10 10:45:00'),
  ('rev-08', 'prod-xiaomi-14-ultra', 'usr-cust-08', 5, 'Sạc 90W nhanh kinh hoàng, 30 phút là đầy pin', 'Sạc cực nhanh, máy mát, màn hình 2K 120Hz sắc nét. Mặt lưng da cầm bám tay và không để lại dấu vân tay. Đáng đồng tiền bát gạo.', NULL, 1, 'APPROVED', '2026-09-18 14:12:30'),
  ('rev-09', 'prod-galaxy-z-fold6', 'usr-cust-09', 5, 'Mỏng nhẹ hơn Fold5 rất nhiều, viền phẳng cầm chắc tay', 'Bản lề khép khít rịt, màn hình phụ bên ngoài tỷ lệ rộng hơn nên gõ phím rất dễ dàng không bị cấn tay như trước. Mở ra màn hình 7.6 inch đọc file excel và đa nhiệm 3 ứng dụng mượt mà tuyệt vời.', NULL, 1, 'APPROVED', '2026-09-22 17:55:00'),
  ('rev-10', 'prod-rog-phone-8-pro', 'usr-cust-10', 5, 'Cỗ máy cày game bất bại!', 'Màn hình 165Hz mượt không tì vết, phím siêu âm AirTrigger gán nút bắn súng PUBG cực kỳ nhạy bén. Đèn LED AniMe Vision phía sau lưng tùy biến icon độc lạ cá tính.', NULL, 1, 'APPROVED', '2026-09-24 21:10:00'),
  ('rev-11', 'prod-airpods-pro-2-usbc', 'usr-cust-01', 5, 'Chống ồn tốt nhất hiện nay, đeo cực êm', 'Bật chống ồn một cái là mọi tiếng ồn còi xe ngoài đường hay tiếng quạt văn phòng biến mất hoàn toàn. Cổng sạc Type-C dùng chung cáp với iPhone 16 Pro Max tiện không tả được.', NULL, 1, 'APPROVED', '2026-10-05 08:30:00'),
  ('rev-12', 'prod-airpods-pro-2-usbc', 'usr-cust-03', 5, 'Âm bass dày, mic đàm thoại trong trẻo', 'Chạy xe máy ngoài đường nói chuyện người bên kia vẫn nghe rõ ràng không bị tiếng gió lọt vào. Shop hỗ trợ nhiệt tình, hàng chính hãng nguyên seal kích hoạt đủ 12 tháng.', NULL, 1, 'APPROVED', '2026-10-12 15:45:00'),
  ('rev-13', 'prod-apple-watch-ultra-2', 'usr-cust-02', 5, 'Titan đen quá ngầu và nam tính', 'Bản titan đen mới này hoàn thiện tuyệt mỹ, viền DLC chống trầy tốt. Đi leo núi hay bơi lội pin dùng tẹt ga 3 ngày mới phải sạc lại. Rất hài lòng!', NULL, 1, 'APPROVED', '2026-10-08 19:20:00'),
  ('rev-14', 'prod-ipad-pro-m4-11', 'usr-cust-04', 5, 'Màn Tandem OLED đẹp nghẹt thở, máy siêu mỏng', 'Cầm lên tay mà không tin được máy lại mỏng nhẹ như thế. Màn hình màu đen sâu thẳm, độ sáng HDR rực rỡ. Chip M4 vẽ Procreate với dựng video 4K nhanh như chớp.', NULL, 1, 'APPROVED', '2026-10-15 13:10:00'),
  ('rev-15', 'prod-sony-wh-1000xm5', 'usr-cust-05', 5, 'Âm thanh Hi-Res đỉnh cao, đệm tai êm ru', 'Đeo làm việc cả ngày 8 tiếng không bị đau tai hay bí bách. Chống ồn đỉnh, nghe nhạc jazz hay vocal của Sony thì không tai nghe nào qua mặt được.', NULL, 1, 'APPROVED', '2026-10-20 16:35:00'),
  ('rev-16', 'prod-anker-gan-65w', 'usr-cust-07', 5, '1 củ sạc cho cả MacBook và iPhone', 'Đi công tác chỉ cần mang duy nhất củ sạc này là xong. Sạc cùng lúc điện thoại và máy tính xách tay máy chỉ hơi ấm nhẹ, không bị nóng ran như sạc thường. Hàng Anker chuẩn chỉ.', NULL, 1, 'APPROVED', '2026-10-22 11:00:00'),
  ('rev-17', 'prod-anker-magsafe-10000', 'usr-cust-08', 5, 'Nam châm hít chặt, sạc không dây 15W chuẩn Qi2', 'Hít vào mặt lưng iPhone 16 Pro Max cực chắc chắn không sợ rơi, sạc nhanh 15W có animation vòng tròn sạc. Màn hình báo đúng thời gian còn lại rất tiện.', NULL, 1, 'APPROVED', '2026-10-25 14:40:00'),
  ('rev-18', 'prod-redmi-note-13-pro-plus', 'usr-cust-06', 5, 'Máy tầm trung mà có cả sạc 120W và kháng nước IP68', 'Phân khúc 8-9 triệu mà thiết kế màn cong viền mỏng dính như flagship, camera 200MP chụp nét căng. Sạc 120W cắm vào tắm rửa xong là 100% pin. Quá hài lòng với tầm giá!', NULL, 1, 'APPROVED', '2026-10-28 17:25:00');

-- Data for table `orders` (8 rows)
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `recipient_name`, `recipient_phone`, `shipping_province`, `shipping_district`, `shipping_ward`, `shipping_address`, `payment_method`, `payment_status`, `status`, `subtotal`, `shipping_fee`, `discount_amount`, `total`, `notes`, `created_at`) VALUES
  ('ord-20261101-001', 'MD-20261101-001', 'usr-cust-01', 'Nguyễn Văn An', '0912345678', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng Hậu', 'Số 18 Phố Duy Tân, Tòa nhà FPT', 'VNPAY', 'PAID', 'DELIVERED', 39980000, 0, 500000, 39480000, 'Giao giờ hành chính. Đã thanh toán qua VNPay thành công.', '2026-11-01 09:30:00'),
  ('ord-20261102-002', 'MD-20261102-002', 'usr-cust-02', 'Trần Minh Trí', '0938112233', 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', '68 Nguyễn Huệ, Tòa nhà Bitexco', 'MOMO', 'PAID', 'DELIVERED', 29990000, 0, 1000000, 28990000, 'Gọi trước khi đến 15 phút', '2026-11-02 14:15:00'),
  ('ord-20261103-003', 'MD-20261103-003', 'usr-cust-03', 'Lê Hoàng Nam', '0988776655', 'Đà Nẵng', 'Hải Châu', 'Thạch Thang', '42 Bạch Đằng, P. Thạch Thang', 'COD', 'PAID', 'DELIVERED', 27490000, 30000, 0, 27520000, 'Cho kiểm tra hàng trước khi nhận', '2026-11-03 10:00:00'),
  ('ord-20261104-004', 'MD-20261104-004', 'usr-cust-04', 'Phạm Thu Hương', '0977223344', 'Hồ Chí Minh', 'Quận 7', 'Tân Phú', 'Căn A08-12 Chung cư Scenic Valley, Nguyễn Văn Linh', 'BANK_TRANSFER', 'PAID', 'DELIVERED', 33480000, 0, 500000, 32980000, 'Giao lên tận phòng chung cư', '2026-11-04 16:20:00'),
  ('ord-20261105-005', 'MD-20261105-005', 'usr-cust-05', 'Đặng Quốc Huy', '0966554433', 'Hải Phòng', 'Lê Chân', 'An Dương', 'Số 15/45 Tôn Đức Thắng', 'COD', 'UNPAID', 'SHIPPED', 26990000, 35000, 0, 27025000, 'Đang vận chuyển hỏa tốc', '2026-11-05 11:45:00'),
  ('ord-20261106-006', 'MD-20261106-006', 'usr-cust-06', 'Võ Kim Ngân', '0919888999', 'Cần Thơ', 'Ninh Kiều', 'Xuân Khánh', 'Số 120 Đường 30 Tháng 4', 'VNPAY', 'PAID', 'PROCESSING', 8990000, 0, 200000, 8790000, 'Kho đang đóng gói sản phẩm', '2026-11-06 08:30:00'),
  ('ord-20261107-007', 'MD-20261107-007', 'usr-cust-07', 'Hoàng Đức Thành', '0903456789', 'Bình Dương', 'Thủ Dầu Một', 'Phú Hòa', 'Đường D1, Khu dân cư Phú Hòa 1', 'MOMO', 'PAID', 'CONFIRMED', 21990000, 0, 500000, 21490000, 'Đơn hàng đã được xác nhận', '2026-11-07 15:10:00'),
  ('ord-20261108-008', 'MD-20261108-008', 'usr-cust-08', 'Bùi Mai Anh', '0983123456', 'Hà Nội', 'Đống Đa', 'Láng Hạ', 'Số 22 Ngõ 105 Láng Hạ', 'COD', 'UNPAID', 'PENDING', 6880000, 30000, 0, 6910000, 'Chờ nhân viên gọi điện xác nhận', '2026-11-08 10:20:00');

-- Data for table `order_items` (11 rows)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `product_name`, `variant_name`, `sku`, `thumbnail`, `price`, `quantity`, `total_price`) VALUES
  ('item-01-1', 'ord-20261101-001', 'prod-iphone-16-pro-max', 'var-ip16pm-256-desert', 'iPhone 16 Pro Max 256GB VN/A', 'Titan Sa Mạc 256GB', 'IP16PM-256-DESERT', '/images/products/iphone-16-pro-max-desert.svg', 34490000, 1, 34490000),
  ('item-01-2', 'ord-20261101-001', 'prod-airpods-pro-2-usbc', 'var-app2-usbc-white', 'Tai nghe Bluetooth Apple AirPods Pro 2 MagSafe USB-C', 'Trắng White (Hộp Sạc Type-C)', 'APP2-USBC-WHITE', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 5490000, 1, 5490000),
  ('item-02-1', 'ord-20261102-002', 'prod-galaxy-s24-ultra', 'var-s24u-256-gray', 'Samsung Galaxy S24 Ultra 5G 256GB', 'Xám Titan 256GB', 'S24U-256-GRAY', '/images/products/samsung-s24-ultra.svg', 29990000, 1, 29990000),
  ('item-03-1', 'ord-20261103-003', 'prod-xiaomi-14-ultra', 'var-xm14u-512-white', 'Xiaomi 14 Ultra Leica 512GB', 'Trắng Gốm 512GB', 'XM14U-512-WHITE', '/images/products/xiaomi-14-ultra.svg', 27490000, 1, 27490000),
  ('item-04-1', 'ord-20261104-004', 'prod-ipad-pro-m4-11', 'var-ipad-m4-11-black', 'iPad Pro 11 inch M4 Wi-Fi 256GB', 'Đen Không Gian (Space Black) 256GB', 'IPAD-M4-11-BLACK', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80', 27990000, 1, 27990000),
  ('item-04-2', 'ord-20261104-004', 'prod-airpods-pro-2-usbc', 'var-app2-usbc-white', 'Tai nghe Bluetooth Apple AirPods Pro 2 MagSafe USB-C', 'Trắng White (Hộp Sạc Type-C)', 'APP2-USBC-WHITE', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 5490000, 1, 5490000),
  ('item-05-1', 'ord-20261105-005', 'prod-rog-phone-8-pro', 'var-rog8p-512-black', 'ASUS ROG Phone 8 Pro 512GB', 'Đen Phantom 512GB', 'ROG8P-512-BLACK', '/images/products/rog-phone-8-pro.svg', 26990000, 1, 26990000),
  ('item-06-1', 'ord-20261106-006', 'prod-redmi-note-13-pro-plus', 'var-rn13pp-256-purple', 'Xiaomi Redmi Note 13 Pro+ 5G 256GB', 'Tím Cực Quang 256GB', 'RN13PP-256-PURPLE', '/images/products/redmi-note-13-pro-plus.svg', 8990000, 1, 8990000),
  ('item-07-1', 'ord-20261107-007', 'prod-iphone-16-128gb', 'var-ip16-128-teal', 'iPhone 16 128GB VN/A', 'Xanh Mòng Két 128GB', 'IP16-128-TEAL', '/images/products/iphone-16-teal.svg', 21990000, 1, 21990000),
  ('item-08-1', 'ord-20261108-008', 'prod-airpods-4-anc', 'var-ap4-anc-white', 'Tai nghe Bluetooth Apple AirPods 4 Chống Ồn Chủ Động (ANC)', 'Trắng White (Bản Chống Ồn ANC)', 'AP4-ANC-WHITE', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80', 4490000, 1, 4490000),
  ('item-08-2', 'ord-20261108-008', 'prod-anker-magsafe-10000', 'var-anker-mag10k-black', 'Pin sạc dự phòng không dây Từ Tính Anker MagGo Qi2 10.000mAh 15W', 'Đen Vũ Trụ (Black)', 'ANKER-MAG10K-BLACK', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80', 1390000, 1, 1390000);

-- Data for table `carts` (2 rows)
INSERT INTO `carts` (`id`, `user_id`, `session_token`) VALUES
  ('cart-usr-01', 'usr-cust-01', 'sess-usr-01'),
  ('cart-usr-02', 'usr-cust-02', 'sess-usr-02');

-- Data for table `cart_items` (3 rows)
INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `variant_id`, `quantity`) VALUES
  ('ci-01', 'cart-usr-01', 'prod-apple-watch-ultra-2', 'var-awu2-49-ocean-black', 1),
  ('ci-02', 'cart-usr-01', 'prod-anker-gan-65w', 'var-anker-735-black', 2),
  ('ci-03', 'cart-usr-02', 'prod-sony-wh-1000xm5', 'var-sony-wh5-black', 1);

-- Data for table `coupons` (8 rows)
INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `is_active`) VALUES
  ('coup-welcome-500', 'MDWELCOME', 'Giảm trực tiếp 500.000đ cho đơn hàng đầu tiên từ 10.000.000đ', 'FIXED_AMOUNT', 500000, 10000000, 500000, 1000, 48, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1),
  ('coup-flagship-10', 'FLAGSHIP10', 'Giảm 10% tối đa 1.000.000đ cho dòng Flagship từ 20.000.000đ', 'PERCENT', 10, 20000000, 1000000, 500, 32, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1),
  ('coup-ip16-mega', 'IPHONE16MEGA', 'Giảm 1.200.000đ khi mua iPhone 16 Series bất kỳ', 'FIXED_AMOUNT', 1200000, 20000000, 1200000, 300, 65, '2026-09-01 00:00:00', '2027-06-30 23:59:59', 1),
  ('coup-samfan', 'SAMFAN500', 'Đặc quyền SamFan giảm ngay 500.000đ cho đơn Galaxy từ 8.000.000đ', 'FIXED_AMOUNT', 500000, 8000000, 500000, 500, 82, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1),
  ('coup-freeship', 'FREESHIP50', 'Miễn phí vận chuyển toàn quốc giảm tối đa 50.000đ', 'FIXED_AMOUNT', 50000, 500000, 50000, 2000, 340, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1),
  ('coup-accessory-15', 'ACCESSORY15', 'Giảm 15% khi mua phụ kiện củ sạc, cáp sạc, pin dự phòng', 'PERCENT', 15, 400000, 300000, 1000, 145, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1),
  ('coup-tet2026', 'TET2026', 'Lì xì chào năm mới giảm 888.000đ cho đơn từ 15.000.000đ', 'FIXED_AMOUNT', 888000, 15000000, 888000, 888, 120, '2026-01-01 00:00:00', '2027-03-31 23:59:59', 1),
  ('coup-vipmember', 'MDVIPMEMBER', 'Ưu đãi thành viên VIP MD Member giảm 5% không giới hạn', 'PERCENT', 5, 5000000, 2000000, 500, 90, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1);

-- Data for table `banners` (6 rows)
INSERT INTO `banners` (`id`, `title`, `subtitle`, `image_url`, `link_url`, `position`, `sort_order`, `is_active`) VALUES
  ('ban-hero-01', 'iPhone 16 Pro Max - Titan Sa Mạc', 'Sức mạnh chip Apple A18 Pro 3nm cùng nút Camera Control', '/images/products/iphone-16-pro-max-desert.svg', '/products/iphone-16-pro-max-256gb', 'hero_slider', 1, 1),
  ('ban-hero-02', 'Samsung Galaxy S24 Ultra - Quyền Năng AI', 'Trải nghiệm kỷ nguyên trí tuệ nhân tạo Galaxy AI cùng Camera 200MP', '/images/products/samsung-s24-ultra.svg', '/products/samsung-galaxy-s24-ultra-5g', 'hero_slider', 2, 1),
  ('ban-hero-03', 'Xiaomi 14 Ultra - Kiệt Tác Leica 1-Inch', 'Hệ thống 4 camera 50MP Leica quang học và sạc siêu tốc 90W', '/images/products/xiaomi-14-ultra.svg', '/products/xiaomi-14-ultra-leica-512gb', 'hero_slider', 3, 1),
  ('ban-hero-04', 'Galaxy Z Fold6 - Mở Rộng Thế Giới', 'Bản lề kép siêu mỏng nhẹ, tối ưu đa nhiệm Galaxy AI màn hình lớn 7.6 inch', '/images/products/samsung-z-fold6.svg', '/products/samsung-galaxy-z-fold6-5g-256gb', 'hero_slider', 4, 1),
  ('ban-hero-05', 'ASUS ROG Phone 8 Pro - Quái Thú Gaming', 'Màn hình AMOLED 165Hz, Snapdragon 8 Gen 3 và phím siêu âm AirTrigger', '/images/products/rog-phone-8-pro.svg', '/products/asus-rog-phone-8-pro-512gb', 'hero_slider', 5, 1),
  ('ban-promo-01', 'Hội Viên MD Member - Tích Điểm Đổi Quà', 'Giảm thêm đến 5% trên mọi hóa đơn và voucher sinh nhật cực giá trị', '/images/banners/banner-1.jpg', '/member', 'sub_banner', 6, 1);

SET FOREIGN_KEY_CHECKS = 1;
-- ========================== XONG ============================
