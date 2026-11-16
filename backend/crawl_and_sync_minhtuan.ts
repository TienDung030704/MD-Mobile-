import prisma from './src/config/prisma';
import fs from 'fs';
import path from 'path';

interface RawProduct {
  name: string;
  slug: string;
  url: string;
  sku: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  thumbnail: string;
  brand: string;
  categoryId: string;
}

const TARGET_URLS = [
  // 1. Điện thoại
  { url: 'https://minhtuanmobile.com/dien-thoai/', catId: 'cat-smartphones', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/dien-thoai/iphone/', catId: 'cat-smartphones', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/dien-thoai/samsung/', catId: 'cat-smartphones', brand: 'samsung' },
  { url: 'https://minhtuanmobile.com/dien-thoai/xiaomi/', catId: 'cat-smartphones', brand: 'xiaomi' },
  { url: 'https://minhtuanmobile.com/dien-thoai/oppo/', catId: 'cat-smartphones', brand: 'oppo' },
  { url: 'https://minhtuanmobile.com/dien-thoai/honor/', catId: 'cat-smartphones', brand: 'honor' },
  { url: 'https://minhtuanmobile.com/dien-thoai/realme/', catId: 'cat-smartphones', brand: 'realme' },

  // 2. iPad
  { url: 'https://minhtuanmobile.com/may-tinh-bang/ipad/', catId: 'cat-tablets', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/may-tinh-bang/ipad/ipad-pro/', catId: 'cat-tablets', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/may-tinh-bang/ipad/ipad-air/', catId: 'cat-tablets', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/may-tinh-bang/ipad/ipad-mini/', catId: 'cat-tablets', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/may-tinh-bang/ipad-mini-7/', catId: 'cat-tablets', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/may-tinh-bang/samsung/', catId: 'cat-tablets', brand: 'samsung' },

  // 3. Apple Watch / Smartwatch
  { url: 'https://minhtuanmobile.com/dong-ho-thong-minh/apple-watch/', catId: 'cat-smartwatches', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/dong-ho-thong-minh/apple-watch/series-12/', catId: 'cat-smartwatches', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/dong-ho-thong-minh/apple-watch/series-11/', catId: 'cat-smartwatches', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/dong-ho-thong-minh/apple-watch/ultra/', catId: 'cat-smartwatches', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/dong-ho-thong-minh/apple-watch/se/', catId: 'cat-smartwatches', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/dong-ho-thong-minh/galaxy-watch/', catId: 'cat-smartwatches', brand: 'samsung' },
  { url: 'https://minhtuanmobile.com/dong-ho-thong-minh/garmin/', catId: 'cat-smartwatches', brand: 'garmin' },

  // 4. Củ sạc & Phụ kiện sạc
  { url: 'https://minhtuanmobile.com/phu-kien/di-dong/adapter-sac/', catId: 'cat-accessories', brand: 'anker' },
  { url: 'https://minhtuanmobile.com/phu-kien/di-dong/adapter-sac/apple/', catId: 'cat-accessories', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/phu-kien/di-dong/adapter-sac/?brand=belkin', catId: 'cat-accessories', brand: 'belkin' },
  { url: 'https://minhtuanmobile.com/phu-kien/di-dong/adapter-sac/?brand=mophie', catId: 'cat-accessories', brand: 'mophie' },
  { url: 'https://minhtuanmobile.com/phu-kien/di-dong/adapter-sac/?brand=anker', catId: 'cat-accessories', brand: 'anker' },
  { url: 'https://minhtuanmobile.com/phu-kien/di-dong/adapter-sac/?brand=hyper', catId: 'cat-accessories', brand: 'hyper' },
  { url: 'https://minhtuanmobile.com/phu-kien/di-dong/adapter-sac/?brand=innostyle', catId: 'cat-accessories', brand: 'innostyle' },

  // 5. MacBook & Máy tính Apple
  { url: 'https://minhtuanmobile.com/laptop/mac/', catId: 'cat-laptops', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/laptop/mac/macbook-pro/', catId: 'cat-laptops', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/laptop/mac/macbook-air/', catId: 'cat-laptops', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/laptop/mac/macbook-neo/', catId: 'cat-laptops', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/laptop/mac/imac/', catId: 'cat-laptops', brand: 'apple' },
  { url: 'https://minhtuanmobile.com/laptop/mac/mini/', catId: 'cat-laptops', brand: 'apple' }
];

const BRANDS_META: Record<string, { name: string; logoUrl: string; description: string }> = {
  apple: {
    name: 'Apple',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    description: 'Thương hiệu công nghệ hàng đầu thế giới với iPhone, iPad, MacBook và Apple Watch.'
  },
  samsung: {
    name: 'Samsung',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    description: 'Tập đoàn công nghệ dẫn đầu thế giới với Galaxy S, Galaxy Z Fold/Flip, Galaxy Watch và Galaxy AI.'
  },
  xiaomi: {
    name: 'Xiaomi',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
    description: 'Tiên phong camera quang học Leica, sạc siêu tốc HyperCharge và hệ sinh thái thông minh.'
  },
  oppo: {
    name: 'OPPO',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg',
    description: 'Chuyên gia nhiếp ảnh chân dung Hasselblad và sạc nhanh SuperVOOC.'
  },
  honor: {
    name: 'Honor',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Honor_Logo.svg',
    description: 'Thiết bị di động thông minh đột phá với màn hình bảo vệ mắt đỉnh cao.'
  },
  realme: {
    name: 'Realme',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Realme_logo.svg',
    description: 'Thương hiệu điện thoại trẻ trung, hiệu năng vượt trội và sạc siêu nhanh.'
  },
  garmin: {
    name: 'Garmin',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Garmin_logo.svg',
    description: 'Đồng hồ thông minh thể thao chuyên nghiệp và định vị GPS số 1 thế giới.'
  },
  anker: {
    name: 'Anker',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Anker_logo.svg',
    description: 'Thương hiệu phụ kiện củ sạc, cáp sạc GaN và pin dự phòng số 1 toàn cầu.'
  },
  belkin: {
    name: 'Belkin',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Belkin_logo.svg',
    description: 'Đối tác phụ kiện hàng đầu của Apple, tiêu chuẩn chất lượng và an toàn chuẩn quốc tế.'
  },
  mophie: {
    name: 'Mophie',
    logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-mophie-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-2673841.png',
    description: 'Phụ kiện sạc cao cấp phân phối độc quyền tại Apple Store trên toàn cầu.'
  },
  innostyle: {
    name: 'Innostyle',
    logoUrl: 'https://innostyletech.com/wp-content/uploads/2021/04/logo-innostyle.png',
    description: 'Phụ kiện công nghệ thiết kế từ Mỹ với vật liệu cao cấp và công nghệ sạc thông minh.'
  },
  hyper: {
    name: 'HyperDrive',
    logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-HyperDrive.png',
    description: 'Thương hiệu phụ kiện hub và sạc GaN siêu nhỏ gọn hàng đầu từ San Jose, California.'
  },
  aukey: {
    name: 'Aukey',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Aukey_logo.svg/1200px-Aukey_logo.svg.png',
    description: 'Thương hiệu phụ kiện sạc nhanh GaN, pin dự phòng và phụ kiện di động uy tín.'
  },
  baseus: {
    name: 'Baseus',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Baseus_logo.svg',
    description: 'Phụ kiện công nghệ thông minh, tiện ích với thiết kế hiện đại và giá thành tối ưu.'
  }
};

function parsePrice(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

function parseProductsFromHtml(html: string, catId: string, defaultBrand: string): RawProduct[] {
  const products: RawProduct[] = [];
  const cardRegex = /<div\s+class="probox\s+([^"]*)"([^>]*)>([\s\S]*?)(?=<div\s+class="probox\s+|$)/gi;
  let match: RegExpExecArray | null;

  while ((match = cardRegex.exec(html)) !== null) {
    const classAttr = match[1];
    const restAttr = match[2];
    const content = match[3];

    const skuMatch = restAttr.match(/data-product-sku="([^"]*)"/i) || content.match(/data-product-sku="([^"]*)"/i);
    const sku = skuMatch ? skuMatch[1].trim() : '';

    const linkMatch = content.match(/<a\s+href="([^"]+)"\s+class="box"/i) || content.match(/<a\s+href="([^"]+)"/i);
    if (!linkMatch) continue;
    const link = linkMatch[1];
    if (link.includes('/tin-tuc/') || link.includes('/cart/')) continue;

    const imgMatch = content.match(/<img[^>]+(?:src|data-src)="([^"]+)"[^>]+alt="([^"]*)"/i) ||
                     content.match(/<img[^>]+alt="([^"]*)"[^>]+(?:src|data-src)="([^"]+)"/i);
    let imageUrl = '';
    let altTitle = '';
    if (imgMatch) {
      if (imgMatch[1].startsWith('http')) {
        imageUrl = imgMatch[1];
        altTitle = imgMatch[2];
      } else {
        altTitle = imgMatch[1];
        imageUrl = imgMatch[2];
      }
    }

    const titleMatch = content.match(/<h3\s+class="probox__title"[^>]*>([\s\S]*?)<\/h3>/i);
    let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : altTitle.trim();
    if (!title) continue;

    const priceMatch = content.match(/<b\s+class="price">([\s\S]*?)<\/b>/i);
    const priceStr = priceMatch ? priceMatch[1].trim() : '';
    const price = parsePrice(priceStr);

    const origPriceMatch = content.match(/<del[^>]*>([\s\S]*?)<\/del>/i) ||
                           content.match(/class="[^"]*gianiemyet[^"]*"[^>]*>([\s\S]*?)<\//i);
    const origPriceStr = origPriceMatch ? origPriceMatch[1].trim() : '';
    let originalPrice = parsePrice(origPriceStr);
    if (!originalPrice || originalPrice < price) {
      originalPrice = price > 0 ? Math.round(price * 1.15) : 0;
    }

    let discount = 0;
    const discountMatch = content.match(/class="[^"]*percent_tag[^"]*"[^>]*>-?(\d+)%?/i) ||
                          content.match(/-(\d+)%/);
    if (discountMatch) {
      discount = parseInt(discountMatch[1], 10);
    } else if (originalPrice > price && originalPrice > 0) {
      discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    let brand = defaultBrand;
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('samsung')) brand = 'samsung';
    else if (lowerTitle.includes('xiaomi') || lowerTitle.includes('redmi') || lowerTitle.includes('poco')) brand = 'xiaomi';
    else if (lowerTitle.includes('oppo')) brand = 'oppo';
    else if (lowerTitle.includes('honor')) brand = 'honor';
    else if (lowerTitle.includes('realme')) brand = 'realme';
    else if (lowerTitle.includes('garmin')) brand = 'garmin';
    else if (lowerTitle.includes('belkin')) brand = 'belkin';
    else if (lowerTitle.includes('mophie')) brand = 'mophie';
    else if (lowerTitle.includes('anker')) brand = 'anker';
    else if (lowerTitle.includes('innostyle')) brand = 'innostyle';
    else if (lowerTitle.includes('hyper')) brand = 'hyper';
    else if (lowerTitle.includes('aukey')) brand = 'aukey';
    else if (lowerTitle.includes('baseus')) brand = 'baseus';
    else if (lowerTitle.includes('apple') || lowerTitle.includes('iphone') || lowerTitle.includes('ipad') || lowerTitle.includes('macbook')) brand = 'apple';

    const slugParts = link.replace(/\/$/, '').split('/');
    const slug = slugParts[slugParts.length - 1];

    products.push({
      name: title,
      slug: slug,
      url: link,
      sku: sku || slug,
      price: price || 990000,
      originalPrice: originalPrice || Math.round((price || 990000) * 1.12),
      discountPercentage: discount || 10,
      thumbnail: imageUrl || 'https://minhtuanmobile.com/assets/front/img/default-400_400.jpg',
      brand: brand,
      categoryId: catId
    });
  }
  return products;
}

function extractStorage(title: string): string {
  const m = title.match(/(\d+\s*(?:GB|TB|mb))/i);
  return m ? m[1].toUpperCase().replace(/\s+/, '') : '';
}

function extractColor(title: string): string {
  const colors = [
    'Titan Sa Mạc', 'Titan Tự Nhiên', 'Titan Đen', 'Titan Trắng',
    'Vàng Sa Mạc', 'Xanh Lưu Ly', 'Xanh Mòng Két', 'Xanh Dương', 'Xanh Lá',
    'Hồng', 'Tím', 'Bạc', 'Xám', 'Đen', 'Trắng', 'Đỏ',
    'Starlight', 'Midnight', 'Space Gray', 'Silver', 'Gold'
  ];
  for (const c of colors) {
    if (title.toLowerCase().includes(c.toLowerCase())) return c;
  }
  return 'Tiêu Chuẩn';
}

function generateSpecs(product: RawProduct): Record<string, string> {
  const brandName = BRANDS_META[product.brand]?.name || product.brand.toUpperCase();
  const storage = extractStorage(product.name);
  const color = extractColor(product.name);

  if (product.categoryId === 'cat-smartphones') {
    return {
      'Thương hiệu': brandName,
      'Bộ nhớ trong': storage || '256GB',
      'Màu sắc': color,
      'Màn hình': product.name.includes('Pro Max') || product.name.includes('Ultra') ? '6.9 inch Super Retina XDR OLED 120Hz' : '6.3 inch OLED 120Hz',
      'Chipset': product.brand === 'apple' ? 'Apple A18 Pro Bionic (3nm)' : 'Snapdragon 8 Elite / Dimensity 9400',
      'RAM': product.name.includes('Pro') ? '8GB' : '12GB',
      'Camera': product.brand === 'apple' ? 'Chính 48MP + Góc siêu rộng 48MP + Tele 5x 12MP' : '200MP + 50MP + 50MP OIS',
      'Pin & Sạc': 'Hỗ trợ sạc nhanh có dây & Không dây MagSafe/Qi2',
      'Hệ điều hành': product.brand === 'apple' ? 'iOS 18 (Cập nhật lâu dài)' : 'Android 15 / One UI 7.0',
      'Bảo hành': '12 tháng chính hãng Minh Tuấn Mobile',
      'Xuất xứ': 'Chính hãng phân phối thị trường Việt Nam (VN/A)'
    };
  }

  if (product.categoryId === 'cat-tablets') {
    return {
      'Thương hiệu': brandName,
      'Màn hình': product.name.includes('13') ? '13.0 inch Ultra Retina Tandem OLED' : '11.0 inch Liquid Retina IPS / OLED',
      'Bộ nhớ': storage || '128GB',
      'Màu sắc': color,
      'Vi xử lý': product.name.includes('Pro') ? 'Apple M4 Chip (Neural Engine siêu mạnh)' : (product.name.includes('Air') ? 'Apple M2 / M3' : 'Apple A16 Bionic'),
      'Kết nối': product.name.includes('5G') || product.name.includes('Cellular') ? '5G LTE + Wi-Fi 6E/7' : 'Wi-Fi 6E/7 siêu tốc',
      'Bảo hành': '12 tháng chính hãng Apple Việt Nam',
      'Xuất xứ': 'Chính hãng Apple VN/A'
    };
  }

  if (product.categoryId === 'cat-laptops') {
    return {
      'Thương hiệu': 'Apple',
      'CPU': product.name.includes('M5') ? 'Apple M5 (10-Core CPU)' : (product.name.includes('M6') ? 'Apple M6 Max 18-Core' : 'Apple Silicon Ultra High Speed'),
      'GPU': 'Tích hợp Ray Tracing phần cứng và Metal 3',
      'RAM': product.name.includes('16GB') ? '16GB Unified Memory' : (product.name.includes('24GB') ? '24GB Unified Memory' : '8GB Unified Memory'),
      'Ổ cứng SSD': storage || '512GB SSD NVMe tốc độ cao',
      'Màn hình': product.name.includes('15') || product.name.includes('16') ? '15.3 - 16.2 inch Liquid Retina XDR 120Hz ProMotion' : '13.6 - 14.2 inch Liquid Retina sắc nét',
      'Trọng lượng': '1.24 kg - Siêu mỏng nhẹ sang trọng',
      'Bảo hành': '12 tháng chính hãng Apple'
    };
  }

  if (product.categoryId === 'cat-smartwatches') {
    return {
      'Thương hiệu': brandName,
      'Kích thước': product.name.includes('49mm') ? '49mm (Phiên bản Ultra)' : (product.name.includes('46mm') ? '46mm' : (product.name.includes('42mm') ? '42mm' : '40mm / 44mm')),
      'Chất liệu viền': product.name.includes('Titan') ? 'Titanium siêu bền hàng không' : 'Nhôm tái chế 100% cao cấp',
      'Chống nước': product.name.includes('Ultra') ? '100m (Lặn chuyên nghiệp EN13319)' : '50m (Bơi lội)',
      'Thời lượng pin': product.name.includes('Ultra') ? 'Lên đến 72 giờ chế độ nguồn điện thấp' : 'Lên đến 18-36 giờ',
      'Tính năng sức khỏe': 'Đo điện tâm đồ ECG, SpO2, theo dõi giấc ngủ, phát hiện té ngã & tai nạn giao thông',
      'Bảo hành': '12 tháng chính hãng'
    };
  }

  // Accessories / Củ sạc
  return {
    'Thương hiệu': brandName,
    'Công suất': product.name.match(/(\d+W)/i)?.[1] || '30W GaN Fast Charging',
    'Cổng kết nối': product.name.includes('2C') || product.name.includes('3 cổng') ? 'USB-C x2 + USB-A x1' : 'Type-C Power Delivery (PD)',
    'Công nghệ': 'GaN (Gallium Nitride) kiểm soát nhiệt độ an toàn MultiProtect',
    'Tương thích': 'iPhone 16/15/14/13, iPad, MacBook Air, Samsung Galaxy và thiết bị Type-C',
    'Bảo hành': '18 - 24 tháng chính hãng 1 đổi 1'
  };
}

function generateDescription(product: RawProduct): string {
  const brandName = BRANDS_META[product.brand]?.name || product.brand.toUpperCase();
  return `
<div class="product-description-content">
  <h3>Tổng quan về ${product.name}</h3>
  <p><strong>${product.name}</strong> là sản phẩm công nghệ cao cấp chính hãng thuộc thương hiệu <strong>${brandName}</strong>, được phân phối trực tiếp tại hệ thống đại lý <strong>Minh Tuấn Mobile & MD Mobile</strong> với đầy đủ hóa đơn VAT và bảo hành chính hãng.</p>
  
  <h4>Đặc điểm nổi bật:</h4>
  <ul>
    <li><strong>Thiết kế đỉnh cao:</strong> Ngôn ngữ thiết kế hiện đại, hoàn thiện tỉ mỉ từng chi tiết với vật liệu cao cấp, mang đến vẻ ngoài sang trọng và độ bền vượt trội.</li>
    <li><strong>Hiệu năng dẫn đầu:</strong> Xử lý mượt mà mọi tác vụ từ làm việc chuyên nghiệp, học tập đến giải trí đa phương tiện đỉnh cao.</li>
    <li><strong>Chính sách hậu mãi số 1:</strong> Bảo hành chính hãng 12 - 24 tháng, hỗ trợ 1 đổi 1 trong 30 ngày đầu tiên nếu phát sinh lỗi từ nhà sản xuất.</li>
    <li><strong>Chương trình thu cũ đổi mới:</strong> Trợ giá thu cũ lên đời máy mới lên đến 88%, thủ tục nhanh gọn trong 15 phút.</li>
  </ul>

  <h4>Chính sách mua hàng & Ưu đãi tại MD Mobile:</h4>
  <ul>
    <li>Tặng gói bảo hành độc quyền Minh Tuấn Mobile & MD Mobile Care VIP.</li>
    <li>Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng và công ty tài chính, duyệt hồ sơ online nhanh chóng.</li>
    <li>Giao hàng hỏa tốc trong 1-2 giờ tại nội thành Hà Nội & TP. Hồ Chí Minh.</li>
  </ul>
</div>
`.trim();
}

async function main() {
  console.log('=== BẮT ĐẦU CÀO DỮ LIỆU TỪ MINHTUANMOBILE.COM ===');

  const uniqueProducts = new Map<string, RawProduct>();

  for (const target of TARGET_URLS) {
    try {
      console.log(`Đang cào dữ liệu: ${target.url}...`);
      const res = await fetch(target.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) {
        console.warn(`  [CẢNH BÁO] URL trả về mã lỗi: ${res.status}`);
        continue;
      }
      const html = await res.text();
      const items = parseProductsFromHtml(html, target.catId, target.brand);
      console.log(`  -> Tìm thấy ${items.length} sản phẩm.`);
      for (const item of items) {
        if (!uniqueProducts.has(item.slug)) {
          uniqueProducts.set(item.slug, item);
        }
      }
    } catch (e: any) {
      console.error(`  [LỖI] ${target.url}:`, e.message);
    }
  }

  const productList = Array.from(uniqueProducts.values());
  console.log(`\n=> TỔNG SỐ SẢN PHẨM CÀO ĐƯỢC: ${productList.length} sản phẩm duy nhất!`);

  // 1. Cập nhật và đảm bảo bảng Brands có đầy đủ thương hiệu
  console.log('\n--- 1. CẬP NHẬT BRANDS VÀO DATABASE ---');
  for (const [slug, meta] of Object.entries(BRANDS_META)) {
    const brandId = `brand-${slug}`;
    await prisma.brand.upsert({
      where: { slug: slug },
      update: {
        name: meta.name,
        logoUrl: meta.logoUrl,
        description: meta.description,
        isActive: true
      },
      create: {
        id: brandId,
        name: meta.name,
        slug: slug,
        logoUrl: meta.logoUrl,
        description: meta.description,
        isActive: true
      }
    });
  }
  console.log('-> Đã đồng bộ toàn bộ thương hiệu (Apple, Samsung, Xiaomi, Garmin, Anker, Belkin, Mophie, Innostyle...) thành công.');

  // 2. Xóa sạch dữ liệu sản phẩm cũ trong DB theo yêu cầu của User
  console.log('\n--- 2. XÓA SẠCH DỮ LIỆU CŨ TRONG DATABASE MD_MOBILE ---');
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
  await prisma.$executeRawUnsafe('DELETE FROM cart_items;');
  await prisma.$executeRawUnsafe('DELETE FROM order_items;');
  await prisma.$executeRawUnsafe('DELETE FROM reviews;');
  await prisma.$executeRawUnsafe('DELETE FROM product_variants;');
  await prisma.$executeRawUnsafe('DELETE FROM product_images;');
  await prisma.$executeRawUnsafe('DELETE FROM products;');
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('-> Đã làm sạch toàn bộ bảng products, variants, images, order_items, cart_items cũ.');

  // 3. Đẩy dữ liệu mới vào DB
  console.log('\n--- 3. ĐẨY DỮ LIỆU MỚI TỪ MINH TUẤN MOBILE VÀO MYSQL (NAVICAT) ---');
  let insertedCount = 0;
  let variantCount = 0;
  let imageCount = 0;

  const sqlStatements: string[] = [
    '-- SQL IMPORT DỮ LIỆU CÀO TỪ MINH TUẤN MOBILE CHO MD_MOBILE',
    'USE `md_mobile`;',
    'SET FOREIGN_KEY_CHECKS = 0;',
    'DELETE FROM `cart_items`;',
    'DELETE FROM `order_items`;',
    'DELETE FROM `reviews`;',
    'DELETE FROM `product_variants`;',
    'DELETE FROM `product_images`;',
    'DELETE FROM `products`;'
  ];

  for (let i = 0; i < productList.length; i++) {
    const p = productList[i];
    const productId = `prod-mt-${String(i + 1).padStart(4, '0')}`;
    const brandId = `brand-${p.brand}`;
    const specs = generateSpecs(p);
    const desc = generateDescription(p);

    const isFeatured = i % 7 === 0 || p.name.includes('16') || p.name.includes('17') || p.name.includes('M5');
    const isNewArrival = i % 4 === 0 || p.name.includes('2026') || p.name.includes('Neo') || p.name.includes('S26');
    const isBestSeller = i % 5 === 0 || p.name.includes('Pro Max') || p.name.includes('Air');

    const rating = (4.5 + Math.random() * 0.5).toFixed(1); // 4.5 - 5.0
    const reviewCount = Math.floor(15 + Math.random() * 120);
    const stockQuantity = Math.floor(20 + Math.random() * 80);

    // Lưu vào Prisma
    try {
      await prisma.product.create({
        data: {
          id: productId,
          name: p.name,
          slug: `${p.slug}-${String(i + 1)}`,
          brandId: brandId,
          categoryId: p.categoryId,
          price: p.price,
          originalPrice: p.originalPrice,
          discountPercentage: p.discountPercentage,
          thumbnail: p.thumbnail,
          description: desc,
          specifications: specs,
          rating: parseFloat(rating),
          reviewCount: reviewCount,
          inStock: true,
          stockQuantity: stockQuantity,
          isFeatured: isFeatured,
          isNewArrival: isNewArrival,
          isBestSeller: isBestSeller,
          status: 'PUBLISHED'
        }
      });
      insertedCount++;

      // Thêm ảnh sản phẩm
      const img1Id = `img-${productId}-1`;
      await prisma.productImage.create({
        data: {
          id: img1Id,
          productId: productId,
          imageUrl: p.thumbnail,
          displayOrder: 0
        }
      });
      imageCount++;

      // Thêm biến thể sản phẩm (Variants)
      const storage = extractStorage(p.name);
      const color = extractColor(p.name);

      const var1Id = `var-${productId}-1`;
      const var1Sku = `${p.sku || p.slug}-V1-${i + 1}`.slice(0, 95);
      await prisma.productVariant.create({
        data: {
          id: var1Id,
          productId: productId,
          name: storage ? `${color} - ${storage}` : `${color} - Tiêu Chuẩn`,
          sku: var1Sku,
          price: p.price,
          originalPrice: p.originalPrice,
          stock: Math.floor(stockQuantity * 0.6),
          color: color,
          storage: storage || 'Tiêu chuẩn',
          image: p.thumbnail
        }
      });
      variantCount++;

      // Nếu là smartphone hoặc laptop, thêm 1 biến thể nâng cấp dung lượng
      if (p.categoryId === 'cat-smartphones' || p.categoryId === 'cat-laptops') {
        const higherStorage = storage === '128GB' ? '256GB' : (storage === '256GB' ? '512GB' : '1TB');
        const var2Id = `var-${productId}-2`;
        const var2Sku = `${p.sku || p.slug}-V2-${i + 1}`.slice(0, 95);
        const higherPrice = Math.round(p.price * 1.15);
        const higherOrig = Math.round(p.originalPrice * 1.15);

        await prisma.productVariant.create({
          data: {
            id: var2Id,
            productId: productId,
            name: `${color} - ${higherStorage}`,
            sku: var2Sku,
            price: higherPrice,
            originalPrice: higherOrig,
            stock: Math.floor(stockQuantity * 0.4),
            color: color,
            storage: higherStorage,
            image: p.thumbnail
          }
        });
        variantCount++;
      }

      if ((i + 1) % 50 === 0 || i === productList.length - 1) {
        console.log(`  -> Đã chèn thành công ${insertedCount}/${productList.length} sản phẩm...`);
      }
    } catch (insertErr: any) {
      console.error(`  [Lỗi chèn SP ${p.name}]:`, insertErr.message);
    }
  }

  console.log('\n======================================================');
  console.log(`HOÀN TẤT ĐỒNG BỘ VÀO DATABASE THÀNH CÔNG:`);
  console.log(`- Tổng số sản phẩm đã chèn: ${insertedCount}`);
  console.log(`- Tổng số biến thể (variants): ${variantCount}`);
  console.log(`- Tổng số hình ảnh (images): ${imageCount}`);
  console.log('======================================================\n');

  // Kiểm tra lại số lượng trong DB thực tế
  const finalProductCount = await prisma.product.count();
  const finalVariantCount = await prisma.productVariant.count();
  const finalImageCount = await prisma.productImage.count();

  console.log(`DỮ LIỆU HIỆN CÓ TRONG MYSQL (MD_MOBILE):`);
  console.log(`- products: ${finalProductCount}`);
  console.log(`- product_variants: ${finalVariantCount}`);
  console.log(`- product_images: ${finalImageCount}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Lỗi nghiêm trọng:', e);
  await prisma.$disconnect();
  process.exit(1);
});
