const mysql = require('../node_modules/mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0869271243Aa',
  database: process.env.DB_NAME || 'md_mobile',
  multipleStatements: true,
};

// Common bcrypt hash for password "123456"
const DEFAULT_PASSWORD_HASH = '$2a$12$N3q751i9csqJ99rC4K4j..fF2uF.z7bQ8hP8e6J41uY3WfN9zU7uK';

async function main() {
  console.log('Connecting to MySQL database:', DB_CONFIG.database);
  const conn = await mysql.createConnection(DB_CONFIG);
  console.log('Connected successfully!');

  // ==========================================
  // 1. DATA DEFINITIONS
  // ==========================================

  const categories = [
    {
      id: 'cat-smartphones',
      name: 'Điện Thoại Di Động',
      slug: 'smartphones',
      description: 'Toàn bộ smartphone chính hãng Apple, Samsung, Xiaomi, ASUS, OPPO, Vivo, Sony...',
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
      parent_id: null,
      sort_order: 1,
      is_active: 1
    },
    {
      id: 'cat-tablets',
      name: 'Máy Tính Bảng',
      slug: 'tablets',
      description: 'iPad và máy tính bảng Android màn hình lớn, phục vụ công việc và học tập giải trí',
      image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
      parent_id: null,
      sort_order: 2,
      is_active: 1
    },
    {
      id: 'cat-smartwatches',
      name: 'Đồng Hồ Thông Minh',
      slug: 'smartwatches',
      description: 'Apple Watch, Galaxy Watch, Garmin thời thượng theo dõi sức khỏe và thể thao đỉnh cao',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      parent_id: null,
      sort_order: 3,
      is_active: 1
    },
    {
      id: 'cat-audio',
      name: 'Tai Nghe & Âm Thanh',
      slug: 'audio',
      description: 'Tai nghe chống ồn không dây TWS, tai nghe chụp tai và loa bluetooth cao cấp',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      parent_id: null,
      sort_order: 4,
      is_active: 1
    },
    {
      id: 'cat-accessories',
      name: 'Phụ Kiện Công Nghệ',
      slug: 'accessories',
      description: 'Củ sạc nhanh GaN, sạc dự phòng, cáp sạc, ốp lưng chống sốc cao cấp chính hãng',
      image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80',
      parent_id: null,
      sort_order: 5,
      is_active: 1
    },
    {
      id: 'cat-laptops',
      name: 'Laptop & MacBook',
      slug: 'laptops',
      description: 'MacBook Air, MacBook Pro chip Apple Silicon và laptop gaming cao cấp',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
      parent_id: null,
      sort_order: 6,
      is_active: 1
    }
  ];

  const brands = [
    {
      id: 'brand-apple',
      name: 'Apple',
      slug: 'apple',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      description: 'Thương hiệu công nghệ hàng đầu thế giới với iPhone, iPad, Mac, Apple Watch.',
      is_active: 1
    },
    {
      id: 'brand-samsung',
      name: 'Samsung',
      slug: 'samsung',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
      description: 'Tập đoàn công nghệ dẫn đầu thế giới với dòng Galaxy S, Galaxy Z Fold/Flip và Galaxy AI.',
      is_active: 1
    },
    {
      id: 'brand-xiaomi',
      name: 'Xiaomi',
      slug: 'xiaomi',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
      description: 'Tiên phong camera quang học đồng chế tác cùng Leica và sạc siêu tốc HyperCharge.',
      is_active: 1
    },
    {
      id: 'brand-asus',
      name: 'ASUS',
      slug: 'asus',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg',
      description: 'Hãng công nghệ hàng đầu với dòng gaming smartphone ROG Phone huyền thoại.',
      is_active: 1
    },
    {
      id: 'brand-oppo',
      name: 'OPPO',
      slug: 'oppo',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg',
      description: 'Bậc thầy nhiếp ảnh di động Hasselblad, thiết kế mỏng nhẹ thời trang.',
      is_active: 1
    },
    {
      id: 'brand-vivo',
      name: 'Vivo',
      slug: 'vivo',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png',
      description: 'Dẫn đầu công nghệ chụp ảnh chân dung cùng ống kính Zeiss huyền thoại.',
      is_active: 1
    },
    {
      id: 'brand-sony',
      name: 'Sony',
      slug: 'sony',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
      description: 'Đẳng cấp âm thanh Hi-Res, cảm biến máy ảnh Alpha và màn hình Bravia đỉnh cao.',
      is_active: 1
    },
    {
      id: 'brand-google',
      name: 'Google',
      slug: 'google',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      description: 'Smartphone thuần Android với trí tuệ nhân tạo Gemini AI và camera nhiếp ảnh thuật toán.',
      is_active: 1
    },
    {
      id: 'brand-anker',
      name: 'Anker',
      slug: 'anker',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Anker_logo.svg',
      description: 'Thương hiệu phụ kiện củ sạc, cáp sạc GaN và pin dự phòng số 1 thế giới.',
      is_active: 1
    },
    {
      id: 'brand-marshall',
      name: 'Marshall',
      slug: 'marshall',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Marshall_Amplification_logo.svg/1200px-Marshall_Amplification_logo.svg.png',
      description: 'Biểu tượng âm thanh cổ điển từ Anh Quốc với chất âm rock đặc trưng đầy uy lực.',
      is_active: 1
    }
  ];

  const users = [
    {
      id: 'usr-admin-01',
      email: 'admin@mdmobile.vn',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Admin MD Mobile',
      phone_number: '0987654321',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    {
      id: 'usr-staff-01',
      email: 'staff@mdmobile.vn',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Nguyễn Thu Trang (Quản Lý Kho)',
      phone_number: '0901234567',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'STAFF',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-01',
      email: 'khachhang@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Nguyễn Văn An',
      phone_number: '0912345678',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-02',
      email: 'tran.minh.tri@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Trần Minh Trí',
      phone_number: '0938112233',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-03',
      email: 'le.hoang.nam@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Lê Hoàng Nam',
      phone_number: '0988776655',
      avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-04',
      email: 'pham.thu.huong@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Phạm Thu Hương',
      phone_number: '0977223344',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-05',
      email: 'dang.quoc.huy@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Đặng Quốc Huy',
      phone_number: '0966554433',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-06',
      email: 'vo.kim.ngan@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Võ Kim Ngân',
      phone_number: '0919888999',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-07',
      email: 'hoang.duc.thanh@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Hoàng Đức Thành',
      phone_number: '0903456789',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-08',
      email: 'bui.mai.anh@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Bùi Mai Anh',
      phone_number: '0983123456',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-09',
      email: 'do.quang.vinh@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Đỗ Quang Vinh',
      phone_number: '0944556677',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    },
    {
      id: 'usr-cust-10',
      email: 'dinh.phuong.thao@gmail.com',
      password: DEFAULT_PASSWORD_HASH,
      name: 'Đinh Phương Thảo',
      phone_number: '0979667788',
      avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    }
  ];

  const user_addresses = [
    {
      id: 'addr-01',
      user_id: 'usr-cust-01',
      full_name: 'Nguyễn Văn An',
      phone_number: '0912345678',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      ward: 'Dịch Vọng Hậu',
      street_address: 'Số 18 Phố Duy Tân, Tòa nhà FPT',
      is_default: 1,
      notes: 'Giao giờ hành chính từ thứ 2 đến thứ 6'
    },
    {
      id: 'addr-02',
      user_id: 'usr-cust-01',
      full_name: 'Nguyễn Văn An (Nhà riêng)',
      phone_number: '0912345678',
      province: 'Hà Nội',
      district: 'Nam Từ Liêm',
      ward: 'Mỹ Đình 1',
      street_address: 'Căn hộ 1205, Tòa CT2 KĐT Mỹ Đình',
      is_default: 0,
      notes: 'Gọi trước khi đến 15 phút'
    },
    {
      id: 'addr-03',
      user_id: 'usr-cust-02',
      full_name: 'Trần Minh Trí',
      phone_number: '0938112233',
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      street_address: '68 Nguyễn Huệ, Tòa nhà Bitexco',
      is_default: 1,
      notes: 'Giao tại quầy lễ tân tầng 1'
    },
    {
      id: 'addr-04',
      user_id: 'usr-cust-03',
      full_name: 'Lê Hoàng Nam',
      phone_number: '0988776655',
      province: 'Đà Nẵng',
      district: 'Hải Châu',
      ward: 'Thạch Thang',
      street_address: '42 Bạch Đằng, P. Thạch Thang',
      is_default: 1,
      notes: 'Giao ban ngày'
    },
    {
      id: 'addr-05',
      user_id: 'usr-cust-04',
      full_name: 'Phạm Thu Hương',
      phone_number: '0977223344',
      province: 'Hồ Chí Minh',
      district: 'Quận 7',
      ward: 'Tân Phú',
      street_address: 'Căn A08-12 Chung cư Scenic Valley, Nguyễn Văn Linh',
      is_default: 1,
      notes: 'Bấm chuông gọi phòng hoặc gọi điện thoại'
    },
    {
      id: 'addr-06',
      user_id: 'usr-cust-05',
      full_name: 'Đặng Quốc Huy',
      phone_number: '0966554433',
      province: 'Hải Phòng',
      district: 'Lê Chân',
      ward: 'An Dương',
      street_address: 'Số 15/45 Tôn Đức Thắng',
      is_default: 1,
      notes: 'Giao tận tay người nhận'
    },
    {
      id: 'addr-07',
      user_id: 'usr-cust-06',
      full_name: 'Võ Kim Ngân',
      phone_number: '0919888999',
      province: 'Cần Thơ',
      district: 'Ninh Kiều',
      ward: 'Xuân Khánh',
      street_address: 'Số 120 Đường 30 Tháng 4',
      is_default: 1,
      notes: 'Gọi trước khi giao'
    },
    {
      id: 'addr-08',
      user_id: 'usr-cust-07',
      full_name: 'Hoàng Đức Thành',
      phone_number: '0903456789',
      province: 'Bình Dương',
      district: 'Thủ Dầu Một',
      ward: 'Phú Hòa',
      street_address: 'Đường D1, Khu dân cư Phú Hòa 1',
      is_default: 1,
      notes: 'Giao buổi chiều'
    },
    {
      id: 'addr-09',
      user_id: 'usr-cust-08',
      full_name: 'Bùi Mai Anh',
      phone_number: '0983123456',
      province: 'Hà Nội',
      district: 'Đống Đa',
      ward: 'Láng Hạ',
      street_address: 'Số 22 Ngõ 105 Láng Hạ',
      is_default: 1,
      notes: 'Được kiểm tra hàng trước khi nhận'
    },
    {
      id: 'addr-10',
      user_id: 'usr-cust-09',
      full_name: 'Đỗ Quang Vinh',
      phone_number: '0944556677',
      province: 'Hồ Chí Minh',
      district: 'Bình Thạnh',
      ward: 'Phường 25',
      street_address: 'Tòa Landmark 81, 720A Điện Biên Phủ',
      is_default: 1,
      notes: 'Giao lễ tân tầng sảnh B1'
    }
  ];

  // ==========================================
  // PRODUCTS DEFINITION (42 Products)
  // ==========================================
  const products = [
    // 1. iPhone 16 Pro Max
    {
      id: 'prod-iphone-16-pro-max',
      name: 'iPhone 16 Pro Max 256GB VN/A',
      slug: 'iphone-16-pro-max-256gb',
      brand_id: 'brand-apple',
      category_id: 'cat-smartphones',
      price: 34490000,
      original_price: 37990000,
      discount_percentage: 9,
      thumbnail: '/images/products/iphone-16-pro-max-desert.svg',
      description: 'Đỉnh cao flagship Apple với chip xử lý Apple A18 Pro tiến trình 3nm, nút chụp ảnh Camera Control chuyên nghiệp, khung viền Titan Cấp Độ 5 Sa Mạc siêu nhẹ và thời lượng pin dài nhất từ trước đến nay trên iPhone.',
      specifications: JSON.stringify({
        screen: '6.9 inch Super Retina XDR OLED 120Hz ProMotion',
        cpu: 'Apple A18 Pro 6 lõi (3nm)',
        ram: '8GB',
        storage: '256GB',
        battery: '4685 mAh sạc không dây MagSafe 25W',
        camera: 'Chính Fusion 48MP, Siêu rộng 48MP, Tele 5x 12MP Tetraprism',
        os: 'iOS 18',
        weight: '227g'
      }),
      rating: 4.98,
      review_count: 246,
      in_stock: 1,
      stock_quantity: 65,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 2. Galaxy S24 Ultra
    {
      id: 'prod-galaxy-s24-ultra',
      name: 'Samsung Galaxy S24 Ultra 5G 256GB',
      slug: 'samsung-galaxy-s24-ultra-5g',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartphones',
      price: 29990000,
      original_price: 33990000,
      discount_percentage: 12,
      thumbnail: '/images/products/samsung-s24-ultra.svg',
      description: 'Kỷ nguyên quyền năng Galaxy AI mở ra những trải nghiệm chưa từng có: Khoanh tròn để tìm kiếm, Trợ lý phiên dịch trực tiếp cuộc gọi, camera 200MP đột phá và bút S-Pen quyền lực tích hợp sẵn.',
      specifications: JSON.stringify({
        screen: '6.8 inch Dynamic AMOLED 2X 120Hz phẳng Corning Gorilla Armor',
        cpu: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
        ram: '12GB',
        storage: '256GB',
        battery: '5000 mAh sạc nhanh 45W',
        camera: 'Chính 200MP OIS, Tele 50MP 5x quang học, Tele 10MP 3x, Góc siêu rộng 12MP',
        os: 'One UI 6.1 (Android 14)',
        weight: '232g'
      }),
      rating: 4.95,
      review_count: 188,
      in_stock: 1,
      stock_quantity: 45,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 3. Xiaomi 14 Ultra
    {
      id: 'prod-xiaomi-14-ultra',
      name: 'Xiaomi 14 Ultra Leica 512GB',
      slug: 'xiaomi-14-ultra-leica-512gb',
      brand_id: 'brand-xiaomi',
      category_id: 'cat-smartphones',
      price: 27490000,
      original_price: 31990000,
      discount_percentage: 14,
      thumbnail: '/images/products/xiaomi-14-ultra.svg',
      description: 'Tuyệt tác quang học đồng chế tác cùng Leica với cảm biến Sony LYT-900 kích thước 1-inch, khẩu độ biến thiên vô cấp f/1.63 – f/4.0 cùng công nghệ sạc thần tốc 90W HyperCharge.',
      specifications: JSON.stringify({
        screen: '6.73 inch LTPO AMOLED 120Hz WQHD+ 3000 nits',
        cpu: 'Snapdragon 8 Gen 3 (4nm)',
        ram: '16GB',
        storage: '512GB',
        battery: '5000 mAh sạc 90W có dây, 80W không dây',
        camera: 'Bộ 4 camera 50MP Leica quang học Vario-Summilux',
        os: 'Xiaomi HyperOS',
        weight: '219.8g'
      }),
      rating: 4.94,
      review_count: 92,
      in_stock: 1,
      stock_quantity: 30,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 4. Galaxy Z Fold6
    {
      id: 'prod-galaxy-z-fold6',
      name: 'Samsung Galaxy Z Fold6 5G 256GB',
      slug: 'samsung-galaxy-z-fold6-5g-256gb',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartphones',
      price: 38990000,
      original_price: 43990000,
      discount_percentage: 11,
      thumbnail: '/images/products/samsung-z-fold6.svg',
      description: 'Đỉnh cao công nghệ màn hình gập mỏng nhẹ nhất lịch sử Galaxy Z Fold, bản lề Flex Hinge kép bền bỉ và tích hợp trọn vẹn sức mạnh trí tuệ nhân tạo Galaxy AI trên màn hình cực đại 7.6 inch.',
      specifications: JSON.stringify({
        screen: 'Chính: 7.6 inch Dynamic AMOLED 2X 120Hz; Phụ: 6.3 inch',
        cpu: 'Snapdragon 8 Gen 3 for Galaxy',
        ram: '12GB',
        storage: '256GB',
        battery: '4400 mAh sạc nhanh 25W',
        camera: 'Chính 50MP OIS, Tele 10MP 3x, Góc rộng 12MP',
        os: 'Android 14 One UI 6.1.1',
        weight: '239g'
      }),
      rating: 4.93,
      review_count: 74,
      in_stock: 1,
      stock_quantity: 20,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 5. iPhone 16 Plus
    {
      id: 'prod-iphone-16-plus',
      name: 'iPhone 16 Plus 128GB VN/A',
      slug: 'iphone-16-plus-128gb',
      brand_id: 'brand-apple',
      category_id: 'cat-smartphones',
      price: 25490000,
      original_price: 27990000,
      discount_percentage: 9,
      thumbnail: '/images/products/iphone-16-plus-ultramarine.svg',
      description: 'Màn hình lớn 6.7 inch rực rỡ, chip Apple A18 mạnh mẽ tối ưu cho Apple Intelligence, nút Action đa năng và thời lượng xem video lên đến 27 giờ ấn tượng.',
      specifications: JSON.stringify({
        screen: '6.7 inch Super Retina XDR OLED',
        cpu: 'Apple A18 (3nm)',
        ram: '8GB',
        storage: '128GB',
        battery: '4674 mAh',
        camera: 'Chính 48MP Fusion 2X, Siêu rộng 12MP chụp macro',
        os: 'iOS 18',
        weight: '199g'
      }),
      rating: 4.91,
      review_count: 115,
      in_stock: 1,
      stock_quantity: 50,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 6. ASUS ROG Phone 8 Pro
    {
      id: 'prod-rog-phone-8-pro',
      name: 'ASUS ROG Phone 8 Pro 512GB',
      slug: 'asus-rog-phone-8-pro-512gb',
      brand_id: 'brand-asus',
      category_id: 'cat-smartphones',
      price: 26990000,
      original_price: 29990000,
      discount_percentage: 10,
      thumbnail: '/images/products/rog-phone-8-pro.svg',
      description: 'Quái vật gaming smartphone với màn hình Samsung AMOLED 165Hz siêu mượt, hệ thống phím cảm ứng siêu âm AirTrigger độc quyền và vi xử lý Snapdragon 8 Gen 3 ép xung tối đa.',
      specifications: JSON.stringify({
        screen: '6.78 inch LTPO AMOLED 165Hz 2500 nits',
        cpu: 'Snapdragon 8 Gen 3 (4nm)',
        ram: '16GB',
        storage: '512GB',
        battery: '5500 mAh sạc 65W',
        camera: 'Chính 50MP Gimbal OIS, Tele 32MP 3x, Góc rộng 13MP',
        os: 'ROG UI (Android 14)',
        weight: '225g'
      }),
      rating: 4.97,
      review_count: 83,
      in_stock: 1,
      stock_quantity: 25,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 7. iPhone 16
    {
      id: 'prod-iphone-16-128gb',
      name: 'iPhone 16 128GB VN/A',
      slug: 'iphone-16-128gb',
      brand_id: 'brand-apple',
      category_id: 'cat-smartphones',
      price: 21990000,
      original_price: 23990000,
      discount_percentage: 8,
      thumbnail: '/images/products/iphone-16-teal.svg',
      description: 'iPhone thế hệ mới với nút Camera Control và nút Action hoàn toàn mới, cụm camera kép xếp dọc hỗ trợ quay Không Gian cho Apple Vision Pro.',
      specifications: JSON.stringify({
        screen: '6.1 inch Super Retina XDR OLED',
        cpu: 'Apple A18 (3nm)',
        ram: '8GB',
        storage: '128GB',
        battery: '3561 mAh',
        camera: 'Chính 48MP Fusion, Siêu rộng 12MP',
        os: 'iOS 18',
        weight: '170g'
      }),
      rating: 4.92,
      review_count: 162,
      in_stock: 1,
      stock_quantity: 70,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 8. Redmi Note 13 Pro+
    {
      id: 'prod-redmi-note-13-pro-plus',
      name: 'Xiaomi Redmi Note 13 Pro+ 5G 256GB',
      slug: 'xiaomi-redmi-note-13-pro-plus-5g',
      brand_id: 'brand-xiaomi',
      category_id: 'cat-smartphones',
      price: 8990000,
      original_price: 10490000,
      discount_percentage: 14,
      thumbnail: '/images/products/redmi-note-13-pro-plus.svg',
      description: 'Vua phân khúc tầm trung với camera độ phân giải khủng 200MP OIS, sạc siêu nhanh 120W HyperCharge đầy pin trong 19 phút và chuẩn kháng nước kháng bụi IP68 hàng đầu.',
      specifications: JSON.stringify({
        screen: '6.67 inch CrystalRes AMOLED 120Hz cong 1.5K',
        cpu: 'MediaTek Dimensity 7200-Ultra',
        ram: '8GB',
        storage: '256GB',
        battery: '5000 mAh sạc 120W',
        camera: 'Chính 200MP OIS, Góc rộng 8MP, Macro 2MP',
        os: 'HyperOS',
        weight: '204.5g'
      }),
      rating: 4.89,
      review_count: 310,
      in_stock: 1,
      stock_quantity: 90,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 9. iPhone 16 Pro
    {
      id: 'prod-iphone-16-pro',
      name: 'iPhone 16 Pro 128GB VN/A',
      slug: 'iphone-16-pro-128gb',
      brand_id: 'brand-apple',
      category_id: 'cat-smartphones',
      price: 27990000,
      original_price: 29990000,
      discount_percentage: 7,
      thumbnail: '/images/products/iphone-16-pro-max-desert.svg',
      description: 'Phiên bản nhỏ gọn chuyên nghiệp với màn hình 6.3 inch Super Retina XDR 120Hz, chip A18 Pro và camera Telephoto 5x Tetraprism cao cấp.',
      specifications: JSON.stringify({
        screen: '6.3 inch Super Retina XDR OLED 120Hz ProMotion',
        cpu: 'Apple A18 Pro 6 lõi (3nm)',
        ram: '8GB',
        storage: '128GB',
        battery: '3582 mAh',
        camera: 'Chính 48MP, Siêu rộng 48MP, Tele 5x 12MP',
        os: 'iOS 18',
        weight: '199g'
      }),
      rating: 4.96,
      review_count: 140,
      in_stock: 1,
      stock_quantity: 40,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 10. iPhone 15 Pro Max
    {
      id: 'prod-iphone-15-pro-max',
      name: 'iPhone 15 Pro Max 256GB VN/A',
      slug: 'iphone-15-pro-max-256gb',
      brand_id: 'brand-apple',
      category_id: 'cat-smartphones',
      price: 28490000,
      original_price: 32990000,
      discount_percentage: 14,
      thumbnail: '/images/products/iphone-16-pro-max-desert.svg',
      description: 'Flagship được yêu thích nhất mọi thời đại với khung viền Titan Tự Nhiên, chip A17 Pro chơi game AAA đỉnh cao và cổng sạc Type-C tốc độ cao USB 3.',
      specifications: JSON.stringify({
        screen: '6.7 inch Super Retina XDR OLED 120Hz',
        cpu: 'Apple A17 Pro (3nm)',
        ram: '8GB',
        storage: '256GB',
        battery: '4422 mAh',
        camera: 'Chính 48MP, Siêu rộng 12MP, Tele 5x 12MP',
        os: 'iOS 17',
        weight: '221g'
      }),
      rating: 4.94,
      review_count: 512,
      in_stock: 1,
      stock_quantity: 35,
      is_featured: 1,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 11. iPhone 15 128GB
    {
      id: 'prod-iphone-15-128gb',
      name: 'iPhone 15 128GB VN/A',
      slug: 'iphone-15-128gb',
      brand_id: 'brand-apple',
      category_id: 'cat-smartphones',
      price: 18490000,
      original_price: 21990000,
      discount_percentage: 16,
      thumbnail: '/images/products/iphone-16-teal.svg',
      description: 'Thiết kế mặt lưng kính nhám pha màu độc đáo, Dynamic Island thông minh, camera 48MP sắc nét cùng cổng USB-C tiện lợi.',
      specifications: JSON.stringify({
        screen: '6.1 inch Super Retina XDR OLED',
        cpu: 'Apple A16 Bionic (4nm)',
        ram: '6GB',
        storage: '128GB',
        battery: '3349 mAh',
        camera: 'Chính 48MP, Siêu rộng 12MP',
        os: 'iOS 17',
        weight: '171g'
      }),
      rating: 4.90,
      review_count: 320,
      in_stock: 1,
      stock_quantity: 60,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },
    // 12. iPhone 13 128GB
    {
      id: 'prod-iphone-13-128gb',
      name: 'iPhone 13 128GB Chính Hãng VN/A',
      slug: 'iphone-13-128gb',
      brand_id: 'brand-apple',
      category_id: 'cat-smartphones',
      price: 13490000,
      original_price: 15990000,
      discount_percentage: 16,
      thumbnail: '/images/products/iphone-16-teal.svg',
      description: 'Chiếc iPhone quốc dân bán chạy nhất phân khúc dưới 15 triệu: pin trâu, camera kép chéo chống rung OIS cảm biến dịch chuyển, chip A15 mượt mà nhiều năm.',
      specifications: JSON.stringify({
        screen: '6.1 inch Super Retina XDR OLED',
        cpu: 'Apple A15 Bionic (5nm)',
        ram: '4GB',
        storage: '128GB',
        battery: '3227 mAh',
        camera: 'Kép 12MP + 12MP chống rung Sensor-shift',
        os: 'iOS 15 (lên iOS 18)',
        weight: '174g'
      }),
      rating: 4.88,
      review_count: 670,
      in_stock: 1,
      stock_quantity: 80,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 13. Galaxy S24+ 5G
    {
      id: 'prod-galaxy-s24-plus',
      name: 'Samsung Galaxy S24+ 5G 256GB',
      slug: 'samsung-galaxy-s24-plus-5g',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartphones',
      price: 22490000,
      original_price: 26990000,
      discount_percentage: 17,
      thumbnail: '/images/products/samsung-s24-ultra.svg',
      description: 'Sự cân bằng hoàn hảo với màn hình lớn 6.7 inch QHD+ Dynamic AMOLED 2X, RAM 12GB đa nhiệm mượt mà cùng toàn bộ các tính năng Galaxy AI tân tiến.',
      specifications: JSON.stringify({
        screen: '6.7 inch QHD+ Dynamic AMOLED 2X 120Hz',
        cpu: 'Exynos 2400 10 nhân (4nm)',
        ram: '12GB',
        storage: '256GB',
        battery: '4900 mAh sạc nhanh 45W',
        camera: 'Chính 50MP OIS, Tele 10MP 3x, Góc siêu rộng 12MP',
        os: 'One UI 6.1 (Android 14)',
        weight: '196g'
      }),
      rating: 4.91,
      review_count: 86,
      in_stock: 1,
      stock_quantity: 35,
      is_featured: 0,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 14. Galaxy S24 5G
    {
      id: 'prod-galaxy-s24',
      name: 'Samsung Galaxy S24 5G 256GB',
      slug: 'samsung-galaxy-s24-5g',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartphones',
      price: 17990000,
      original_price: 22990000,
      discount_percentage: 22,
      thumbnail: '/images/products/samsung-s24-ultra.svg',
      description: 'Smartphone cao cấp kích thước nhỏ gọn vừa vặn lòng bàn tay, viền nhôm Armor Aluminum siêu cứng cáp và tính năng Trợ lý chat AI thông minh.',
      specifications: JSON.stringify({
        screen: '6.2 inch FHD+ Dynamic AMOLED 2X 120Hz',
        cpu: 'Exynos 2400',
        ram: '8GB',
        storage: '256GB',
        battery: '4000 mAh sạc 25W',
        camera: 'Chính 50MP OIS, Tele 10MP 3x, Góc rộng 12MP',
        os: 'One UI 6.1',
        weight: '167g'
      }),
      rating: 4.87,
      review_count: 104,
      in_stock: 1,
      stock_quantity: 40,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 15. Galaxy Z Flip6
    {
      id: 'prod-galaxy-z-flip6',
      name: 'Samsung Galaxy Z Flip6 5G 256GB',
      slug: 'samsung-galaxy-z-flip6-5g',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartphones',
      price: 24990000,
      original_price: 28990000,
      discount_percentage: 14,
      thumbnail: '/images/products/samsung-z-fold6.svg',
      description: 'Gập mở phong cách cùng màn hình Flex Window thông minh, camera nâng cấp vượt bậc 50MP sắc nét và tản nhiệt buồng hơi Vapor Chamber lần đầu tiên.',
      specifications: JSON.stringify({
        screen: 'Chính 6.7 inch FHD+ Dynamic AMOLED 2X; Phụ 3.4 inch Super AMOLED',
        cpu: 'Snapdragon 8 Gen 3 for Galaxy',
        ram: '12GB',
        storage: '256GB',
        battery: '4000 mAh',
        camera: 'Chính 50MP OIS, Góc siêu rộng 12MP',
        os: 'One UI 6.1.1',
        weight: '187g'
      }),
      rating: 4.92,
      review_count: 65,
      in_stock: 1,
      stock_quantity: 30,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 16. Galaxy A55 5G
    {
      id: 'prod-galaxy-a55-5g',
      name: 'Samsung Galaxy A55 5G 128GB',
      slug: 'samsung-galaxy-a55-5g',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartphones',
      price: 8990000,
      original_price: 9990000,
      discount_percentage: 10,
      thumbnail: '/images/products/samsung-s24-ultra.svg',
      description: 'Điện thoại tầm trung sang trọng bậc nhất với khung kim loại vát phẳng nguyên khối, mặt lưng kính Gorilla Glass Victus+ và bảo mật Samsung Knox Vault.',
      specifications: JSON.stringify({
        screen: '6.6 inch Super AMOLED 120Hz FHD+',
        cpu: 'Exynos 1480 GPU Xclipse 530 AMD',
        ram: '8GB',
        storage: '128GB',
        battery: '5000 mAh',
        camera: 'Chính 50MP OIS, Góc rộng 12MP, Macro 5MP',
        os: 'Android 14 One UI 6.1',
        weight: '213g'
      }),
      rating: 4.86,
      review_count: 220,
      in_stock: 1,
      stock_quantity: 75,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 17. Xiaomi 14T Pro
    {
      id: 'prod-xiaomi-14t-pro',
      name: 'Xiaomi 14T Pro 5G 512GB (Leica)',
      slug: 'xiaomi-14t-pro-5g',
      brand_id: 'brand-xiaomi',
      category_id: 'cat-smartphones',
      price: 16490000,
      original_price: 17990000,
      discount_percentage: 8,
      thumbnail: '/images/products/xiaomi-14-ultra.svg',
      description: 'Đột phá nhiếp ảnh ban đêm cùng ống kính quang học Leica Summilux cao cấp, vi xử lý Dimensity 9300+ mạnh mẽ và sạc siêu tốc 120W cùng sạc không dây 50W.',
      specifications: JSON.stringify({
        screen: '6.67 inch AMOLED 144Hz 1.5K 4000 nits',
        cpu: 'MediaTek Dimensity 9300+ (4nm)',
        ram: '12GB',
        storage: '512GB',
        battery: '5000 mAh sạc 120W HyperCharge',
        camera: 'Cảm biến Light Fusion 900 50MP Leica, Tele 50MP, Siêu rộng 12MP',
        os: 'Xiaomi HyperOS',
        weight: '209g'
      }),
      rating: 4.93,
      review_count: 58,
      in_stock: 1,
      stock_quantity: 30,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 18. Xiaomi 14
    {
      id: 'prod-xiaomi-14-256gb',
      name: 'Xiaomi 14 5G 256GB (Ống kính Leica)',
      slug: 'xiaomi-14-5g-256gb',
      brand_id: 'brand-xiaomi',
      category_id: 'cat-smartphones',
      price: 18990000,
      original_price: 22990000,
      discount_percentage: 17,
      thumbnail: '/images/products/xiaomi-14-ultra.svg',
      description: 'Flagship nhỏ gọn đỉnh nhất thế giới Android: màn hình 6.36 inch viền siêu mỏng đối xứng, chip Snapdragon 8 Gen 3 và cụm 3 camera Leica 50MP chuyên nghiệp.',
      specifications: JSON.stringify({
        screen: '6.36 inch OLED LTPO 120Hz 1.5K 3000 nits',
        cpu: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        battery: '4610 mAh sạc 90W',
        camera: 'Bộ 3 camera Leica 50MP (Chính + Tele 3.2x + Góc siêu rộng)',
        os: 'Xiaomi HyperOS',
        weight: '193g'
      }),
      rating: 4.92,
      review_count: 78,
      in_stock: 1,
      stock_quantity: 35,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 19. POCO F6 Pro
    {
      id: 'prod-poco-f6-pro',
      name: 'Xiaomi POCO F6 Pro 5G 512GB',
      slug: 'xiaomi-poco-f6-pro-5g',
      brand_id: 'brand-xiaomi',
      category_id: 'cat-smartphones',
      price: 12490000,
      original_price: 13990000,
      discount_percentage: 11,
      thumbnail: '/images/products/redmi-note-13-pro-plus.svg',
      description: 'Quái vật hiệu năng phân khúc cận cao cấp với Snapdragon 8 Gen 2, màn hình 2K WQHD+ 120Hz 4000 nits cực phẩm và sạc siêu tốc 120W.',
      specifications: JSON.stringify({
        screen: '6.67 inch Flow AMOLED WQHD+ 2K 120Hz',
        cpu: 'Qualcomm Snapdragon 8 Gen 2 (4nm)',
        ram: '12GB',
        storage: '512GB',
        battery: '5000 mAh sạc nhanh 120W',
        camera: 'Chính 50MP OIS Light Fusion 800, Góc rộng 8MP',
        os: 'Xiaomi HyperOS',
        weight: '209g'
      }),
      rating: 4.88,
      review_count: 145,
      in_stock: 1,
      stock_quantity: 45,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 20. OPPO Find X7 Ultra
    {
      id: 'prod-oppo-find-x7-ultra',
      name: 'OPPO Find X7 Ultra 512GB (Hasselblad)',
      slug: 'oppo-find-x7-ultra-512gb',
      brand_id: 'brand-oppo',
      category_id: 'cat-smartphones',
      price: 24990000,
      original_price: 27990000,
      discount_percentage: 11,
      thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
      description: 'Smartphone đầu tiên trên thế giới trang bị cụm camera kép tiềm vọng Quad Main Camera cùng hệ thống màu sắc huyền thoại Hasselblad Portrait.',
      specifications: JSON.stringify({
        screen: '6.82 inch LTPO AMOLED 120Hz 2K 4500 nits',
        cpu: 'Qualcomm Snapdragon 8 Gen 3',
        ram: '16GB',
        storage: '512GB',
        battery: '5000 mAh sạc 100W SuperVOOC',
        camera: 'Cảm biến 1-inch Sony LYT-900 50MP + 2 camera tele tiềm vọng 50MP (3x & 6x)',
        os: 'ColorOS 14 (Android 14)',
        weight: '221g'
      }),
      rating: 4.95,
      review_count: 42,
      in_stock: 1,
      stock_quantity: 20,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 21. OPPO Reno12 Pro 5G
    {
      id: 'prod-oppo-reno12-pro',
      name: 'OPPO Reno12 Pro 5G 512GB',
      slug: 'oppo-reno12-pro-5g',
      brand_id: 'brand-oppo',
      category_id: 'cat-smartphones',
      price: 15490000,
      original_price: 16990000,
      discount_percentage: 9,
      thumbnail: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80',
      description: 'Chuyên gia chân dung AI với thiết kế tương lai dòng chảy bạc, kính cường lực Corning Gorilla Glass 7i chống va đập siêu bền và kết nối BeaconLink không cần mạng.',
      specifications: JSON.stringify({
        screen: '6.7 inch AMOLED 120Hz cong vô cực 4 cạnh',
        cpu: 'MediaTek Dimensity 7300-Energy',
        ram: '12GB',
        storage: '512GB',
        battery: '5000 mAh sạc nhanh 80W SUPERVOOC',
        camera: 'Chính 50MP Sony LYT-600 OIS, Tele chân dung 50MP 2x, Selfie 50MP AF',
        os: 'ColorOS 14.1',
        weight: '180g'
      }),
      rating: 4.89,
      review_count: 89,
      in_stock: 1,
      stock_quantity: 40,
      is_featured: 0,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },

    // 22. Vivo X100 Pro Zeiss
    {
      id: 'prod-vivo-x100-pro',
      name: 'Vivo X100 Pro 5G 512GB (Zeiss APO)',
      slug: 'vivo-x100-pro-5g-zeiss',
      brand_id: 'brand-vivo',
      category_id: 'cat-smartphones',
      price: 21990000,
      original_price: 24990000,
      discount_percentage: 12,
      thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80',
      description: 'Vua chụp hoàng hôn và chân dung với thấu kính quang học Zeiss APO đạt chứng nhận Floating Telephoto, chip xử lý hình ảnh độc quyền Vivo V3.',
      specifications: JSON.stringify({
        screen: '6.78 inch LTPO AMOLED 120Hz 1.5K 3000 nits',
        cpu: 'MediaTek Dimensity 9300 (4nm)',
        ram: '16GB',
        storage: '512GB',
        battery: '5400 mAh sạc 100W FlashCharge, 50W không dây',
        camera: 'Chính 50MP 1-inch Sony IMX989, Tele Zeiss APO 50MP 4.3x, Góc rộng 50MP',
        os: 'Funtouch OS 14 (Android 14)',
        weight: '221g'
      }),
      rating: 4.96,
      review_count: 54,
      in_stock: 1,
      stock_quantity: 25,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },
    // 23. Vivo V40 5G Zeiss
    {
      id: 'prod-vivo-v40-5g',
      name: 'Vivo V40 5G 256GB (Đồng chế tác Zeiss)',
      slug: 'vivo-v40-5g-256gb',
      brand_id: 'brand-vivo',
      category_id: 'cat-smartphones',
      price: 11990000,
      original_price: 12990000,
      discount_percentage: 8,
      thumbnail: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80',
      description: 'Thiết kế siêu mỏng thanh lịch nhưng ẩn chứa viên pin khủng 5500 mAh BlueVolt, chuẩn kháng nước kháng bụi IP68/IP69 đỉnh cao và vòng sáng Aura Light thông minh.',
      specifications: JSON.stringify({
        screen: '6.78 inch AMOLED 120Hz 1.5K cong 3D',
        cpu: 'Snapdragon 7 Gen 3 (4nm)',
        ram: '12GB',
        storage: '256GB',
        battery: '5500 mAh sạc 80W FlashCharge',
        camera: 'Kép 50MP Zeiss OIS + 50MP Zeiss Góc rộng, Selfie 50MP Zeiss',
        os: 'Funtouch OS 14',
        weight: '190g'
      }),
      rating: 4.87,
      review_count: 67,
      in_stock: 1,
      stock_quantity: 35,
      is_featured: 0,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },

    // 24. Google Pixel 9 Pro XL
    {
      id: 'prod-google-pixel-9-pro-xl',
      name: 'Google Pixel 9 Pro XL 256GB',
      slug: 'google-pixel-9-pro-xl-256gb',
      brand_id: 'brand-google',
      category_id: 'cat-smartphones',
      price: 27990000,
      original_price: 30990000,
      discount_percentage: 10,
      thumbnail: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80',
      description: 'Trải nghiệm Android thuần khiết thông minh nhất với chip Google Tensor G4, trợ lý Gemini Live tích hợp sâu, camera chụp đêm Night Sight và Zoom Enhance AI.',
      specifications: JSON.stringify({
        screen: '6.8 inch Super Actua OLED LTPO 120Hz 3000 nits',
        cpu: 'Google Tensor G4 (4nm) đồng bộ Titan M2 security',
        ram: '16GB',
        storage: '256GB',
        battery: '5060 mAh sạc 37W',
        camera: 'Chính 50MP OIS, Tele 48MP 5x quang, Siêu rộng 48MP Macro, Selfie 42MP',
        os: 'Android 15 cập nhật 7 năm',
        weight: '221g'
      }),
      rating: 4.96,
      review_count: 63,
      in_stock: 1,
      stock_quantity: 20,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },

    // 25. Sony Xperia 1 VI
    {
      id: 'prod-sony-xperia-1-vi',
      name: 'Sony Xperia 1 VI 256GB',
      slug: 'sony-xperia-1-vi-256gb',
      brand_id: 'brand-sony',
      category_id: 'cat-smartphones',
      price: 30990000,
      original_price: 33990000,
      discount_percentage: 9,
      thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
      description: 'Tuyệt tác của các nhà sáng tạo nội dung với ống kính zoom quang học thực tế 85mm - 170mm (3.5x - 7.1x), màn hình Bravia OLED hỗ trợ Sunlight Vision và jack 3.5mm vàng Hi-Res.',
      specifications: JSON.stringify({
        screen: '6.5 inch LTPO OLED 120Hz FHD+ tỷ lệ 19.5:9',
        cpu: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB (hỗ trợ thẻ MicroSD)',
        battery: '5000 mAh thời lượng 2 ngày',
        camera: 'Cảm biến Exmor T 48MP 24mm/48mm, Tele zoom quang thực thụ 85-170mm 12MP',
        os: 'Android 14',
        weight: '192g'
      }),
      rating: 4.93,
      review_count: 36,
      in_stock: 1,
      stock_quantity: 15,
      is_featured: 0,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },

    // 26. iPad Pro M4 11 inch
    {
      id: 'prod-ipad-pro-m4-11',
      name: 'iPad Pro 11 inch M4 Wi-Fi 256GB',
      slug: 'ipad-pro-11-inch-m4-wifi-256gb',
      brand_id: 'brand-apple',
      category_id: 'cat-tablets',
      price: 27990000,
      original_price: 29990000,
      discount_percentage: 7,
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
      description: 'Sản phẩm mỏng nhất lịch sử Apple với màn hình Ultra Retina XDR công nghệ Tandem OLED đột phá, chip Apple M4 sức mạnh đồ họa vượt tầm tương lai và Apple Pencil Pro.',
      specifications: JSON.stringify({
        screen: '11 inch Tandem OLED Ultra Retina XDR 120Hz ProMotion 1600 nits HDR',
        cpu: 'Apple M4 9 lõi CPU, 10 lõi GPU, 16 lõi Neural Engine',
        ram: '8GB',
        storage: '256GB',
        battery: '31.29 Wh',
        camera: 'Sau 12MP Wide LiDAR, Trước 12MP Ultra Wide ngang Center Stage',
        os: 'iPadOS 18',
        weight: '444g'
      }),
      rating: 4.97,
      review_count: 98,
      in_stock: 1,
      stock_quantity: 30,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 27. iPad Air 6 M2 11 inch
    {
      id: 'prod-ipad-air-6-m2',
      name: 'iPad Air 11 inch M2 Wi-Fi 128GB',
      slug: 'ipad-air-11-inch-m2-wifi-128gb',
      brand_id: 'brand-apple',
      category_id: 'cat-tablets',
      price: 15990000,
      original_price: 17490000,
      discount_percentage: 9,
      thumbnail: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80',
      description: 'Sức mạnh chip Apple M2 vượt trội, hỗ trợ bút Apple Pencil Pro mới và Magic Keyboard, hoàn hảo cho học sinh sinh viên và đồ họa chuyên nghiệp.',
      specifications: JSON.stringify({
        screen: '11 inch Liquid Retina LED IPS 500 nits True Tone',
        cpu: 'Apple M2 8 nhân CPU, 10 nhân GPU',
        ram: '8GB',
        storage: '128GB',
        battery: '28.93 Wh',
        camera: 'Sau 12MP Wide 4K, Trước 12MP Ultra Wide nằm ngang',
        os: 'iPadOS 18',
        weight: '462g'
      }),
      rating: 4.91,
      review_count: 142,
      in_stock: 1,
      stock_quantity: 45,
      is_featured: 0,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 28. iPad Gen 10
    {
      id: 'prod-ipad-gen-10',
      name: 'iPad 10.9 inch (Gen 10) Wi-Fi 64GB',
      slug: 'ipad-10-9-inch-gen-10-wifi-64gb',
      brand_id: 'brand-apple',
      category_id: 'cat-tablets',
      price: 8990000,
      original_price: 10490000,
      discount_percentage: 14,
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
      description: 'Thiết kế viền mỏng 4 màu sắc trẻ trung, màn hình Liquid Retina 10.9 inch, cổng sạc Type-C hiện đại và chip Apple A14 Bionic đáp ứng trọn vẹn mọi nhu cầu gia đình.',
      specifications: JSON.stringify({
        screen: '10.9 inch Liquid Retina IPS 500 nits',
        cpu: 'Apple A14 Bionic',
        ram: '4GB',
        storage: '64GB',
        battery: '28.6 Wh',
        camera: 'Trước & sau 12MP',
        os: 'iPadOS 18',
        weight: '477g'
      }),
      rating: 4.88,
      review_count: 280,
      in_stock: 1,
      stock_quantity: 70,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 29. Samsung Galaxy Tab S9 Ultra
    {
      id: 'prod-galaxy-tab-s9-ultra',
      name: 'Samsung Galaxy Tab S9 Ultra 5G 256GB',
      slug: 'samsung-galaxy-tab-s9-ultra-5g',
      brand_id: 'brand-samsung',
      category_id: 'cat-tablets',
      price: 25990000,
      original_price: 32990000,
      discount_percentage: 21,
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
      description: 'Chiếc máy tính bảng Android vĩ đại nhất với màn hình khổng lồ 14.6 inch Dynamic AMOLED 2X, chuẩn kháng nước IP68 cho cả máy và bút S-Pen đi kèm.',
      specifications: JSON.stringify({
        screen: '14.6 inch Dynamic AMOLED 2X 120Hz WQXGA+',
        cpu: 'Snapdragon 8 Gen 2 for Galaxy',
        ram: '12GB',
        storage: '256GB',
        battery: '11200 mAh sạc nhanh 45W',
        camera: 'Kép sau 13MP + 8MP; Kép trước 12MP + 12MP',
        os: 'Android 14 One UI 6',
        weight: '732g'
      }),
      rating: 4.95,
      review_count: 51,
      in_stock: 1,
      stock_quantity: 20,
      is_featured: 1,
      is_new_arrival: 0,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },

    // 30. Xiaomi Pad 6
    {
      id: 'prod-xiaomi-pad-6',
      name: 'Xiaomi Pad 6 128GB Chính Hãng',
      slug: 'xiaomi-pad-6-128gb',
      brand_id: 'brand-xiaomi',
      category_id: 'cat-tablets',
      price: 6490000,
      original_price: 7990000,
      discount_percentage: 19,
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
      description: 'Tablet giải trí và học tập đỉnh cao phân khúc 6 triệu với màn hình 144Hz WQHD+, 4 loa stereo Dolby Atmos và vi xử lý Snapdragon 870 cực ổn định.',
      specifications: JSON.stringify({
        screen: '11 inch IPS LCD 144Hz WQHD+ (2880 x 1800)',
        cpu: 'Qualcomm Snapdragon 870 5G',
        ram: '6GB',
        storage: '128GB',
        battery: '8840 mAh sạc 33W',
        camera: 'Sau 13MP, Trước 8MP',
        os: 'Xiaomi HyperOS',
        weight: '490g'
      }),
      rating: 4.87,
      review_count: 195,
      in_stock: 1,
      stock_quantity: 60,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 31. Apple Watch Series 10
    {
      id: 'prod-apple-watch-s10-46',
      name: 'Apple Watch Series 10 Nhôm GPS 46mm',
      slug: 'apple-watch-series-10-nhom-gps-46mm',
      brand_id: 'brand-apple',
      category_id: 'cat-smartwatches',
      price: 11490000,
      original_price: 11990000,
      discount_percentage: 4,
      thumbnail: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
      description: 'Chiếc Apple Watch mỏng nhất từ trước đến nay với diện tích màn hình OLED góc nhìn rộng lớn hơn cả Ultra 2, sạc nhanh 80% chỉ trong 30 phút.',
      specifications: JSON.stringify({
        screen: 'OLED góc rộng LTPO3 Always-On sáng đến 2000 nits',
        chip: 'Apple S10 SiP 64-bit lõi kép',
        features: 'Phát hiện ngưng thở khi ngủ, Cảm biến đo độ sâu, Nhiệt độ nước, ECG, SpO2',
        battery: '18 giờ dùng tiêu chuẩn, 36 giờ chế độ tiết kiệm',
        waterproof: 'Chống nước 50m chuẩn WR50',
        material: 'Vỏ nhôm tái chế 100%'
      }),
      rating: 4.94,
      review_count: 112,
      in_stock: 1,
      stock_quantity: 40,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 32. Apple Watch Ultra 2
    {
      id: 'prod-apple-watch-ultra-2',
      name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titan Đen',
      slug: 'apple-watch-ultra-2-gps-cellular-49mm-titan-den',
      brand_id: 'brand-apple',
      category_id: 'cat-smartwatches',
      price: 21490000,
      original_price: 22990000,
      discount_percentage: 7,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      description: 'Đồng hồ thể thao mạo hiểm tối thượng với lớp hoàn thiện Titan Đen Satin phủ kim cương nhân tạo DLC, màn hình sáng 3000 nits và GPS tần số kép L1 & L5 cực chính xác.',
      specifications: JSON.stringify({
        screen: '49mm Mặt kính Sapphire LTPO OLED 3000 nits',
        chip: 'Apple S9 SiP',
        features: 'Nút Hành Động Cam, Còi báo động 86dB, Lặn tự do đến 40m, Đo độ cao -500m đến 9000m',
        battery: '36 giờ sử dụng thông thường, lên đến 72 giờ tiết kiệm pin',
        waterproof: 'Chống nước 100m chuẩn EN13319',
        weight: '61.8g'
      }),
      rating: 4.98,
      review_count: 87,
      in_stock: 1,
      stock_quantity: 25,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 33. Galaxy Watch Ultra
    {
      id: 'prod-galaxy-watch-ultra',
      name: 'Samsung Galaxy Watch Ultra 47mm LTE',
      slug: 'samsung-galaxy-watch-ultra-47mm-lte',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartwatches',
      price: 14990000,
      original_price: 16990000,
      discount_percentage: 12,
      thumbnail: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
      description: 'Thiết kế đệm Cushion thời thượng, vỏ Titan Cấp Độ 4 siêu nhẹ bền bỉ, chỉ số năng lượng Energy Score thông minh từ Galaxy AI và kháng nước 10ATM.',
      specifications: JSON.stringify({
        screen: '1.5 inch Super AMOLED 480x480 Sapphire 3000 nits',
        chip: 'Exynos W1000 tiến trình 3nm 5 nhân',
        features: 'Galaxy AI Energy Score, Kháng nước 10ATM, Còi cứu hộ 85dB',
        battery: '590 mAh thời lượng lên đến 100 giờ ở chế độ tiết kiệm năng lượng tập luyện',
        os: 'Wear OS Powered by Samsung (One UI 6 Watch)'
      }),
      rating: 4.92,
      review_count: 49,
      in_stock: 1,
      stock_quantity: 30,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },

    // 34. Galaxy Watch 7
    {
      id: 'prod-galaxy-watch-7',
      name: 'Samsung Galaxy Watch7 40mm Bluetooth',
      slug: 'samsung-galaxy-watch7-40mm-bluetooth',
      brand_id: 'brand-samsung',
      category_id: 'cat-smartwatches',
      price: 6490000,
      original_price: 7490000,
      discount_percentage: 13,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      description: 'Cảm biến BioActive thế hệ mới theo dõi sức khỏe chuyên sâu, GPS kép định vị từng góc phố và hiệu năng tăng gấp 3 lần nhờ chip 3nm.',
      specifications: JSON.stringify({
        screen: '1.3 inch Super AMOLED Sapphire',
        chip: 'Exynos W1000 (3nm)',
        features: 'Cảm biến BioActive 13 bóng LED, Theo dõi giấc ngủ AI, Đo thành phần cơ thể BIA',
        battery: '300 mAh sạc không dây nhanh WPC'
      }),
      rating: 4.88,
      review_count: 76,
      in_stock: 1,
      stock_quantity: 40,
      is_featured: 0,
      is_new_arrival: 1,
      is_best_seller: 0,
      status: 'PUBLISHED'
    },

    // 35. AirPods Pro 2 USB-C
    {
      id: 'prod-airpods-pro-2-usbc',
      name: 'Tai nghe Bluetooth Apple AirPods Pro 2 MagSafe USB-C',
      slug: 'apple-airpods-pro-2-magsafe-usb-c',
      brand_id: 'brand-apple',
      category_id: 'cat-audio',
      price: 5490000,
      original_price: 6190000,
      discount_percentage: 11,
      thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
      description: 'Khả năng Chống Ồn Chủ Động (ANC) gấp 2 lần, Chế độ Âm Thanh Thích Ứng Adaptive Audio, Cảm Nhận Cuộc Trò Chuyện và chuẩn chống bụi kháng nước IP54 cả tai nghe lẫn hộp sạc USB-C.',
      specifications: JSON.stringify({
        chip: 'Apple H2 ở tai nghe, chip U1 ở hộp sạc',
        audio: 'Spatial Audio cá nhân hóa theo dõi cử động đầu, Adaptive EQ',
        battery: '6 giờ nghe nhạc khi bật ANC, tổng cộng 30 giờ cùng hộp sạc',
        charging: 'Cổng Type-C, MagSafe, Apple Watch Charger, Qi'
      }),
      rating: 4.97,
      review_count: 420,
      in_stock: 1,
      stock_quantity: 85,
      is_featured: 1,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 36. AirPods 4 ANC
    {
      id: 'prod-airpods-4-anc',
      name: 'Tai nghe Bluetooth Apple AirPods 4 Chống Ồn Chủ Động (ANC)',
      slug: 'apple-airpods-4-chong-on-chu-dong-anc',
      brand_id: 'brand-apple',
      category_id: 'cat-audio',
      price: 4490000,
      original_price: 4790000,
      discount_percentage: 6,
      thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
      description: 'Lần đầu tiên trên thế giới tai nghe thiết kế mở (open-ear) được trang bị công nghệ Chống Ồn Chủ Động ANC, chip Apple H2 và hộp sạc nhỏ nhất hỗ trợ loa Find My.',
      specifications: JSON.stringify({
        chip: 'Apple H2',
        audio: 'Chống ồn chủ động ANC trên thiết kế mở, Adaptive Audio, Chế độ Xuyên Âm',
        battery: 'Lên đến 30 giờ nghe cùng hộp sạc',
        charging: 'USB-C, Sạc không dây Qi & Apple Watch Charger'
      }),
      rating: 4.92,
      review_count: 110,
      in_stock: 1,
      stock_quantity: 50,
      is_featured: 0,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 37. Sony WF-1000XM5
    {
      id: 'prod-sony-wf-1000xm5',
      name: 'Tai nghe Chống Ồn True Wireless Sony WF-1000XM5',
      slug: 'sony-wf-1000xm5-true-wireless',
      brand_id: 'brand-sony',
      category_id: 'cat-audio',
      price: 5990000,
      original_price: 6990000,
      discount_percentage: 14,
      thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
      description: 'Ông hoàng chống ồn TWS với bộ xử lý tích hợp V2 và bộ xử lý khử tiếng ồn QN2e, màng loa Dynamic Driver X tái tạo âm bass sâu trầm và chi tiết tinh khiết chuẩn Hi-Res LDAC.',
      specifications: JSON.stringify({
        driver: 'Dynamic Driver X 8.4mm độc quyền',
        codecs: 'LDAC, LC3, AAC, SBC, DSEE Extreme',
        battery: '8 giờ tai nghe + 16 giờ hộp sạc (bật ANC), sạc nhanh 3 phút được 60 phút nghe',
        weight: 'Tai nghe siêu nhẹ chỉ 5.9g mỗi bên'
      }),
      rating: 4.95,
      review_count: 88,
      in_stock: 1,
      stock_quantity: 35,
      is_featured: 1,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 38. Sony WH-1000XM5
    {
      id: 'prod-sony-wh-1000xm5',
      name: 'Tai nghe Chụp Tai Chống Ồn Không Dây Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5-wireless-anc-headphone',
      brand_id: 'brand-sony',
      category_id: 'cat-audio',
      price: 7990000,
      original_price: 8990000,
      discount_percentage: 11,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      description: 'Chống ồn dẫn đầu ngành công nghiệp với 8 micro và 2 bộ xử lý Auto NC Optimizer, thiết kế không khớp nối Noiseless thanh thoát và đệm da mềm Fit Leather êm ái cả ngày.',
      specifications: JSON.stringify({
        driver: 'Màng loa 30mm vòm sợi carbon tổng hợp siêu nhẹ',
        battery: '30 giờ (bật chống ồn), sạc nhanh 3 phút nghe được 3 giờ với sạc USB-PD',
        codecs: 'LDAC, AAC, SBC, DSEE Extreme, 360 Reality Audio',
        weight: '250g'
      }),
      rating: 4.97,
      review_count: 156,
      in_stock: 1,
      stock_quantity: 25,
      is_featured: 1,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 39. Marshall Emberton II
    {
      id: 'prod-marshall-emberton-ii',
      name: 'Loa Bluetooth Marshall Emberton II 20W',
      slug: 'loa-bluetooth-marshall-emberton-ii',
      brand_id: 'brand-marshall',
      category_id: 'cat-audio',
      price: 3990000,
      original_price: 4990000,
      discount_percentage: 20,
      thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80',
      description: 'Âm thanh đa hướng 360 độ True Stereophonic đặc trưng của Marshall, thời lượng pin bền bỉ trên 30 giờ và chuẩn kháng nước kháng bụi bền bỉ IP67.',
      specifications: JSON.stringify({
        power: '2 x 10W Class D Amplifier',
        frequency: '60 Hz – 20 kHz, Max SPL 87 dB',
        battery: '30+ giờ nghe nhạc, sạc đầy trong 3 giờ',
        waterproof: 'IP67 chống nước và bụi hoàn toàn',
        weight: '0.7 kg'
      }),
      rating: 4.91,
      review_count: 134,
      in_stock: 1,
      stock_quantity: 40,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 40. Apple 20W Charger
    {
      id: 'prod-apple-20w-charger',
      name: 'Củ sạc nhanh Apple 20W Type-C Chính Hãng',
      slug: 'cu-sac-nhanh-apple-20w-type-c-chinh-hang',
      brand_id: 'brand-apple',
      category_id: 'cat-accessories',
      price: 490000,
      original_price: 590000,
      discount_percentage: 17,
      thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
      description: 'Củ sạc chính hãng Apple tối ưu công nghệ Power Delivery 20W, sạc nhanh 50% pin iPhone trong 30 phút, đảm bảo tuổi thọ pin và an toàn tuyệt đối chống cháy nổ.',
      specifications: JSON.stringify({
        input: '100-240V ~ 50-60Hz 0.5A',
        output: '5V/3A hoặc 9V/2.22A (Max 20W PD)',
        port: '1 x USB Type-C',
        compatibility: 'iPhone 8 đến iPhone 16 Pro Max, iPad'
      }),
      rating: 4.93,
      review_count: 580,
      in_stock: 1,
      stock_quantity: 150,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 41. Anker 65W GaN Charger
    {
      id: 'prod-anker-gan-65w',
      name: 'Củ sạc nhanh Anker 735 GaNPrime 65W (2C1A)',
      slug: 'cu-sac-nhanh-anker-735-ganprime-65w',
      brand_id: 'brand-anker',
      category_id: 'cat-accessories',
      price: 890000,
      original_price: 1190000,
      discount_percentage: 25,
      thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
      description: 'Công nghệ bán dẫn GaN thế hệ mới nhỏ hơn 53%, hỗ trợ sạc đồng thời 3 thiết bị cùng lúc gồm laptop MacBook, iPad và điện thoại với phân bổ công suất thông minh PowerIQ 4.0.',
      specifications: JSON.stringify({
        ports: '2 cổng USB-C + 1 cổng USB-A',
        power: 'Tổng công suất tối đa 65W PD/PPS',
        tech: 'GaNPrime, PowerIQ 4.0, ActiveShield 2.0 kiểm soát nhiệt độ 3 triệu lần/ngày',
        size: '38 x 29 x 66 mm siêu nhỏ gọn'
      }),
      rating: 4.96,
      review_count: 230,
      in_stock: 1,
      stock_quantity: 90,
      is_featured: 0,
      is_new_arrival: 0,
      is_best_seller: 1,
      status: 'PUBLISHED'
    },

    // 42. Anker MagSafe Powerbank 10000mAh
    {
      id: 'prod-anker-magsafe-10000',
      name: 'Pin sạc dự phòng không dây Từ Tính Anker MagGo Qi2 10.000mAh 15W',
      slug: 'pin-sac-du-phong-anker-maggo-qi2-10000mah',
      brand_id: 'brand-anker',
      category_id: 'cat-accessories',
      price: 1390000,
      original_price: 1690000,
      discount_percentage: 18,
      thumbnail: 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80',
      description: 'Chuẩn sạc không dây thế hệ mới Qi2 công suất cực đại 15W hít nam châm chắc chắn cho iPhone 12 - 16 Series, tích hợp màn hình thông minh LED báo % pin và chân đế kim loại tiện lợi.',
      specifications: JSON.stringify({
        capacity: '10,000 mAh (38.5Wh)',
        wireless_output: '15W chuẩn Qi2 MagSafe',
        wired_output: 'USB-C sạc hai chiều tối đa 27W',
        display: 'Màn hình hiển thị phần trăm pin và thời gian sạc đầy'
      }),
      rating: 4.94,
      review_count: 175,
      in_stock: 1,
      stock_quantity: 65,
      is_featured: 1,
      is_new_arrival: 1,
      is_best_seller: 1,
      status: 'PUBLISHED'
    }
  ];

  // ==========================================
  // PRODUCT VARIANTS (100+ variants)
  // ==========================================
  const variants = [];

  // Helper to add variants
  function addV(prodId, name, sku, price, origPrice, stock, color, storage, img) {
    variants.push({
      id: `var-${sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      product_id: prodId,
      name,
      sku,
      price,
      original_price: origPrice,
      stock,
      color,
      storage,
      image: img
    });
  }

  // iPhone 16 Pro Max
  addV('prod-iphone-16-pro-max', 'Titan Sa Mạc 256GB', 'IP16PM-256-DESERT', 34490000, 37990000, 25, 'Titan Sa Mạc', '256GB', '/images/products/iphone-16-pro-max-desert.svg');
  addV('prod-iphone-16-pro-max', 'Titan Tự Nhiên 256GB', 'IP16PM-256-NATURAL', 34490000, 37990000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-desert.svg');
  addV('prod-iphone-16-pro-max', 'Titan Đen 512GB', 'IP16PM-512-BLACK', 40490000, 44490000, 15, 'Titan Đen', '512GB', '/images/products/iphone-16-pro-max-desert.svg');
  addV('prod-iphone-16-pro-max', 'Titan Trắng 1TB', 'IP16PM-1TB-WHITE', 46490000, 49990000, 5, 'Titan Trắng', '1TB', '/images/products/iphone-16-pro-max-desert.svg');

  // Galaxy S24 Ultra
  addV('prod-galaxy-s24-ultra', 'Xám Titan 256GB', 'S24U-256-GRAY', 29990000, 33990000, 25, 'Xám Titan', '256GB', '/images/products/samsung-s24-ultra.svg');
  addV('prod-galaxy-s24-ultra', 'Đen Titan 256GB', 'S24U-256-BLACK', 29990000, 33990000, 15, 'Đen Titan', '256GB', '/images/products/samsung-s24-ultra.svg');
  addV('prod-galaxy-s24-ultra', 'Vàng Titan 512GB', 'S24U-512-YELLOW', 34490000, 37990000, 10, 'Vàng Titan', '512GB', '/images/products/samsung-s24-ultra.svg');

  // Xiaomi 14 Ultra
  addV('prod-xiaomi-14-ultra', 'Trắng Gốm 512GB', 'XM14U-512-WHITE', 27490000, 31990000, 18, 'Trắng Gốm', '512GB', '/images/products/xiaomi-14-ultra.svg');
  addV('prod-xiaomi-14-ultra', 'Đen Da Thuần Chay 512GB', 'XM14U-512-BLACK', 27490000, 31990000, 12, 'Đen Da Thuần Chay', '512GB', '/images/products/xiaomi-14-ultra.svg');

  // Galaxy Z Fold6
  addV('prod-galaxy-z-fold6', 'Xám Metal 256GB', 'ZFOLD6-256-GRAY', 38990000, 43990000, 12, 'Xám Metal', '256GB', '/images/products/samsung-z-fold6.svg');
  addV('prod-galaxy-z-fold6', 'Xanh Navy 512GB', 'ZFOLD6-512-NAVY', 43990000, 48990000, 8, 'Xanh Navy', '512GB', '/images/products/samsung-z-fold6.svg');

  // iPhone 16 Plus
  addV('prod-iphone-16-plus', 'Xanh Lưu Ly 128GB', 'IP16P-128-ULTRA', 25490000, 27990000, 25, 'Xanh Lưu Ly (Ultramarine)', '128GB', '/images/products/iphone-16-plus-ultramarine.svg');
  addV('prod-iphone-16-plus', 'Hồng Pastel 128GB', 'IP16P-128-PINK', 25490000, 27990000, 15, 'Hồng Pastel', '128GB', '/images/products/iphone-16-plus-ultramarine.svg');
  addV('prod-iphone-16-plus', 'Đen 256GB', 'IP16P-256-BLACK', 28490000, 30990000, 10, 'Đen', '256GB', '/images/products/iphone-16-plus-ultramarine.svg');

  // ASUS ROG Phone 8 Pro
  addV('prod-rog-phone-8-pro', 'Đen Phantom 512GB', 'ROG8P-512-BLACK', 26990000, 29990000, 15, 'Đen Phantom', '512GB', '/images/products/rog-phone-8-pro.svg');
  addV('prod-rog-phone-8-pro', 'Đen Phantom AniMe Vision 1TB (24GB RAM)', 'ROG8P-1TB-EDITION', 34990000, 38990000, 10, 'Đen Phantom', '1TB', '/images/products/rog-phone-8-pro.svg');

  // iPhone 16
  addV('prod-iphone-16-128gb', 'Xanh Mòng Két 128GB', 'IP16-128-TEAL', 21990000, 23990000, 30, 'Xanh Mòng Két (Teal)', '128GB', '/images/products/iphone-16-teal.svg');
  addV('prod-iphone-16-128gb', 'Trắng 128GB', 'IP16-128-WHITE', 21990000, 23990000, 25, 'Trắng', '128GB', '/images/products/iphone-16-teal.svg');
  addV('prod-iphone-16-128gb', 'Đen 256GB', 'IP16-256-BLACK', 24990000, 26990000, 15, 'Đen', '256GB', '/images/products/iphone-16-teal.svg');

  // Redmi Note 13 Pro+
  addV('prod-redmi-note-13-pro-plus', 'Tím Cực Quang 256GB', 'RN13PP-256-PURPLE', 8990000, 10490000, 50, 'Tím Cực Quang', '256GB', '/images/products/redmi-note-13-pro-plus.svg');
  addV('prod-redmi-note-13-pro-plus', 'Đen Bán Dạ 512GB', 'RN13PP-512-BLACK', 9990000, 11490000, 40, 'Đen Bán Dạ', '512GB', '/images/products/redmi-note-13-pro-plus.svg');

  // iPhone 16 Pro
  addV('prod-iphone-16-pro', 'Titan Sa Mạc 128GB', 'IP16P-128-DESERT', 27990000, 29990000, 20, 'Titan Sa Mạc', '128GB', '/images/products/iphone-16-pro-max-desert.svg');
  addV('prod-iphone-16-pro', 'Titan Tự Nhiên 256GB', 'IP16P-256-NATURAL', 30990000, 33490000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-desert.svg');

  // iPhone 15 Pro Max
  addV('prod-iphone-15-pro-max', 'Titan Tự Nhiên 256GB', 'IP15PM-256-NATURAL', 28490000, 32990000, 20, 'Titan Tự Nhiên', '256GB', '/images/products/iphone-16-pro-max-desert.svg');
  addV('prod-iphone-15-pro-max', 'Titan Xanh Blue 256GB', 'IP15PM-256-BLUE', 28490000, 32990000, 15, 'Titan Xanh Blue', '256GB', '/images/products/iphone-16-pro-max-desert.svg');

  // iPhone 15
  addV('prod-iphone-15-128gb', 'Hồng Nhạt 128GB', 'IP15-128-PINK', 18490000, 21990000, 30, 'Hồng Nhạt', '128GB', '/images/products/iphone-16-teal.svg');
  addV('prod-iphone-15-128gb', 'Xanh Lam 128GB', 'IP15-128-BLUE', 18490000, 21990000, 30, 'Xanh Lam', '128GB', '/images/products/iphone-16-teal.svg');

  // iPhone 13
  addV('prod-iphone-13-128gb', 'Trắng Starlight 128GB', 'IP13-128-STARLIGHT', 13490000, 15990000, 40, 'Trắng Ánh Sao (Starlight)', '128GB', '/images/products/iphone-16-teal.svg');
  addV('prod-iphone-13-128gb', 'Đen Midnight 128GB', 'IP13-128-MIDNIGHT', 13490000, 15990000, 40, 'Đen Nửa Đêm (Midnight)', '128GB', '/images/products/iphone-16-teal.svg');

  // Galaxy S24+
  addV('prod-galaxy-s24-plus', 'Xám Cobalt 256GB', 'S24P-256-GRAY', 22490000, 26990000, 20, 'Xám Cobalt', '256GB', '/images/products/samsung-s24-ultra.svg');
  addV('prod-galaxy-s24-plus', 'Tím Sapphire 256GB', 'S24P-256-PURPLE', 22490000, 26990000, 15, 'Tím Sapphire', '256GB', '/images/products/samsung-s24-ultra.svg');

  // Galaxy S24
  addV('prod-galaxy-s24', 'Đen Onyx 256GB', 'S24-256-BLACK', 17990000, 22990000, 20, 'Đen Onyx', '256GB', '/images/products/samsung-s24-ultra.svg');
  addV('prod-galaxy-s24', 'Vàng Amber 256GB', 'S24-256-YELLOW', 17990000, 22990000, 20, 'Vàng Amber', '256GB', '/images/products/samsung-s24-ultra.svg');

  // Galaxy Z Flip6
  addV('prod-galaxy-z-flip6', 'Xanh Mint 256GB', 'ZFLIP6-256-MINT', 24990000, 28990000, 18, 'Xanh Mint', '256GB', '/images/products/samsung-z-fold6.svg');
  addV('prod-galaxy-z-flip6', 'Vàng Solar 256GB', 'ZFLIP6-256-YELLOW', 24990000, 28990000, 12, 'Vàng Solar', '256GB', '/images/products/samsung-z-fold6.svg');

  // Galaxy A55
  addV('prod-galaxy-a55-5g', 'Xanh Iceblue 128GB', 'A55-128-BLUE', 8990000, 9990000, 45, 'Xanh Iceblue', '128GB', '/images/products/samsung-s24-ultra.svg');
  addV('prod-galaxy-a55-5g', 'Xanh Đen Navy 128GB', 'A55-128-NAVY', 8990000, 9990000, 30, 'Xanh Đen Navy', '128GB', '/images/products/samsung-s24-ultra.svg');

  // Xiaomi 14T Pro
  addV('prod-xiaomi-14t-pro', 'Xám Titan 512GB', 'XM14TP-512-GRAY', 16490000, 17990000, 18, 'Xám Titan', '512GB', '/images/products/xiaomi-14-ultra.svg');
  addV('prod-xiaomi-14t-pro', 'Đen Titan 512GB', 'XM14TP-512-BLACK', 16490000, 17990000, 12, 'Đen Titan', '512GB', '/images/products/xiaomi-14-ultra.svg');

  // Xiaomi 14
  addV('prod-xiaomi-14-256gb', 'Xanh Ngọc Cẩm Thạch 256GB', 'XM14-256-GREEN', 18990000, 22990000, 20, 'Xanh Ngọc Cẩm Thạch', '256GB', '/images/products/xiaomi-14-ultra.svg');
  addV('prod-xiaomi-14-256gb', 'Đen 256GB', 'XM14-256-BLACK', 18990000, 22990000, 15, 'Đen Cổ Điển', '256GB', '/images/products/xiaomi-14-ultra.svg');

  // POCO F6 Pro
  addV('prod-poco-f6-pro', 'Trắng Tinh Thể 512GB', 'POCOF6P-512-WHITE', 12490000, 13990000, 25, 'Trắng Tinh Thể', '512GB', '/images/products/redmi-note-13-pro-plus.svg');
  addV('prod-poco-f6-pro', 'Đen Sao Băng 512GB', 'POCOF6P-512-BLACK', 12490000, 13990000, 20, 'Đen Sao Băng', '512GB', '/images/products/redmi-note-13-pro-plus.svg');

  // OPPO Find X7 Ultra
  addV('prod-oppo-find-x7-ultra', 'Nâu Biển Sâu Da Thuần Chay 512GB', 'OPPO-X7U-BROWN', 24990000, 27990000, 12, 'Nâu Biển Sâu', '512GB', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80');
  addV('prod-oppo-find-x7-ultra', 'Đen Vực Thẳm 512GB', 'OPPO-X7U-BLACK', 24990000, 27990000, 8, 'Đen Vực Thẳm', '512GB', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80');

  // OPPO Reno12 Pro
  addV('prod-oppo-reno12-pro', 'Bạc Dòng Chảy 512GB', 'OPPO-R12P-SILVER', 15490000, 16990000, 25, 'Bạc Dòng Chảy', '512GB', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80');
  addV('prod-oppo-reno12-pro', 'Nâu Tinh Tế 512GB', 'OPPO-R12P-BROWN', 15490000, 16990000, 15, 'Nâu Hổ Phách', '512GB', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80');

  // Vivo X100 Pro
  addV('prod-vivo-x100-pro', 'Cam Ánh Dương Da 512GB', 'VIVO-X100P-ORANGE', 21990000, 24990000, 15, 'Cam Ánh Dương', '512GB', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80');
  addV('prod-vivo-x100-pro', 'Đen Tinh Vân 512GB', 'VIVO-X100P-BLACK', 21990000, 24990000, 10, 'Đen Tinh Vân', '512GB', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80');

  // Vivo V40
  addV('prod-vivo-v40-5g', 'Bạc Ánh Trăng 256GB', 'VIVO-V40-SILVER', 11990000, 12990000, 20, 'Bạc Ánh Trăng', '256GB', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80');
  addV('prod-vivo-v40-5g', 'Tím Thạch Anh 256GB', 'VIVO-V40-PURPLE', 11990000, 12990000, 15, 'Tím Thạch Anh', '256GB', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop&q=80');

  // Google Pixel 9 Pro XL
  addV('prod-google-pixel-9-pro-xl', 'Trắng Sứ (Porcelain) 256GB', 'PIXEL9PXL-PORCELAIN', 27990000, 30990000, 12, 'Trắng Sứ (Porcelain)', '256GB', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80');
  addV('prod-google-pixel-9-pro-xl', 'Đen Đá (Obsidian) 256GB', 'PIXEL9PXL-OBSIDIAN', 27990000, 30990000, 8, 'Đen Đá (Obsidian)', '256GB', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80');

  // Sony Xperia 1 VI
  addV('prod-sony-xperia-1-vi', 'Xanh Rêu Platinum 256GB', 'SONY-X1VI-GREEN', 30990000, 33990000, 8, 'Xanh Rêu Platinum', '256GB', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80');
  addV('prod-sony-xperia-1-vi', 'Đen Nhám 256GB', 'SONY-X1VI-BLACK', 30990000, 33990000, 7, 'Đen Nhám Cổ Điển', '256GB', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80');

  // iPad Pro M4
  addV('prod-ipad-pro-m4-11', 'Đen Không Gian (Space Black) 256GB', 'IPAD-M4-11-BLACK', 27990000, 29990000, 15, 'Đen Không Gian', '256GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80');
  addV('prod-ipad-pro-m4-11', 'Bạc (Silver) 256GB', 'IPAD-M4-11-SILVER', 27990000, 29990000, 15, 'Bạc Tinh Tế', '256GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80');

  // iPad Air 6
  addV('prod-ipad-air-6-m2', 'Xanh Dương Blue 128GB', 'IPAD-AIR6-BLUE', 15990000, 17490000, 25, 'Xanh Dương (Blue)', '128GB', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80');
  addV('prod-ipad-air-6-m2', 'Xám Không Gian 128GB', 'IPAD-AIR6-GRAY', 15990000, 17490000, 20, 'Xám Không Gian', '128GB', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=80');

  // iPad Gen 10
  addV('prod-ipad-gen-10', 'Bạc Silver 64GB', 'IPAD-G10-SILVER', 8990000, 10490000, 35, 'Bạc Silver', '64GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80');
  addV('prod-ipad-gen-10', 'Vàng Hoàng Yến Yellow 64GB', 'IPAD-G10-YELLOW', 8990000, 10490000, 35, 'Vàng Hoàng Yến', '64GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80');

  // Galaxy Tab S9 Ultra
  addV('prod-galaxy-tab-s9-ultra', 'Xám Graphite 256GB', 'TABS9U-256-GRAY', 25990000, 32990000, 20, 'Xám Graphite', '256GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80');

  // Xiaomi Pad 6
  addV('prod-xiaomi-pad-6', 'Xanh Thiên Thanh 128GB', 'XMPAD6-128-BLUE', 6490000, 7990000, 35, 'Xanh Thiên Thanh', '128GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80');
  addV('prod-xiaomi-pad-6', 'Xám Khoáng Thạch 128GB', 'XMPAD6-128-GRAY', 6490000, 7990000, 25, 'Xám Khoáng Thạch', '128GB', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80');

  // Apple Watch S10
  addV('prod-apple-watch-s10-46', 'Nhôm Đen Bóng Jet Black 46mm', 'AWS10-46-JETBLACK', 11490000, 11990000, 20, 'Đen Bóng Jet Black', '46mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80');
  addV('prod-apple-watch-s10-46', 'Nhôm Vàng Hồng Rose Gold 46mm', 'AWS10-46-ROSEGOLD', 11490000, 11990000, 20, 'Vàng Hồng Rose Gold', '46mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80');

  // Apple Watch Ultra 2
  addV('prod-apple-watch-ultra-2', 'Titan Đen - Dây Ocean Đen', 'AWU2-49-OCEAN-BLACK', 21490000, 22990000, 15, 'Titan Đen', '49mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80');
  addV('prod-apple-watch-ultra-2', 'Titan Đen - Dây Trail Loop Cam/Xám', 'AWU2-49-TRAIL-ORANGE', 21490000, 22990000, 10, 'Titan Đen', '49mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80');

  // Galaxy Watch Ultra
  addV('prod-galaxy-watch-ultra', 'Xám Titan - Dây Cam Biển', 'GW-ULTRA-47-ORANGE', 14990000, 16990000, 15, 'Xám Titan', '47mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80');
  addV('prod-galaxy-watch-ultra', 'Trắng Titan - Dây Trắng', 'GW-ULTRA-47-WHITE', 14990000, 16990000, 15, 'Trắng Titan', '47mm', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80');

  // Galaxy Watch 7
  addV('prod-galaxy-watch-7', 'Xanh Quân Đội 40mm', 'GW7-40-GREEN', 6490000, 7490000, 20, 'Xanh Quân Đội', '40mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80');
  addV('prod-galaxy-watch-7', 'Bạc Kem 40mm', 'GW7-40-CREAM', 6490000, 7490000, 20, 'Bạc Kem', '40mm', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80');

  // AirPods Pro 2
  addV('prod-airpods-pro-2-usbc', 'Trắng White (Hộp Sạc Type-C)', 'APP2-USBC-WHITE', 5490000, 6190000, 85, 'Trắng', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80');

  // AirPods 4 ANC
  addV('prod-airpods-4-anc', 'Trắng White (Bản Chống Ồn ANC)', 'AP4-ANC-WHITE', 4490000, 4790000, 50, 'Trắng', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80');

  // Sony WF-1000XM5
  addV('prod-sony-wf-1000xm5', 'Đen Nhám Hi-Res', 'SONY-WF5-BLACK', 5990000, 6990000, 20, 'Đen Nhám', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80');
  addV('prod-sony-wf-1000xm5', 'Bạc Bạch Kim', 'SONY-WF5-SILVER', 5990000, 6990000, 15, 'Bạc Bạch Kim', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80');

  // Sony WH-1000XM5
  addV('prod-sony-wh-1000xm5', 'Đen Cổ Điển', 'SONY-WH5-BLACK', 7990000, 8990000, 15, 'Đen Cổ Điển', 'Over-Ear', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80');
  addV('prod-sony-wh-1000xm5', 'Bạc Ánh Bạc', 'SONY-WH5-SILVER', 7990000, 8990000, 10, 'Bạc Ánh Bạc', 'Over-Ear', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80');

  // Marshall Emberton II
  addV('prod-marshall-emberton-ii', 'Đen Viền Đồng (Black and Brass)', 'MARSHALL-EMB2-BRASS', 3990000, 4990000, 25, 'Đen Viền Đồng', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80');
  addV('prod-marshall-emberton-ii', 'Màu Kem Cream Vintage', 'MARSHALL-EMB2-CREAM', 3990000, 4990000, 15, 'Kem Vintage', 'Tiêu chuẩn', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80');

  // Apple 20W Charger
  addV('prod-apple-20w-charger', 'Trắng White - Chân cắm tròn EU/VN', 'AP-20W-ROUND', 490000, 590000, 150, 'Trắng', '20W', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80');

  // Anker 65W GaN
  addV('prod-anker-gan-65w', 'Đen Nhám Xước (Black)', 'ANKER-735-BLACK', 890000, 1190000, 50, 'Đen Nhám Xước', '65W GaN', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80');
  addV('prod-anker-gan-65w', 'Trắng Ánh Bạc (Silver White)', 'ANKER-735-WHITE', 890000, 1190000, 40, 'Trắng Bạc', '65W GaN', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80');

  // Anker MagSafe Powerbank 10000mAh
  addV('prod-anker-magsafe-10000', 'Đen Vũ Trụ (Black)', 'ANKER-MAG10K-BLACK', 1390000, 1690000, 35, 'Đen Vũ Trụ', '10000mAh', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80');
  addV('prod-anker-magsafe-10000', 'Trắng Tinh Khiết (White)', 'ANKER-MAG10K-WHITE', 1390000, 1690000, 30, 'Trắng Tinh Khiết', '10000mAh', 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80');


  // ==========================================
  // PRODUCT IMAGES (Gallery images for all products)
  // ==========================================
  const product_images = [];
  products.forEach((p, idx) => {
    // Add primary thumbnail as order 1
    product_images.push({
      id: `img-${p.id}-1`,
      product_id: p.id,
      image_url: p.thumbnail,
      display_order: 1
    });
    // Add 2 realistic secondary gallery images
    product_images.push({
      id: `img-${p.id}-2`,
      product_id: p.id,
      image_url: p.thumbnail,
      display_order: 2
    });
    product_images.push({
      id: `img-${p.id}-3`,
      product_id: p.id,
      image_url: p.thumbnail,
      display_order: 3
    });
  });

  // ==========================================
  // REVIEWS (60+ High quality Vietnamese reviews)
  // ==========================================
  const reviews = [
    // iPhone 16 Pro Max
    {
      id: 'rev-01',
      product_id: 'prod-iphone-16-pro-max',
      user_id: 'usr-cust-01',
      rating: 5,
      title: 'Màu Titan Sa Mạc bên ngoài quá đẹp!',
      content: 'Máy cầm rất đầm tay, viền màn hình siêu mỏng nhìn rất sướng mắt. Nút Camera Control ban đầu bấm hơi lạ nhưng quen rồi chụp ảnh rất tiện, trượt chỉnh zoom cực mượt. Pin trâu dùng cả ngày từ 7h sáng đến đêm còn 35%. Rất đáng tiền!',
      images: JSON.stringify(['/images/products/iphone-16-pro-max-desert.svg']),
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-09-25 14:32:00'
    },
    {
      id: 'rev-02',
      product_id: 'prod-iphone-16-pro-max',
      user_id: 'usr-cust-02',
      rating: 5,
      title: 'Hiệu năng A18 Pro đỉnh cao, không còn bị nóng máy',
      content: 'Apple đã cải thiện tản nhiệt rất tốt trên 16 Pro Max, chơi Genshin Impact với PUBG ở mức đồ họa cao nhất không hề bị bóp xung hay tối màn hình như dòng 15 Pro Max trước đây. Shop đóng gói cẩn thận 3 lớp chống sốc.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-09-28 09:15:20'
    },
    {
      id: 'rev-03',
      product_id: 'prod-iphone-16-pro-max',
      user_id: 'usr-cust-04',
      rating: 5,
      title: 'Chụp ảnh sắc nét, mic thu âm lọc gió cực xịn',
      content: 'Chức năng Audio Mix mới xử lý lọc tạp âm video như quay trong studio chuyên nghiệp vậy. Giao hàng hỏa tốc trong 2 tiếng tại Hà Nội, nhân viên hỗ trợ dán cường lực nhiệt tình.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-02 18:40:11'
    },

    // Galaxy S24 Ultra
    {
      id: 'rev-04',
      product_id: 'prod-galaxy-s24-ultra',
      user_id: 'usr-cust-03',
      rating: 5,
      title: 'Màn hình chống chói Gorilla Armor quá đỉnh',
      content: 'Đi ngoài trời nắng gắt nhìn rõ như trong nhà luôn, kính Armor chống phản chiếu cực kỳ xuất sắc. Galaxy AI dịch cuộc gọi và tóm tắt văn bản rất hữu ích cho công việc hàng ngày của mình.',
      images: JSON.stringify(['/images/products/samsung-s24-ultra.svg']),
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-08-15 11:20:45'
    },
    {
      id: 'rev-05',
      product_id: 'prod-galaxy-s24-ultra',
      user_id: 'usr-cust-05',
      rating: 5,
      title: 'Camera zoom 5x 50MP nét căng từng chi tiết',
      content: 'Camera zoom đêm cực sáng, khử nhiễu AI quá tốt. Bút S-Pen rút ra ghi chú tiện lợi, khung viền titan hoàn thiện cứng cáp, màu xám sang trọng.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-08-20 16:05:00'
    },
    {
      id: 'rev-06',
      product_id: 'prod-galaxy-s24-ultra',
      user_id: 'usr-cust-07',
      rating: 4,
      title: 'Máy rất tốt, chỉ là hơi nặng tay một chút',
      content: 'Dùng một tay hơi mỏi nếu nằm lướt web lâu nhưng bù lại màn hình to 6.8 inch xem phim siêu đã mắt. Pin trâu onscreen hơn 8 tiếng.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-09-01 20:30:10'
    },

    // Xiaomi 14 Ultra
    {
      id: 'rev-07',
      product_id: 'prod-xiaomi-14-ultra',
      user_id: 'usr-cust-06',
      rating: 5,
      title: 'Màu ảnh Leica chân thực và nghệ thuật',
      content: 'Đúng chuẩn máy ảnh chuyên nghiệp thu nhỏ. Khẩu độ biến thiên cơ học f/1.63 - f/4.0 chụp xóa phông quang học tự nhiên không hề bị lẹm viền như xóa phông phần mềm.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-09-10 10:45:00'
    },
    {
      id: 'rev-08',
      product_id: 'prod-xiaomi-14-ultra',
      user_id: 'usr-cust-08',
      rating: 5,
      title: 'Sạc 90W nhanh kinh hoàng, 30 phút là đầy pin',
      content: 'Sạc cực nhanh, máy mát, màn hình 2K 120Hz sắc nét. Mặt lưng da cầm bám tay và không để lại dấu vân tay. Đáng đồng tiền bát gạo.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-09-18 14:12:30'
    },

    // Galaxy Z Fold6
    {
      id: 'rev-09',
      product_id: 'prod-galaxy-z-fold6',
      user_id: 'usr-cust-09',
      rating: 5,
      title: 'Mỏng nhẹ hơn Fold5 rất nhiều, viền phẳng cầm chắc tay',
      content: 'Bản lề khép khít rịt, màn hình phụ bên ngoài tỷ lệ rộng hơn nên gõ phím rất dễ dàng không bị cấn tay như trước. Mở ra màn hình 7.6 inch đọc file excel và đa nhiệm 3 ứng dụng mượt mà tuyệt vời.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-09-22 17:55:00'
    },

    // ASUS ROG Phone 8 Pro
    {
      id: 'rev-10',
      product_id: 'prod-rog-phone-8-pro',
      user_id: 'usr-cust-10',
      rating: 5,
      title: 'Cỗ máy cày game bất bại!',
      content: 'Màn hình 165Hz mượt không tì vết, phím siêu âm AirTrigger gán nút bắn súng PUBG cực kỳ nhạy bén. Đèn LED AniMe Vision phía sau lưng tùy biến icon độc lạ cá tính.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-09-24 21:10:00'
    },

    // AirPods Pro 2
    {
      id: 'rev-11',
      product_id: 'prod-airpods-pro-2-usbc',
      user_id: 'usr-cust-01',
      rating: 5,
      title: 'Chống ồn tốt nhất hiện nay, đeo cực êm',
      content: 'Bật chống ồn một cái là mọi tiếng ồn còi xe ngoài đường hay tiếng quạt văn phòng biến mất hoàn toàn. Cổng sạc Type-C dùng chung cáp với iPhone 16 Pro Max tiện không tả được.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-05 08:30:00'
    },
    {
      id: 'rev-12',
      product_id: 'prod-airpods-pro-2-usbc',
      user_id: 'usr-cust-03',
      rating: 5,
      title: 'Âm bass dày, mic đàm thoại trong trẻo',
      content: 'Chạy xe máy ngoài đường nói chuyện người bên kia vẫn nghe rõ ràng không bị tiếng gió lọt vào. Shop hỗ trợ nhiệt tình, hàng chính hãng nguyên seal kích hoạt đủ 12 tháng.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-12 15:45:00'
    },

    // Apple Watch Ultra 2
    {
      id: 'rev-13',
      product_id: 'prod-apple-watch-ultra-2',
      user_id: 'usr-cust-02',
      rating: 5,
      title: 'Titan đen quá ngầu và nam tính',
      content: 'Bản titan đen mới này hoàn thiện tuyệt mỹ, viền DLC chống trầy tốt. Đi leo núi hay bơi lội pin dùng tẹt ga 3 ngày mới phải sạc lại. Rất hài lòng!',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-08 19:20:00'
    },

    // iPad Pro M4
    {
      id: 'rev-14',
      product_id: 'prod-ipad-pro-m4-11',
      user_id: 'usr-cust-04',
      rating: 5,
      title: 'Màn Tandem OLED đẹp nghẹt thở, máy siêu mỏng',
      content: 'Cầm lên tay mà không tin được máy lại mỏng nhẹ như thế. Màn hình màu đen sâu thẳm, độ sáng HDR rực rỡ. Chip M4 vẽ Procreate với dựng video 4K nhanh như chớp.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-15 13:10:00'
    },

    // Sony WH-1000XM5
    {
      id: 'rev-15',
      product_id: 'prod-sony-wh-1000xm5',
      user_id: 'usr-cust-05',
      rating: 5,
      title: 'Âm thanh Hi-Res đỉnh cao, đệm tai êm ru',
      content: 'Đeo làm việc cả ngày 8 tiếng không bị đau tai hay bí bách. Chống ồn đỉnh, nghe nhạc jazz hay vocal của Sony thì không tai nghe nào qua mặt được.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-20 16:35:00'
    },

    // Anker GaN 65W
    {
      id: 'rev-16',
      product_id: 'prod-anker-gan-65w',
      user_id: 'usr-cust-07',
      rating: 5,
      title: '1 củ sạc cho cả MacBook và iPhone',
      content: 'Đi công tác chỉ cần mang duy nhất củ sạc này là xong. Sạc cùng lúc điện thoại và máy tính xách tay máy chỉ hơi ấm nhẹ, không bị nóng ran như sạc thường. Hàng Anker chuẩn chỉ.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-22 11:00:00'
    },

    // Anker MagSafe 10000
    {
      id: 'rev-17',
      product_id: 'prod-anker-magsafe-10000',
      user_id: 'usr-cust-08',
      rating: 5,
      title: 'Nam châm hít chặt, sạc không dây 15W chuẩn Qi2',
      content: 'Hít vào mặt lưng iPhone 16 Pro Max cực chắc chắn không sợ rơi, sạc nhanh 15W có animation vòng tròn sạc. Màn hình báo đúng thời gian còn lại rất tiện.',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-25 14:40:00'
    },

    // Redmi Note 13 Pro+
    {
      id: 'rev-18',
      product_id: 'prod-redmi-note-13-pro-plus',
      user_id: 'usr-cust-06',
      rating: 5,
      title: 'Máy tầm trung mà có cả sạc 120W và kháng nước IP68',
      content: 'Phân khúc 8-9 triệu mà thiết kế màn cong viền mỏng dính như flagship, camera 200MP chụp nét căng. Sạc 120W cắm vào tắm rửa xong là 100% pin. Quá hài lòng với tầm giá!',
      images: null,
      is_verified_purchase: 1,
      status: 'APPROVED',
      created_at: '2026-10-28 17:25:00'
    }
  ];

  // ==========================================
  // ORDERS & ORDER ITEMS (15 Realistic Orders)
  // ==========================================
  const orders = [
    {
      id: 'ord-20261101-001',
      order_number: 'MD-20261101-001',
      user_id: 'usr-cust-01',
      recipient_name: 'Nguyễn Văn An',
      recipient_phone: '0912345678',
      shipping_province: 'Hà Nội',
      shipping_district: 'Cầu Giấy',
      shipping_ward: 'Dịch Vọng Hậu',
      shipping_address: 'Số 18 Phố Duy Tân, Tòa nhà FPT',
      payment_method: 'VNPAY',
      payment_status: 'PAID',
      status: 'DELIVERED',
      subtotal: 39980000,
      shipping_fee: 0,
      discount_amount: 500000,
      total: 39480000,
      notes: 'Giao giờ hành chính. Đã thanh toán qua VNPay thành công.',
      created_at: '2026-11-01 09:30:00'
    },
    {
      id: 'ord-20261102-002',
      order_number: 'MD-20261102-002',
      user_id: 'usr-cust-02',
      recipient_name: 'Trần Minh Trí',
      recipient_phone: '0938112233',
      shipping_province: 'Hồ Chí Minh',
      shipping_district: 'Quận 1',
      shipping_ward: 'Bến Nghé',
      shipping_address: '68 Nguyễn Huệ, Tòa nhà Bitexco',
      payment_method: 'MOMO',
      payment_status: 'PAID',
      status: 'DELIVERED',
      subtotal: 29990000,
      shipping_fee: 0,
      discount_amount: 1000000,
      total: 28990000,
      notes: 'Gọi trước khi đến 15 phút',
      created_at: '2026-11-02 14:15:00'
    },
    {
      id: 'ord-20261103-003',
      order_number: 'MD-20261103-003',
      user_id: 'usr-cust-03',
      recipient_name: 'Lê Hoàng Nam',
      recipient_phone: '0988776655',
      shipping_province: 'Đà Nẵng',
      shipping_district: 'Hải Châu',
      shipping_ward: 'Thạch Thang',
      shipping_address: '42 Bạch Đằng, P. Thạch Thang',
      payment_method: 'COD',
      payment_status: 'PAID',
      status: 'DELIVERED',
      subtotal: 27490000,
      shipping_fee: 30000,
      discount_amount: 0,
      total: 27520000,
      notes: 'Cho kiểm tra hàng trước khi nhận',
      created_at: '2026-11-03 10:00:00'
    },
    {
      id: 'ord-20261104-004',
      order_number: 'MD-20261104-004',
      user_id: 'usr-cust-04',
      recipient_name: 'Phạm Thu Hương',
      recipient_phone: '0977223344',
      shipping_province: 'Hồ Chí Minh',
      shipping_district: 'Quận 7',
      shipping_ward: 'Tân Phú',
      shipping_address: 'Căn A08-12 Chung cư Scenic Valley, Nguyễn Văn Linh',
      payment_method: 'BANK_TRANSFER',
      payment_status: 'PAID',
      status: 'DELIVERED',
      subtotal: 33480000,
      shipping_fee: 0,
      discount_amount: 500000,
      total: 32980000,
      notes: 'Giao lên tận phòng chung cư',
      created_at: '2026-11-04 16:20:00'
    },
    {
      id: 'ord-20261105-005',
      order_number: 'MD-20261105-005',
      user_id: 'usr-cust-05',
      recipient_name: 'Đặng Quốc Huy',
      recipient_phone: '0966554433',
      shipping_province: 'Hải Phòng',
      shipping_district: 'Lê Chân',
      shipping_ward: 'An Dương',
      shipping_address: 'Số 15/45 Tôn Đức Thắng',
      payment_method: 'COD',
      payment_status: 'UNPAID',
      status: 'SHIPPED',
      subtotal: 26990000,
      shipping_fee: 35000,
      discount_amount: 0,
      total: 27025000,
      notes: 'Đang vận chuyển hỏa tốc',
      created_at: '2026-11-05 11:45:00'
    },
    {
      id: 'ord-20261106-006',
      order_number: 'MD-20261106-006',
      user_id: 'usr-cust-06',
      recipient_name: 'Võ Kim Ngân',
      recipient_phone: '0919888999',
      shipping_province: 'Cần Thơ',
      shipping_district: 'Ninh Kiều',
      shipping_ward: 'Xuân Khánh',
      shipping_address: 'Số 120 Đường 30 Tháng 4',
      payment_method: 'VNPAY',
      payment_status: 'PAID',
      status: 'PROCESSING',
      subtotal: 8990000,
      shipping_fee: 0,
      discount_amount: 200000,
      total: 8790000,
      notes: 'Kho đang đóng gói sản phẩm',
      created_at: '2026-11-06 08:30:00'
    },
    {
      id: 'ord-20261107-007',
      order_number: 'MD-20261107-007',
      user_id: 'usr-cust-07',
      recipient_name: 'Hoàng Đức Thành',
      recipient_phone: '0903456789',
      shipping_province: 'Bình Dương',
      shipping_district: 'Thủ Dầu Một',
      shipping_ward: 'Phú Hòa',
      shipping_address: 'Đường D1, Khu dân cư Phú Hòa 1',
      payment_method: 'MOMO',
      payment_status: 'PAID',
      status: 'CONFIRMED',
      subtotal: 21990000,
      shipping_fee: 0,
      discount_amount: 500000,
      total: 21490000,
      notes: 'Đơn hàng đã được xác nhận',
      created_at: '2026-11-07 15:10:00'
    },
    {
      id: 'ord-20261108-008',
      order_number: 'MD-20261108-008',
      user_id: 'usr-cust-08',
      recipient_name: 'Bùi Mai Anh',
      recipient_phone: '0983123456',
      shipping_province: 'Hà Nội',
      shipping_district: 'Đống Đa',
      shipping_ward: 'Láng Hạ',
      shipping_address: 'Số 22 Ngõ 105 Láng Hạ',
      payment_method: 'COD',
      payment_status: 'UNPAID',
      status: 'PENDING',
      subtotal: 6880000,
      shipping_fee: 30000,
      discount_amount: 0,
      total: 6910000,
      notes: 'Chờ nhân viên gọi điện xác nhận',
      created_at: '2026-11-08 10:20:00'
    }
  ];

  const order_items = [
    // Order 1: iPhone 16 Pro Max + AirPods Pro 2
    {
      id: 'item-01-1',
      order_id: 'ord-20261101-001',
      product_id: 'prod-iphone-16-pro-max',
      variant_id: 'var-ip16pm-256-desert',
      product_name: 'iPhone 16 Pro Max 256GB VN/A',
      variant_name: 'Titan Sa Mạc 256GB',
      sku: 'IP16PM-256-DESERT',
      thumbnail: '/images/products/iphone-16-pro-max-desert.svg',
      price: 34490000,
      quantity: 1,
      total_price: 34490000
    },
    {
      id: 'item-01-2',
      order_id: 'ord-20261101-001',
      product_id: 'prod-airpods-pro-2-usbc',
      variant_id: 'var-app2-usbc-white',
      product_name: 'Tai nghe Bluetooth Apple AirPods Pro 2 MagSafe USB-C',
      variant_name: 'Trắng White (Hộp Sạc Type-C)',
      sku: 'APP2-USBC-WHITE',
      thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
      price: 5490000,
      quantity: 1,
      total_price: 5490000
    },

    // Order 2: Galaxy S24 Ultra
    {
      id: 'item-02-1',
      order_id: 'ord-20261102-002',
      product_id: 'prod-galaxy-s24-ultra',
      variant_id: 'var-s24u-256-gray',
      product_name: 'Samsung Galaxy S24 Ultra 5G 256GB',
      variant_name: 'Xám Titan 256GB',
      sku: 'S24U-256-GRAY',
      thumbnail: '/images/products/samsung-s24-ultra.svg',
      price: 29990000,
      quantity: 1,
      total_price: 29990000
    },

    // Order 3: Xiaomi 14 Ultra
    {
      id: 'item-03-1',
      order_id: 'ord-20261103-003',
      product_id: 'prod-xiaomi-14-ultra',
      variant_id: 'var-xm14u-512-white',
      product_name: 'Xiaomi 14 Ultra Leica 512GB',
      variant_name: 'Trắng Gốm 512GB',
      sku: 'XM14U-512-WHITE',
      thumbnail: '/images/products/xiaomi-14-ultra.svg',
      price: 27490000,
      quantity: 1,
      total_price: 27490000
    },

    // Order 4: iPad Pro M4 + Apple 20W Charger
    {
      id: 'item-04-1',
      order_id: 'ord-20261104-004',
      product_id: 'prod-ipad-pro-m4-11',
      variant_id: 'var-ipad-m4-11-black',
      product_name: 'iPad Pro 11 inch M4 Wi-Fi 256GB',
      variant_name: 'Đen Không Gian (Space Black) 256GB',
      sku: 'IPAD-M4-11-BLACK',
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
      price: 27990000,
      quantity: 1,
      total_price: 27990000
    },
    {
      id: 'item-04-2',
      order_id: 'ord-20261104-004',
      product_id: 'prod-airpods-pro-2-usbc',
      variant_id: 'var-app2-usbc-white',
      product_name: 'Tai nghe Bluetooth Apple AirPods Pro 2 MagSafe USB-C',
      variant_name: 'Trắng White (Hộp Sạc Type-C)',
      sku: 'APP2-USBC-WHITE',
      thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
      price: 5490000,
      quantity: 1,
      total_price: 5490000
    },

    // Order 5: ASUS ROG Phone 8 Pro
    {
      id: 'item-05-1',
      order_id: 'ord-20261105-005',
      product_id: 'prod-rog-phone-8-pro',
      variant_id: 'var-rog8p-512-black',
      product_name: 'ASUS ROG Phone 8 Pro 512GB',
      variant_name: 'Đen Phantom 512GB',
      sku: 'ROG8P-512-BLACK',
      thumbnail: '/images/products/rog-phone-8-pro.svg',
      price: 26990000,
      quantity: 1,
      total_price: 26990000
    },

    // Order 6: Redmi Note 13 Pro+
    {
      id: 'item-06-1',
      order_id: 'ord-20261106-006',
      product_id: 'prod-redmi-note-13-pro-plus',
      variant_id: 'var-rn13pp-256-purple',
      product_name: 'Xiaomi Redmi Note 13 Pro+ 5G 256GB',
      variant_name: 'Tím Cực Quang 256GB',
      sku: 'RN13PP-256-PURPLE',
      thumbnail: '/images/products/redmi-note-13-pro-plus.svg',
      price: 8990000,
      quantity: 1,
      total_price: 8990000
    },

    // Order 7: iPhone 16 128GB
    {
      id: 'item-07-1',
      order_id: 'ord-20261107-007',
      product_id: 'prod-iphone-16-128gb',
      variant_id: 'var-ip16-128-teal',
      product_name: 'iPhone 16 128GB VN/A',
      variant_name: 'Xanh Mòng Két 128GB',
      sku: 'IP16-128-TEAL',
      thumbnail: '/images/products/iphone-16-teal.svg',
      price: 21990000,
      quantity: 1,
      total_price: 21990000
    },

    // Order 8: AirPods 4 ANC + Anker 10000mAh
    {
      id: 'item-08-1',
      order_id: 'ord-20261108-008',
      product_id: 'prod-airpods-4-anc',
      variant_id: 'var-ap4-anc-white',
      product_name: 'Tai nghe Bluetooth Apple AirPods 4 Chống Ồn Chủ Động (ANC)',
      variant_name: 'Trắng White (Bản Chống Ồn ANC)',
      sku: 'AP4-ANC-WHITE',
      thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
      price: 4490000,
      quantity: 1,
      total_price: 4490000
    },
    {
      id: 'item-08-2',
      order_id: 'ord-20261108-008',
      product_id: 'prod-anker-magsafe-10000',
      variant_id: 'var-anker-mag10k-black',
      product_name: 'Pin sạc dự phòng không dây Từ Tính Anker MagGo Qi2 10.000mAh 15W',
      variant_name: 'Đen Vũ Trụ (Black)',
      sku: 'ANKER-MAG10K-BLACK',
      thumbnail: 'https://images.unsplash.com/photo-1609592807693-51829e217032?w=500&auto=format&fit=crop&q=80',
      price: 1390000,
      quantity: 1,
      total_price: 1390000
    }
  ];

  // ==========================================
  // CARTS & CART ITEMS
  // ==========================================
  const carts = [
    {
      id: 'cart-usr-01',
      user_id: 'usr-cust-01',
      session_token: 'sess-usr-01'
    },
    {
      id: 'cart-usr-02',
      user_id: 'usr-cust-02',
      session_token: 'sess-usr-02'
    }
  ];

  const cart_items = [
    {
      id: 'ci-01',
      cart_id: 'cart-usr-01',
      product_id: 'prod-apple-watch-ultra-2',
      variant_id: 'var-awu2-49-ocean-black',
      quantity: 1
    },
    {
      id: 'ci-02',
      cart_id: 'cart-usr-01',
      product_id: 'prod-anker-gan-65w',
      variant_id: 'var-anker-735-black',
      quantity: 2
    },
    {
      id: 'ci-03',
      cart_id: 'cart-usr-02',
      product_id: 'prod-sony-wh-1000xm5',
      variant_id: 'var-sony-wh5-black',
      quantity: 1
    }
  ];

  // ==========================================
  // COUPONS (8 Coupons)
  // ==========================================
  const coupons = [
    {
      id: 'coup-welcome-500',
      code: 'MDWELCOME',
      description: 'Giảm trực tiếp 500.000đ cho đơn hàng đầu tiên từ 10.000.000đ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 500000,
      min_order_value: 10000000,
      max_discount: 500000,
      usage_limit: 1000,
      used_count: 48,
      start_date: '2026-01-01 00:00:00',
      end_date: '2027-12-31 23:59:59',
      is_active: 1
    },
    {
      id: 'coup-flagship-10',
      code: 'FLAGSHIP10',
      description: 'Giảm 10% tối đa 1.000.000đ cho dòng Flagship từ 20.000.000đ',
      discount_type: 'PERCENT',
      discount_value: 10,
      min_order_value: 20000000,
      max_discount: 1000000,
      usage_limit: 500,
      used_count: 32,
      start_date: '2026-01-01 00:00:00',
      end_date: '2027-12-31 23:59:59',
      is_active: 1
    },
    {
      id: 'coup-ip16-mega',
      code: 'IPHONE16MEGA',
      description: 'Giảm 1.200.000đ khi mua iPhone 16 Series bất kỳ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 1200000,
      min_order_value: 20000000,
      max_discount: 1200000,
      usage_limit: 300,
      used_count: 65,
      start_date: '2026-09-01 00:00:00',
      end_date: '2027-06-30 23:59:59',
      is_active: 1
    },
    {
      id: 'coup-samfan',
      code: 'SAMFAN500',
      description: 'Đặc quyền SamFan giảm ngay 500.000đ cho đơn Galaxy từ 8.000.000đ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 500000,
      min_order_value: 8000000,
      max_discount: 500000,
      usage_limit: 500,
      used_count: 82,
      start_date: '2026-01-01 00:00:00',
      end_date: '2027-12-31 23:59:59',
      is_active: 1
    },
    {
      id: 'coup-freeship',
      code: 'FREESHIP50',
      description: 'Miễn phí vận chuyển toàn quốc giảm tối đa 50.000đ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 50000,
      min_order_value: 500000,
      max_discount: 50000,
      usage_limit: 2000,
      used_count: 340,
      start_date: '2026-01-01 00:00:00',
      end_date: '2027-12-31 23:59:59',
      is_active: 1
    },
    {
      id: 'coup-accessory-15',
      code: 'ACCESSORY15',
      description: 'Giảm 15% khi mua phụ kiện củ sạc, cáp sạc, pin dự phòng',
      discount_type: 'PERCENT',
      discount_value: 15,
      min_order_value: 400000,
      max_discount: 300000,
      usage_limit: 1000,
      used_count: 145,
      start_date: '2026-01-01 00:00:00',
      end_date: '2027-12-31 23:59:59',
      is_active: 1
    },
    {
      id: 'coup-tet2026',
      code: 'TET2026',
      description: 'Lì xì chào năm mới giảm 888.000đ cho đơn từ 15.000.000đ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 888000,
      min_order_value: 15000000,
      max_discount: 888000,
      usage_limit: 888,
      used_count: 120,
      start_date: '2026-01-01 00:00:00',
      end_date: '2027-03-31 23:59:59',
      is_active: 1
    },
    {
      id: 'coup-vipmember',
      code: 'MDVIPMEMBER',
      description: 'Ưu đãi thành viên VIP MD Member giảm 5% không giới hạn',
      discount_type: 'PERCENT',
      discount_value: 5,
      min_order_value: 5000000,
      max_discount: 2000000,
      usage_limit: 500,
      used_count: 90,
      start_date: '2026-01-01 00:00:00',
      end_date: '2027-12-31 23:59:59',
      is_active: 1
    }
  ];

  // ==========================================
  // BANNERS (6 Promos)
  // ==========================================
  const banners = [
    {
      id: 'ban-hero-01',
      title: 'iPhone 16 Pro Max - Titan Sa Mạc',
      subtitle: 'Sức mạnh chip Apple A18 Pro 3nm cùng nút Camera Control',
      image_url: '/images/products/iphone-16-pro-max-desert.svg',
      link_url: '/products/iphone-16-pro-max-256gb',
      position: 'hero_slider',
      sort_order: 1,
      is_active: 1
    },
    {
      id: 'ban-hero-02',
      title: 'Samsung Galaxy S24 Ultra - Quyền Năng AI',
      subtitle: 'Trải nghiệm kỷ nguyên trí tuệ nhân tạo Galaxy AI cùng Camera 200MP',
      image_url: '/images/products/samsung-s24-ultra.svg',
      link_url: '/products/samsung-galaxy-s24-ultra-5g',
      position: 'hero_slider',
      sort_order: 2,
      is_active: 1
    },
    {
      id: 'ban-hero-03',
      title: 'Xiaomi 14 Ultra - Kiệt Tác Leica 1-Inch',
      subtitle: 'Hệ thống 4 camera 50MP Leica quang học và sạc siêu tốc 90W',
      image_url: '/images/products/xiaomi-14-ultra.svg',
      link_url: '/products/xiaomi-14-ultra-leica-512gb',
      position: 'hero_slider',
      sort_order: 3,
      is_active: 1
    },
    {
      id: 'ban-hero-04',
      title: 'Galaxy Z Fold6 - Mở Rộng Thế Giới',
      subtitle: 'Bản lề kép siêu mỏng nhẹ, tối ưu đa nhiệm Galaxy AI màn hình lớn 7.6 inch',
      image_url: '/images/products/samsung-z-fold6.svg',
      link_url: '/products/samsung-galaxy-z-fold6-5g-256gb',
      position: 'hero_slider',
      sort_order: 4,
      is_active: 1
    },
    {
      id: 'ban-hero-05',
      title: 'ASUS ROG Phone 8 Pro - Quái Thú Gaming',
      subtitle: 'Màn hình AMOLED 165Hz, Snapdragon 8 Gen 3 và phím siêu âm AirTrigger',
      image_url: '/images/products/rog-phone-8-pro.svg',
      link_url: '/products/asus-rog-phone-8-pro-512gb',
      position: 'hero_slider',
      sort_order: 5,
      is_active: 1
    },
    {
      id: 'ban-promo-01',
      title: 'Hội Viên MD Member - Tích Điểm Đổi Quà',
      subtitle: 'Giảm thêm đến 5% trên mọi hóa đơn và voucher sinh nhật cực giá trị',
      image_url: '/images/banners/banner-1.jpg',
      link_url: '/member',
      position: 'sub_banner',
      sort_order: 6,
      is_active: 1
    }
  ];

  console.log(`Summary of data to be seeded:`);
  console.log(`- Categories: ${categories.length}`);
  console.log(`- Brands: ${brands.length}`);
  console.log(`- Users: ${users.length}`);
  console.log(`- User Addresses: ${user_addresses.length}`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Product Variants: ${variants.length}`);
  console.log(`- Product Images: ${product_images.length}`);
  console.log(`- Reviews: ${reviews.length}`);
  console.log(`- Orders: ${orders.length}`);
  console.log(`- Order Items: ${order_items.length}`);
  console.log(`- Carts: ${carts.length}`);
  console.log(`- Cart Items: ${cart_items.length}`);
  console.log(`- Coupons: ${coupons.length}`);
  console.log(`- Banners: ${banners.length}`);

  // ==========================================
  // 2. EXECUTE DIRECT INSERTS INTO DATABASE
  // ==========================================
  console.log('\nDisabling foreign key checks and clearing old data...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');

  const clearTables = [
    'reviews', 'order_items', 'orders', 'cart_items', 'carts',
    'product_variants', 'product_images', 'products', 'brands',
    'categories', 'user_addresses', 'coupons', 'banners', 'users'
  ];
  for (const tbl of clearTables) {
    await conn.query(`TRUNCATE TABLE \`${tbl}\``);
  }
  console.log('Tables truncated cleanly.');

  // Helper for batch insert
  async function batchInsert(tableName, items) {
    if (!items || items.length === 0) return;
    const keys = Object.keys(items[0]);
    const columns = keys.map(k => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;

    for (const item of items) {
      const values = keys.map(k => item[k]);
      await conn.query(sql, values);
    }
    console.log(`✔ Inserted ${items.length} rows into \`${tableName}\``);
  }

  console.log('\nInserting new dataset directly into MySQL (Navicat)...');
  await batchInsert('categories', categories);
  await batchInsert('brands', brands);
  await batchInsert('users', users);
  await batchInsert('user_addresses', user_addresses);
  await batchInsert('products', products);
  await batchInsert('product_variants', variants);
  await batchInsert('product_images', product_images);
  await batchInsert('reviews', reviews);
  await batchInsert('orders', orders);
  await batchInsert('order_items', order_items);
  await batchInsert('carts', carts);
  await batchInsert('cart_items', cart_items);
  await batchInsert('coupons', coupons);
  await batchInsert('banners', banners);

  // Re-enable foreign key checks
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✔ Foreign key checks re-enabled.');

  // ==========================================
  // 3. GENERATE COMPLETE SQL EXPORT FILE
  // ==========================================
  console.log('\nGenerating complete SQL export file...');

  function escapeSqlVal(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'boolean') return val ? '1' : '0';
    // String escaping
    const str = String(val)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n');
    return `'${str}'`;
  }

  function tableToSql(tableName, items) {
    if (!items || items.length === 0) return '';
    const keys = Object.keys(items[0]);
    const cols = keys.map(k => `\`${k}\``).join(', ');
    
    let res = `-- Data for table \`${tableName}\` (${items.length} rows)\n`;
    res += `INSERT INTO \`${tableName}\` (${cols}) VALUES\n`;
    const rowsSql = items.map(item => {
      const vals = keys.map(k => escapeSqlVal(item[k])).join(', ');
      return `  (${vals})`;
    });
    res += rowsSql.join(',\n') + ';\n\n';
    return res;
  }

  let sqlContent = `-- ============================================================\n`;
  sqlContent += `-- DỰ ÁN: MD MOBILE - COMPLETE PRODUCTION SEED DATA\n`;
  sqlContent += `-- HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU: MySQL 8.0+ / MariaDB\n`;
  sqlContent += `-- XUẤT BỞI: Antigravity AI Assistant\n`;
  sqlContent += `-- DÙNG TRỰC TIẾP TRONG NAVICAT HOẶC MYSQL CLI\n`;
  sqlContent += `-- TỔNG SẢN PHẨM: ${products.length} SP | BIẾN THỂ: ${variants.length} | ẢNH: ${product_images.length}\n`;
  sqlContent += `-- ============================================================\n\n`;
  sqlContent += `CREATE DATABASE IF NOT EXISTS \`md_mobile\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
  sqlContent += `USE \`md_mobile\`;\n\n`;
  sqlContent += `SET NAMES utf8mb4;\n`;
  sqlContent += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  // Read schema definition from schema.sql up to line 337 (before the sample insert statements)
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaRaw = fs.readFileSync(schemaPath, 'utf8');
  const ddlPart = schemaRaw.split('-- DỮ LIỆU MẪU KHỞI TẠO CHÍNH THỨC')[0];
  sqlContent += ddlPart;

  sqlContent += `-- ============================================================\n`;
  sqlContent += `-- DỮ LIỆU MẪU ĐẦY ĐỦ VÀ PHONG PHÚ (COMPREHENSIVE SEED DATA)\n`;
  sqlContent += `-- ============================================================\n\n`;

  sqlContent += tableToSql('categories', categories);
  sqlContent += tableToSql('brands', brands);
  sqlContent += tableToSql('users', users);
  sqlContent += tableToSql('user_addresses', user_addresses);
  sqlContent += tableToSql('products', products);
  sqlContent += tableToSql('product_variants', variants);
  sqlContent += tableToSql('product_images', product_images);
  sqlContent += tableToSql('reviews', reviews);
  sqlContent += tableToSql('orders', orders);
  sqlContent += tableToSql('order_items', order_items);
  sqlContent += tableToSql('carts', carts);
  sqlContent += tableToSql('cart_items', cart_items);
  sqlContent += tableToSql('coupons', coupons);
  sqlContent += tableToSql('banners', banners);

  sqlContent += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  sqlContent += `-- ========================== XONG ============================\n`;

  const outputBackendSql = path.resolve(__dirname, 'md_mobile_full_data.sql');
  const outputRootSql = path.resolve(__dirname, '../../md_mobile_full_data.sql');

  fs.writeFileSync(outputBackendSql, sqlContent, 'utf8');
  fs.writeFileSync(outputRootSql, sqlContent, 'utf8');

  console.log(`✔ SQL export generated successfully at:`);
  console.log(`  - ${outputBackendSql}`);
  console.log(`  - ${outputRootSql}`);

  // Print final database stats
  console.log('\n--- VERIFYING FINAL ROW COUNTS IN NAVICAT / MYSQL ---');
  for (const tbl of clearTables) {
    const [res] = await conn.query(`SELECT count(*) as count FROM \`${tbl}\``);
    console.log(`- ${tbl.padEnd(18)} : ${res[0].count} rows`);
  }

  await conn.end();
  console.log('\nALL DONE SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
