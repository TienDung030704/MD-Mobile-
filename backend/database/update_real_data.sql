-- ============================================================
-- CẬP NHẬT DỮ LIỆU THẬT CHO CƠ SỞ DỮ LIỆU MD MOBILE
-- ============================================================
USE `md_mobile`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Làm sạch bảng sản phẩm & biến thể & banner cũ
DELETE FROM `product_variants`;
DELETE FROM `product_images`;
DELETE FROM `products`;
DELETE FROM `banners`;

-- 2. Thêm thương hiệu ASUS & Vivo
INSERT INTO `brands` (`id`, `name`, `slug`, `logo_url`, `description`) VALUES
('brand-asus', 'ASUS', 'asus', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', 'Hãng công nghệ hàng đầu thế giới với dòng smartphone gaming ROG Phone đỉnh cao.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `brands` (`id`, `name`, `slug`, `logo_url`, `description`) VALUES
('brand-vivo', 'Vivo', 'vivo', 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png', 'Thương hiệu smartphone dẫn đầu về nhiếp ảnh chân dung quang học cùng Zeiss.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Nạp danh sách sản phẩm THỰC TẾ
INSERT INTO `products` (`id`, `name`, `slug`, `brand_id`, `category_id`, `price`, `original_price`, `discount_percentage`, `thumbnail`, `description`, `specifications`, `rating`, `review_count`, `in_stock`, `stock_quantity`, `is_featured`, `is_new_arrival`, `is_best_seller`, `status`) VALUES
(
  'prod-iphone-16-pro-max',
  'iPhone 16 Pro Max 256GB VN/A',
  'iphone-16-pro-max-256gb',
  'brand-apple',
  'cat-smartphones',
  34490000,
  37990000,
  9,
  '/images/products/iphone-16-pro-max-desert.png',
  'Đỉnh cao flagship Apple với chip xử lý Apple A18 Pro tiến trình 3nm, nút chụp ảnh Camera Control chuyên nghiệp, khung viền Titan Cấp Độ 5 Sa Mạc siêu nhẹ và thời lượng pin dài nhất từ trước đến nay trên iPhone.',
  '{"screen": "6.9 inch Super Retina XDR OLED 120Hz ProMotion", "cpu": "Apple A18 Pro 6 lõi (3nm)", "ram": "8GB", "storage": "256GB", "battery": "4685 mAh", "camera": "Chính Fusion 48MP, Siêu rộng 48MP, Tele 5x 12MP Tetraprism", "os": "iOS 18", "weight": "227g"}',
  4.99,
  246,
  1,
  65,
  1,
  1,
  1,
  'PUBLISHED'
),
(
  'prod-galaxy-s24-ultra',
  'Samsung Galaxy S24 Ultra 5G 256GB',
  'samsung-galaxy-s24-ultra-5g',
  'brand-samsung',
  'cat-smartphones',
  29990000,
  33990000,
  12,
  '/images/products/samsung-s24-ultra.png',
  'Kỷ nguyên quyền năng Galaxy AI mở ra những trải nghiệm chưa từng có: Khoanh tròn để tìm kiếm, Trợ lý phiên dịch trực tiếp cuộc gọi, camera 200MP đột phá và bút S-Pen quyền lực tích hợp sẵn.',
  '{"screen": "6.8 inch Dynamic AMOLED 2X 120Hz phẳng Corning Gorilla Armor", "cpu": "Qualcomm Snapdragon 8 Gen 3 for Galaxy", "ram": "12GB", "storage": "256GB", "battery": "5000 mAh sạc nhanh 45W", "camera": "Chính 200MP OIS, Tele 50MP 5x quang học, Tele 10MP 3x, Góc siêu rộng 12MP", "os": "One UI 6.1 (Android 14)", "weight": "232g"}',
  4.96,
  188,
  1,
  45,
  1,
  1,
  1,
  'PUBLISHED'
),
(
  'prod-xiaomi-14-ultra',
  'Xiaomi 14 Ultra Leica 512GB',
  'xiaomi-14-ultra-leica-512gb',
  'brand-xiaomi',
  'cat-smartphones',
  27490000,
  31990000,
  14,
  '/images/products/xiaomi-14-ultra.jpg',
  'Tuyệt tác quang học đồng chế tác cùng Leica với cảm biến Sony LYT-900 kích thước 1-inch, khẩu độ biến thiên vô cấp f/1.63 – f/4.0 cùng công nghệ sạc thần tốc 90W HyperCharge.',
  '{"screen": "6.73 inch LTPO AMOLED 120Hz WQHD+ 3000 nits", "cpu": "Snapdragon 8 Gen 3 (4nm)", "ram": "16GB", "storage": "512GB", "battery": "5000 mAh sạc 90W có dây, 80W không dây", "camera": "Bộ 4 camera 50MP Leica quang học Vario-Summilux", "os": "Xiaomi HyperOS", "weight": "219.8g"}',
  4.95,
  92,
  1,
  30,
  1,
  1,
  0,
  'PUBLISHED'
),
(
  'prod-galaxy-z-fold6',
  'Samsung Galaxy Z Fold6 5G 256GB',
  'samsung-galaxy-z-fold6-5g-256gb',
  'brand-samsung',
  'cat-smartphones',
  38990000,
  43990000,
  11,
  '/images/products/samsung-z-fold6.jpg',
  'Đỉnh cao công nghệ màn hình gập mỏng nhẹ nhất lịch sử Galaxy Z Fold, bản lề Flex Hinge kép bền bỉ và tích hợp trọn vẹn sức mạnh trí tuệ nhân tạo Galaxy AI trên màn hình cực đại 7.6 inch.',
  '{"screen": "Chính: 7.6 inch Dynamic AMOLED 2X 120Hz; Phụ: 6.3 inch", "cpu": "Snapdragon 8 Gen 3 for Galaxy", "ram": "12GB", "storage": "256GB", "battery": "4400 mAh", "camera": "Chính 50MP OIS, Tele 10MP 3x, Góc rộng 12MP", "os": "Android 14 One UI 6.1.1", "weight": "239g"}',
  4.94,
  74,
  1,
  20,
  1,
  1,
  1,
  'PUBLISHED'
),
(
  'prod-iphone-16-plus',
  'iPhone 16 Plus 128GB VN/A',
  'iphone-16-plus-128gb',
  'brand-apple',
  'cat-smartphones',
  25490000,
  27990000,
  9,
  '/images/products/iphone-16-plus-ultramarine.png',
  'Màn hình lớn 6.7 inch rực rỡ, chip Apple A18 mạnh mẽ tối ưu cho Apple Intelligence, nút Action đa năng và thời lượng xem video lên đến 27 giờ ấn tượng.',
  '{"screen": "6.7 inch Super Retina XDR OLED", "cpu": "Apple A18 (3nm)", "ram": "8GB", "storage": "128GB", "battery": "4674 mAh", "camera": "Chính 48MP Fusion 2X, Siêu rộng 12MP chụp macro", "os": "iOS 18", "weight": "199g"}',
  4.92,
  115,
  1,
  50,
  1,
  1,
  0,
  'PUBLISHED'
),
(
  'prod-rog-phone-8-pro',
  'ASUS ROG Phone 8 Pro 512GB',
  'asus-rog-phone-8-pro-512gb',
  'brand-asus',
  'cat-smartphones',
  26990000,
  29990000,
  10,
  '/images/products/rog-phone-8-pro.png',
  'Quái vật gaming smartphone với màn hình Samsung AMOLED 165Hz siêu mượt, hệ thống phím cảm ứng siêu âm AirTrigger độc quyền và vi xử lý Snapdragon 8 Gen 3 ép xung tối đa.',
  '{"screen": "6.78 inch LTPO AMOLED 165Hz 2500 nits", "cpu": "Snapdragon 8 Gen 3 (4nm)", "ram": "16GB", "storage": "512GB", "battery": "5500 mAh sạc 65W", "camera": "Chính 50MP Gimbal OIS, Tele 32MP 3x, Góc rộng 13MP", "os": "ROG UI (Android 14)", "weight": "225g"}',
  4.97,
  83,
  1,
  25,
  1,
  1,
  1,
  'PUBLISHED'
),
(
  'prod-iphone-16-128gb',
  'iPhone 16 128GB VN/A',
  'iphone-16-128gb',
  'brand-apple',
  'cat-smartphones',
  21990000,
  23990000,
  8,
  '/images/products/iphone-16-teal.png',
  'iPhone thế hệ mới với nút Camera Control và nút Action hoàn toàn mới, cụm camera kép xếp dọc hỗ trợ quay Không Gian cho Apple Vision Pro.',
  '{"screen": "6.1 inch Super Retina XDR OLED", "cpu": "Apple A18 (3nm)", "ram": "8GB", "storage": "128GB", "battery": "3561 mAh", "camera": "Chính 48MP Fusion, Siêu rộng 12MP", "os": "iOS 18", "weight": "170g"}',
  4.93,
  162,
  1,
  70,
  1,
  1,
  1,
  'PUBLISHED'
),
(
  'prod-redmi-note-13-pro-plus',
  'Xiaomi Redmi Note 13 Pro+ 5G 256GB',
  'xiaomi-redmi-note-13-pro-plus-5g',
  'brand-xiaomi',
  'cat-smartphones',
  8990000,
  10490000,
  14,
  '/images/products/redmi-note-13-pro-plus.jpg',
  'Vua phân khúc tầm trung với camera độ phân giải khủng 200MP OIS, sạc siêu nhanh 120W HyperCharge đầy pin trong 19 phút và chuẩn kháng nước kháng bụi IP68 hàng đầu.',
  '{"screen": "6.67 inch CrystalRes AMOLED 120Hz cong 1.5K", "cpu": "MediaTek Dimensity 7200-Ultra", "ram": "8GB", "storage": "256GB", "battery": "5000 mAh sạc 120W", "camera": "Chính 200MP OIS, Góc rộng 8MP, Macro 2MP", "os": "HyperOS", "weight": "204.5g"}',
  4.89,
  310,
  1,
  90,
  1,
  0,
  1,
  'PUBLISHED'
);

-- 4. Thêm biến thể màu sắc và dung lượng thực tế
INSERT INTO `product_variants` (`id`, `product_id`, `name`, `sku`, `price`, `original_price`, `stock`, `color`, `storage`, `image`) VALUES
('var-ip16pm-desert-256', 'prod-iphone-16-pro-max', 'Titan Sa Mạc 256GB', 'IP16PM-256-DESERT', 34490000, 37990000, 25, 'Titan Sa Mạc', '256GB', '/images/products/iphone-16-pro-max-desert.png'),
('var-ip16pm-natural-256', 'prod-iphone-16-pro-max', 'Titan Tự Nhiên 256GB', 'IP16PM-256-NATURAL', 34490000, 37990000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-natural.png'),
('var-ip16pm-black-512', 'prod-iphone-16-pro-max', 'Titan Đen 512GB', 'IP16PM-512-BLACK', 40490000, 44490000, 20, 'Titan Đen', '512GB', '/images/products/iphone-16-pro-max-black.png'),
('var-s24u-gray-256', 'prod-galaxy-s24-ultra', 'Xám Titan 256GB', 'S24U-256-GRAY', 29990000, 33990000, 25, 'Xám Titan', '256GB', '/images/products/samsung-s24-ultra.png'),
('var-s24u-black-512', 'prod-galaxy-s24-ultra', 'Đen Titan 512GB', 'S24U-512-BLACK', 34490000, 37990000, 20, 'Đen Titan', '512GB', '/images/products/samsung-s24-ultra.png'),
('var-xm14u-white-512', 'prod-xiaomi-14-ultra', 'Trắng Gốm 512GB', 'XM14U-512-WHITE', 27490000, 31990000, 30, 'Trắng Gốm', '512GB', '/images/products/xiaomi-14-ultra.jpg'),
('var-zfold6-gray-256', 'prod-galaxy-z-fold6', 'Xám Metal 256GB', 'ZFOLD6-256-GRAY', 38990000, 43990000, 20, 'Xám Metal', '256GB', '/images/products/samsung-z-fold6.jpg'),
('var-ip16plus-ultra-128', 'prod-iphone-16-plus', 'Xanh Lưu Ly 128GB', 'IP16P-128-ULTRA', 25490000, 27990000, 50, 'Xanh Lưu Ly', '128GB', '/images/products/iphone-16-plus-ultramarine.png'),
('var-rog8-black-512', 'prod-rog-phone-8-pro', 'Đen Phantom 512GB', 'ROG8P-512-BLACK', 26990000, 29990000, 25, 'Đen Phantom', '512GB', '/images/products/rog-phone-8-pro.png');

-- 5. Cập nhật banner thực tế
INSERT INTO `banners` (`id`, `title`, `subtitle`, `image_url`, `link_url`, `position`, `sort_order`, `is_active`) VALUES
('ban-hero-01', 'iPhone 16 Pro Max - Titan Sa Mạc', 'Sức mạnh chip Apple A18 Pro 3nm cùng nút Camera Control', '/images/products/iphone-16-pro-max-desert.png', '/products/iphone-16-pro-max-256gb', 'hero_slider', 1, 1),
('ban-hero-02', 'Samsung Galaxy S24 Ultra - Quyền Năng AI', 'Trải nghiệm kỷ nguyên trí tuệ nhân tạo Galaxy AI cùng Camera 200MP', '/images/products/samsung-s24-ultra.png', '/products/samsung-galaxy-s24-ultra-5g', 'hero_slider', 2, 1),
('ban-hero-03', 'Xiaomi 14 Ultra - Kiệt Tác Leica 1-Inch', 'Hệ thống 4 camera 50MP Leica quang học và sạc siêu tốc 90W', '/images/products/xiaomi-14-ultra.jpg', '/products/xiaomi-14-ultra-leica-512gb', 'hero_slider', 3, 1);

SET FOREIGN_KEY_CHECKS = 1;
