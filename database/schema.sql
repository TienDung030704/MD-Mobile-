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
-- DỮ LIỆU MẪU KHỞI TẠO CHÍNH THỨC (SEED DATA)
-- Khớp hoàn hảo với giao diện MD Mobile đang chạy
-- ============================================================

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone_number`, `role`, `status`) VALUES
('usr-admin-01', 'admin@mdmobile.vn', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Admin MD Mobile', '0987654321', 'ADMIN', 'ACTIVE'),
('usr-staff-01', 'staff@mdmobile.vn', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Nhân Viên MD Mobile', '0901234567', 'STAFF', 'ACTIVE'),
('usr-cust-01', 'khachhang@gmail.com', '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK', 'Nguyễn Văn An', '0912345678', 'CUSTOMER', 'ACTIVE');

INSERT INTO `brands` (`id`, `name`, `slug`, `logo_url`, `description`) VALUES
('brand-apple', 'Apple', 'apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 'Thương hiệu công nghệ hàng đầu với iPhone, iPad, MacBook.'),
('brand-samsung', 'Samsung', 'samsung', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 'Dẫn đầu phân khúc flagship Android với Galaxy S Series và Galaxy Z Fold.'),
('brand-xiaomi', 'Xiaomi', 'xiaomi', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', 'Dẫn đầu nhiếp ảnh di động cùng Leica và công nghệ sạc siêu nhanh HyperCharge.'),
('brand-asus', 'ASUS', 'asus', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', 'Ông vua phân khúc Gaming Phone với ROG Phone hàng đầu.'),
('brand-oppo', 'OPPO', 'oppo', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg', 'Chuyên gia chân dung với dòng Find và Reno Series.');

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `sort_order`) VALUES
('cat-smartphones', 'Điện Thoại Di Động', 'smartphones', 'Toàn bộ smartphone chính hãng Apple, Samsung, Xiaomi,...', 1),
('cat-tablets', 'Máy Tính Bảng', 'tablets', 'iPad và máy tính bảng Android chất lượng cao', 2),
('cat-accessories', 'Phụ Kiện Công Nghệ', 'accessories', 'Tai nghe, củ sạc, ốp lưng, sạc dự phòng chính hãng', 3),
('cat-smartwatches', 'Đồng Hồ Thông Minh', 'smartwatches', 'Apple Watch, Galaxy Watch thời thượng', 4);

INSERT INTO `products` (`id`, `name`, `slug`, `brand_id`, `category_id`, `price`, `original_price`, `discount_percentage`, `thumbnail`, `description`, `specifications`, `rating`, `review_count`, `in_stock`, `stock_quantity`, `is_featured`, `is_new_arrival`, `is_best_seller`, `status`) VALUES
('prod-iphone-16-pro-max', 'iPhone 16 Pro Max 256GB VN/A', 'iphone-16-pro-max-256gb', 'brand-apple', 'cat-smartphones', 34490000, 37990000, 9, '/images/products/iphone-16-pro-max-desert.svg', 'Đỉnh cao flagship Apple với chip xử lý Apple A18 Pro tiến trình 3nm, nút chụp ảnh Camera Control chuyên nghiệp, khung viền Titan Cấp Độ 5 Sa Mạc siêu nhẹ và thời lượng pin dài nhất từ trước đến nay trên iPhone.', '{"screen": "6.9 inch Super Retina XDR OLED 120Hz ProMotion", "cpu": "Apple A18 Pro 6 lõi (3nm)", "ram": "8GB", "storage": "256GB", "battery": "4685 mAh", "camera": "Chính Fusion 48MP, Siêu rộng 48MP, Tele 5x 12MP Tetraprism", "os": "iOS 18", "weight": "227g"}', 4.99, 246, 1, 65, 1, 1, 1, 'PUBLISHED'),
('prod-galaxy-s24-ultra', 'Samsung Galaxy S24 Ultra 5G 256GB', 'samsung-galaxy-s24-ultra-5g', 'brand-samsung', 'cat-smartphones', 29990000, 33990000, 12, '/images/products/samsung-s24-ultra.svg', 'Kỷ nguyên quyền năng Galaxy AI mở ra những trải nghiệm chưa từng có: Khoanh tròn để tìm kiếm, Trợ lý phiên dịch trực tiếp cuộc gọi, camera 200MP đột phá và bút S-Pen quyền lực tích hợp sẵn.', '{"screen": "6.8 inch Dynamic AMOLED 2X 120Hz phẳng Corning Gorilla Armor", "cpu": "Qualcomm Snapdragon 8 Gen 3 for Galaxy", "ram": "12GB", "storage": "256GB", "battery": "5000 mAh sạc nhanh 45W", "camera": "Chính 200MP OIS, Tele 50MP 5x quang học, Tele 10MP 3x, Góc siêu rộng 12MP", "os": "One UI 6.1 (Android 14)", "weight": "232g"}', 4.96, 188, 1, 45, 1, 1, 1, 'PUBLISHED'),
('prod-xiaomi-14-ultra', 'Xiaomi 14 Ultra Leica 512GB', 'xiaomi-14-ultra-leica-512gb', 'brand-xiaomi', 'cat-smartphones', 27490000, 31990000, 14, '/images/products/xiaomi-14-ultra.svg', 'Tuyệt tác quang học đồng chế tác cùng Leica với cảm biến Sony LYT-900 kích thước 1-inch, khẩu độ biến thiên vô cấp f/1.63 – f/4.0 cùng công nghệ sạc thần tốc 90W HyperCharge.', '{"screen": "6.73 inch LTPO AMOLED 120Hz WQHD+ 3000 nits", "cpu": "Snapdragon 8 Gen 3 (4nm)", "ram": "16GB", "storage": "512GB", "battery": "5000 mAh sạc 90W có dây, 80W không dây", "camera": "Bộ 4 camera 50MP Leica quang học Vario-Summilux", "os": "Xiaomi HyperOS", "weight": "219.8g"}', 4.95, 92, 1, 30, 1, 1, 0, 'PUBLISHED'),
('prod-galaxy-z-fold6', 'Samsung Galaxy Z Fold6 5G 256GB', 'samsung-galaxy-z-fold6-5g-256gb', 'brand-samsung', 'cat-smartphones', 38990000, 43990000, 11, '/images/products/samsung-z-fold6.svg', 'Đỉnh cao công nghệ màn hình gập mỏng nhẹ nhất lịch sử Galaxy Z Fold, bản lề Flex Hinge kép bền bỉ và tích hợp trọn vẹn sức mạnh trí tuệ nhân tạo Galaxy AI trên màn hình cực đại 7.6 inch.', '{"screen": "Chính: 7.6 inch Dynamic AMOLED 2X 120Hz; Phụ: 6.3 inch", "cpu": "Snapdragon 8 Gen 3 for Galaxy", "ram": "12GB", "storage": "256GB", "battery": "4400 mAh", "camera": "Chính 50MP OIS, Tele 10MP 3x, Góc rộng 12MP", "os": "Android 14 One UI 6.1.1", "weight": "239g"}', 4.94, 74, 1, 20, 1, 1, 1, 'PUBLISHED'),
('prod-iphone-16-plus', 'iPhone 16 Plus 128GB VN/A', 'iphone-16-plus-128gb', 'brand-apple', 'cat-smartphones', 25490000, 27990000, 9, '/images/products/iphone-16-plus-ultramarine.svg', 'Màn hình lớn 6.7 inch rực rỡ, chip Apple A18 mạnh mẽ tối ưu cho Apple Intelligence, nút Action đa năng và thời lượng xem video lên đến 27 giờ ấn tượng.', '{"screen": "6.7 inch Super Retina XDR OLED", "cpu": "Apple A18 (3nm)", "ram": "8GB", "storage": "128GB", "battery": "4674 mAh", "camera": "Chính 48MP Fusion 2X, Siêu rộng 12MP chụp macro", "os": "iOS 18", "weight": "199g"}', 4.92, 115, 1, 50, 1, 1, 0, 'PUBLISHED'),
('prod-rog-phone-8-pro', 'ASUS ROG Phone 8 Pro 512GB', 'asus-rog-phone-8-pro-512gb', 'brand-asus', 'cat-smartphones', 26990000, 29990000, 10, '/images/products/rog-phone-8-pro.svg', 'Quái vật gaming smartphone với màn hình Samsung AMOLED 165Hz siêu mượt, hệ thống phím cảm ứng siêu âm AirTrigger độc quyền và vi xử lý Snapdragon 8 Gen 3 ép xung tối đa.', '{"screen": "6.78 inch LTPO AMOLED 165Hz 2500 nits", "cpu": "Snapdragon 8 Gen 3 (4nm)", "ram": "16GB", "storage": "512GB", "battery": "5500 mAh sạc 65W", "camera": "Chính 50MP Gimbal OIS, Tele 32MP 3x, Góc rộng 13MP", "os": "ROG UI (Android 14)", "weight": "225g"}', 4.97, 83, 1, 25, 1, 1, 1, 'PUBLISHED'),
('prod-iphone-16-128gb', 'iPhone 16 128GB VN/A', 'iphone-16-128gb', 'brand-apple', 'cat-smartphones', 21990000, 23990000, 8, '/images/products/iphone-16-teal.svg', 'iPhone thế hệ mới với nút Camera Control và nút Action hoàn toàn mới, cụm camera kép xếp dọc hỗ trợ quay Không Gian cho Apple Vision Pro.', '{"screen": "6.1 inch Super Retina XDR OLED", "cpu": "Apple A18 (3nm)", "ram": "8GB", "storage": "128GB", "battery": "3561 mAh", "camera": "Chính 48MP Fusion, Siêu rộng 12MP", "os": "iOS 18", "weight": "170g"}', 4.93, 162, 1, 70, 1, 1, 1, 'PUBLISHED'),
('prod-redmi-note-13-pro-plus', 'Xiaomi Redmi Note 13 Pro+ 5G 256GB', 'xiaomi-redmi-note-13-pro-plus-5g', 'brand-xiaomi', 'cat-smartphones', 8990000, 10490000, 14, '/images/products/redmi-note-13-pro-plus.svg', 'Vua phân khúc tầm trung với camera độ phân giải khủng 200MP OIS, sạc siêu nhanh 120W HyperCharge đầy pin trong 19 phút và chuẩn kháng nước kháng bụi IP68 hàng đầu.', '{"screen": "6.67 inch CrystalRes AMOLED 120Hz cong 1.5K", "cpu": "MediaTek Dimensity 7200-Ultra", "ram": "8GB", "storage": "256GB", "battery": "5000 mAh sạc 120W", "camera": "Chính 200MP OIS, Góc rộng 8MP, Macro 2MP", "os": "HyperOS", "weight": "204.5g"}', 4.89, 310, 1, 90, 1, 0, 1, 'PUBLISHED');

INSERT INTO `product_variants` (`id`, `product_id`, `name`, `sku`, `price`, `original_price`, `stock`, `color`, `storage`, `image`) VALUES
('var-ip16pm-desert-256', 'prod-iphone-16-pro-max', 'Titan Sa Mạc 256GB', 'IP16PM-256-DESERT', 34490000, 37990000, 25, 'Titan Sa Mạc', '256GB', '/images/products/iphone-16-pro-max-desert.svg'),
('var-ip16pm-natural-256', 'prod-iphone-16-pro-max', 'Titan Tự Nhiên 256GB', 'IP16PM-256-NATURAL', 34490000, 37990000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-desert.svg'),
('var-ip16pm-black-512', 'prod-iphone-16-pro-max', 'Titan Đen 512GB', 'IP16PM-512-BLACK', 40490000, 44490000, 20, 'Titan Đen', '512GB', '/images/products/iphone-16-pro-max-desert.svg'),
('var-s24u-gray-256', 'prod-galaxy-s24-ultra', 'Xám Titan 256GB', 'S24U-256-GRAY', 29990000, 33990000, 25, 'Xám Titan', '256GB', '/images/products/samsung-s24-ultra.svg'),
('var-s24u-black-512', 'prod-galaxy-s24-ultra', 'Đen Titan 512GB', 'S24U-512-BLACK', 34490000, 37990000, 20, 'Đen Titan', '512GB', '/images/products/samsung-s24-ultra.svg'),
('var-xm14u-white-512', 'prod-xiaomi-14-ultra', 'Trắng Gốm 512GB', 'XM14U-512-WHITE', 27490000, 31990000, 30, 'Trắng Gốm', '512GB', '/images/products/xiaomi-14-ultra.svg'),
('var-zfold6-gray-256', 'prod-galaxy-z-fold6', 'Xám Metal 256GB', 'ZFOLD6-256-GRAY', 38990000, 43990000, 20, 'Xám Metal', '256GB', '/images/products/samsung-z-fold6.svg'),
('var-ip16plus-ultra-128', 'prod-iphone-16-plus', 'Xanh Lưu Ly 128GB', 'IP16P-128-ULTRA', 25490000, 27990000, 50, 'Xanh Lưu Ly', '128GB', '/images/products/iphone-16-plus-ultramarine.svg'),
('var-rog8-black-512', 'prod-rog-phone-8-pro', 'Đen Phantom 512GB', 'ROG8P-512-BLACK', 26990000, 29990000, 25, 'Đen Phantom', '512GB', '/images/products/rog-phone-8-pro.svg');

INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `is_active`) VALUES
('coup-welcome-500', 'MDWELCOME', 'Giảm trực tiếp 500.000đ cho đơn hàng đầu tiên từ 10.000.000đ', 'FIXED_AMOUNT', 500000, 10000000, 500000, 1000, 23, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1),
('coup-flagship-10', 'FLAGSHIP10', 'Giảm 10% tối đa 1.000.000đ cho dòng Flagship', 'PERCENT', 10, 20000000, 1000000, 500, 12, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1);

INSERT INTO `banners` (`id`, `title`, `subtitle`, `image_url`, `link_url`, `position`, `sort_order`, `is_active`) VALUES
('ban-hero-01', 'iPhone 16 Pro Max - Titan Sa Mạc', 'Sức mạnh chip Apple A18 Pro 3nm cùng nút Camera Control', '/images/products/iphone-16-pro-max-desert.svg', '/products/iphone-16-pro-max-256gb', 'hero_slider', 1, 1),
('ban-hero-02', 'Samsung Galaxy S24 Ultra - Quyền Năng AI', 'Trải nghiệm kỷ nguyên trí tuệ nhân tạo Galaxy AI cùng Camera 200MP', '/images/products/samsung-s24-ultra.svg', '/products/samsung-galaxy-s24-ultra-5g', 'hero_slider', 2, 1),
('ban-hero-03', 'Xiaomi 14 Ultra - Kiệt Tác Leica 1-Inch', 'Hệ thống 4 camera 50MP Leica quang học và sạc siêu tốc 90W', '/images/products/xiaomi-14-ultra.svg', '/products/xiaomi-14-ultra-leica-512gb', 'hero_slider', 3, 1);
