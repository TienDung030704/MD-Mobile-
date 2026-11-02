# PROJECT_CONTEXT.md

> Tài liệu này được tạo để cung cấp context đầy đủ cho AI khi làm việc với project này.
> Đọc file này trước khi bắt đầu bất kỳ task nào.

---

## 1. Project Overview

- **Tên project:** `md-mobile` (MD Mobile)
- **Mô tả:** Website thương mại điện tử chuyên bán lẻ điện thoại di động chính hãng (iPhone, Samsung, Xiaomi,...), máy tính bảng và phụ kiện công nghệ cao cấp.
- **Mục tiêu:** Xây dựng nền tảng e-commerce hiện đại, chuẩn SEO, trải nghiệm mượt mà với phong cách Flagship Store, sẵn sàng tích hợp giỏ hàng, thanh toán trực tuyến và quản lý đơn hàng.
- **Ngôn ngữ chính:** TypeScript

---

## 2. Tech Stack

| Thành phần           | Công nghệ / Thư viện / Version                    |
| -------------------- | ------------------------------------------------- |
| Framework            | Next.js `16.4.2` (App Router)                     |
| Runtime              | React `19.3.0`                                    |
| Language             | TypeScript `^5` (strict mode)                     |
| Styling              | Tailwind CSS `^4` (via `@tailwindcss/turbopack`)  |
| Font                 | Plus Jakarta Sans, Inter, Space Grotesk           |
| Bundler (dev/build)  | Next.js build (`next build --webpack` / Turbopack)|
| Linting              | ESLint `^9` + `eslint-config-next`                |
| Package manager      | npm (có `package-lock.json`)                      |
| Icons & UI           | `lucide-react` `^1.66.0`, Radix UI primitives     |
| Animation & Slider   | `framer-motion` `^14.9.0`, `swiper` `^14.4.0`     |
| State Management     | `@reduxjs/toolkit` `^2.13.0`, `react-redux`       |
| Data Fetching / HTTP | `@tanstack/react-query` `^5.105.0`, `axios`       |
| Form & Validation    | `react-hook-form` `^7.91.0`, `zod` `^4.6.7`       |
| Database / ORM       | `prisma` `^8.0.0-rc.29`, `@prisma/client` `^7.10.1`, `mysql2` |
| Auth & Crypto        | `jsonwebtoken` `^9.0.3`, `bcryptjs` `^3.0.3`      |
| Utilities            | `dayjs`, `slugify`, `sharp`, `@number-flow/react` |

**Lưu ý quan trọng:** Next.js `16.4.2` và Prisma `7/8` có nhiều breaking changes so với các phiên bản cũ. Bắt buộc đọc tài liệu trong `node_modules` trước khi viết code.

---

## 3. Project Structure (Tách bạch Monorepo: Frontend + Backend)

```
d:\md-mobile\
├── frontend/                  # Next.js 16 + React 19 Frontend
│   ├── public/                # Static assets, SVG sản phẩm, banners
│   ├── src/                   # Mã nguồn Frontend Next.js
│   │   ├── app/               # Next.js App Router (page.tsx, layout, SEO)
│   │   ├── components/        # Reusable UI components (common, ui)
│   │   ├── constants/         # Hằng số cấu hình hệ thống
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility helpers (utils.ts)
│   │   ├── providers/         # React Context Providers
│   │   ├── services/          # API Client & data fetching (apiClient, productService)
│   │   └── types/             # TypeScript type definitions (Product, Cart, Api...)
│   ├── next.config.ts         # Next.js config (rewrites proxy /api -> backend port 5000)
│   ├── package.json           # Frontend dependencies & scripts
│   ├── tsconfig.json          # TypeScript config (alias @/* -> ./src/*)
│   └── .env.local             # Cấu hình API URL (http://localhost:5000)
│
├── backend/                   # Express.js + TypeScript Backend API Server (Port 5000)
│   ├── database/              # DDL MySQL 8.0+ (14 bảng, schema.sql, update_real_data.sql)
│   ├── prisma/                # Prisma schema & config
│   ├── src/
│   │   ├── config/            # Cấu hình kết nối MySQL pool (db.ts)
│   │   ├── controllers/       # Controller tiếp nhận request (product.controller.ts)
│   │   ├── routes/            # Khai báo Express router (/api/products...)
│   │   ├── services/          # Business logic & Database queries (product.service.ts)
│   │   ├── types/             # TypeScript interfaces cho API & Database rows
│   │   └── server.ts          # Express entry point (Port 5000, CORS, Logger)
│   ├── package.json           # Backend dependencies (express, cors, mysql2, zod, tsx)
│   ├── tsconfig.json          # TypeScript NodeNext configuration
│   └── .env                   # Biến môi trường Database MySQL, JWT, Port
│
├── package.json               # Root package.json điều phối chạy dev song song cả 2 app
└── README.md
```

**Nhận xét:** Dự án đã được tổ chức tối ưu thành 2 thư mục riêng biệt:
- `frontend/`: Phục vụ riêng cho bạn làm giao diện (Next.js, Tailwind, Swiper, Framer Motion).
- `backend/`: Phục vụ riêng cho bạn làm API & Database (Express.js, MySQL, Prisma).
- Chạy chung: Chỉ cần chạy `npm run dev` ở thư mục gốc là cả 2 cùng khởi chạy song song (BE port 5000, FE port 3000).

---

## 4. Architecture

- **Kiến trúc:** Next.js App Router (thư mục `src/app`).
- **Rendering & Data Flow:**
  - `src/app/page.tsx` là Client Component đảm nhiệm toàn bộ trải nghiệm tương tác động mượt mà (Swiper 3D, Flip Clock, Tab lọc sản phẩm, Modal định giá AI, Thanh so sánh cấu hình).
  - Tự động nạp dữ liệu thật từ cơ sở dữ liệu MySQL thông qua API Route `/api/products` (hoặc tầng DAL `src/lib/dal.ts`).
  - Toàn bộ mock data đã được loại bỏ 100%, sẵn sàng nhận dữ liệu thật từ database MySQL.
- **Frontend Design System:**
  - Root layout: `src/app/layout.tsx` — cấu hình 3 bộ font Google (`Plus Jakarta Sans`, `Inter`, `Space Grotesk`), metadata chuẩn SEO OpenGraph tiếng Việt, Custom Cursor và Toast Box.
  - Homepage: `src/app/page.tsx` — Tích hợp đầy đủ 12 khối tính năng:
    0. `LoadingScreen`: Màn hình khởi tạo hiệu ứng logo Flagship 3D.
    1. `AnnouncementBar`: Thanh thông báo chạy chữ vô hạn trên cùng.
    2. `Header`: Floating Glass Pill Header (tách riêng trong `src/components/common/header.tsx`).
    3. `HeroSlider`: Banner Swiper chính với hiệu ứng Fade & CTA.
    4. `BrandMarquee`: Dải thương hiệu ủy quyền chính thức cuộn vô hạn.
    5. `BentoSection`: Lưới 6 ô đặc quyền với hiệu ứng Spotlight 3D (`--mouse-x`, `--mouse-y`).
    6. `FlashSaleSection`: Đồng hồ đếm ngược Flip Clock (Giờ : Phút : Giây) và Carousel sản phẩm kéo.
    7. `FeaturedProductsSection`: Tab lọc trượt, thẻ 3D tilt, nút yêu thích và thêm giỏ hàng.
    8. `ScrollStorySection`: Bóc tách công nghệ phần cứng 4 bước 3D.
    9. `TradeInSection`: Banner Thu cũ đổi mới trợ giá 5 triệu + Modal định giá AI 30 giây.
    10. `NeedAccordionSection`: Accordion 4 nhu cầu mở rộng theo chiều ngang.
    11. `ReviewsSection`: Đánh giá khách hàng marquee 2 chiều + 3 bài viết Tạp chí công nghệ.
    12. `Footer`: Dark Luxury Footer (tách riêng trong `src/components/common/footer.tsx`).
    13. `FloatingCompareBar`: Thanh so sánh cấu hình nổi đáy màn hình (tối đa 3 máy).
  - Styling: Tailwind CSS v4 với `@theme` tokens, glassmorphism, glowing gradients và keyframe animations.
- **Database & Backend:**
  - Hệ quản trị CSDL: MySQL 8.0+.
  - Script tạo bảng: `database/schema.sql` (14 bảng, ràng buộc khóa ngoại, indexes và dữ liệu mẫu).
  - ORM: Prisma 7/8 với `prisma/schema.prisma` và `prisma.config.ts`.
  - API Routes: `/api/products` phục vụ dữ liệu cho trang chủ và các trang con.

---

## 5. Database

- **Database Engine:** MySQL 8.0+ / MariaDB 10.5+ (bảng mã `utf8mb4_unicode_ci`).
- **DDL Script:** [`database/schema.sql`](file:///d:/md-mobile/database/schema.sql) (hơn 390 dòng code tạo CSDL `md_mobile`, bảng và foreign keys).
- **Prisma ORM:** [`prisma/schema.prisma`](file:///d:/md-mobile/prisma/schema.prisma) đồng bộ 100% với DDL và cấu hình URL migrate qua [`prisma.config.ts`](file:///d:/md-mobile/prisma.config.ts).
- **Danh sách 14 bảng dữ liệu (Models):**
  1. `users`: Tài khoản khách hàng, nhân viên, quản trị viên (UUID, password băm, role, status).
  2. `user_addresses`: Sổ địa chỉ giao hàng của người dùng.
  3. `categories`: Danh mục sản phẩm (điện thoại, máy tính bảng, phụ kiện,...).
  4. `brands`: Thương hiệu sản phẩm (Apple, Samsung, Xiaomi, OPPO, Vivo, Realme, ASUS).
  5. `products`: Thông tin sản phẩm chính (tên, slug, mô tả, thông số kỹ thuật, status).
  6. `product_images`: Bộ sưu tập hình ảnh sản phẩm.
  7. `product_variants`: Biến thể sản phẩm (màu sắc, dung lượng RAM/ROM, giá bán, giá gốc, tồn kho, SKU).
  8. `carts`: Giỏ hàng người dùng.
  9. `cart_items`: Chi tiết sản phẩm trong giỏ hàng.
  10. `orders`: Đơn hàng (mã đơn, tổng tiền, phí ship, giảm giá, phương thức thanh toán, trạng thái đơn).
  11. `order_items`: Chi tiết từng mặt hàng trong đơn.
  12. `reviews`: Đánh giá, chấm sao và bình luận của khách hàng.
  13. `coupons`: Mã giảm giá, voucher khuyến mãi.
  14. `banners`: Banner quảng cáo, hero slides và flash sale.
- **Connection URL:** Đọc từ biến môi trường `DATABASE_URL` trong `.env` (ví dụ: `mysql://root:password@localhost:3306/md_mobile`).

---

## 6. Authentication & Authorization

- **Authentication:** Đã cài đặt thư viện mã hóa & token: `jsonwebtoken` (`^9.0.3`) và `bcryptjs` (`^3.0.3`) kèm `@types`.
- **Authorization:** Đã định nghĩa enum `UserRole` (`CUSTOMER`, `ADMIN`, `STAFF`) trong cả database SQL, Prisma schema và TypeScript types.
- **Session/Token management:** Đã định nghĩa key lưu trữ `STORAGE_KEYS.AUTH_TOKEN`.

---

## 7. Important Features

- Cấu trúc thư mục chuẩn thực tế doanh nghiệp với `src/`.
- Hệ thống UI components cơ bản: `Button`, `Input`, `Card`, `Badge`, `ToastBox`.
- Hệ thống Layout dùng chung: `Header` (tích hợp hotline, search bar có dropdown gợi ý, navigation có thanh gạch chân trượt, cart badge, toggle theme sáng/tối), `Footer` (chính sách, danh mục, form nhận voucher VIP, text outline khổng lồ `AETHERIA`).
- Trang chủ Flagship Store đơn nhất trong `src/app/page.tsx`:
  - Fullscreen Hero Slider với 3D Tilt xoay theo chuột, mô phỏng màn hình điện thoại OLED, neon halo rings, 3 thẻ thông số lơ lửng, odometer counter.
  - Bento Grid 6 ô đặc quyền với hiệu ứng vầng sáng chuột Spotlight 3D (`--mouse-x`, `--mouse-y`).
  - Flash Sale với đồng hồ đếm ngược Flip Clock (Giờ : Phút : Giây) và thanh tiến độ bán shimmer.
  - Danh mục sản phẩm nổi bật với tab lọc trượt, thẻ 3D tilt, nút thêm vào yêu thích và thêm giỏ hàng.
  - Bóc tách công nghệ 3D Scroll Story 4 bước.
  - Banner Thu cũ trợ giá 5 triệu + Modal định giá AI trực tiếp.
  - Accordion 4 nhu cầu mở rộng theo chiều ngang.
  - 2 hàng marquee đánh giá khách hàng chạy ngược chiều nhau + 3 thẻ tin tức công nghệ.
  - Thanh so sánh cấu hình nổi (Floating Compare Bar).
- Hooks tiện ích: `useDebounce`, `useLocalStorage` (chuẩn React 19 `useSyncExternalStore`), `useMediaQuery`.
- Xử lý lỗi & Trạng thái tải: `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`.
- Tối ưu hóa SEO: `robots.ts`, `sitemap.ts`, OpenGraph metadata.

---

## 8. Completed Features

- [x] Khởi tạo project Next.js 16 với App Router
- [x] Cấu hình TypeScript (strict mode) với alias `@/*` trỏ tới `./src/*`
- [x] Tích hợp Tailwind CSS v4 với Turbopack & Webpack build
- [x] Cấu hình ESLint (Next.js core-web-vitals + TypeScript rules)
- [x] Font system: Plus Jakarta Sans, Inter, Space Grotesk qua `next/font/google`
- [x] Tái cấu trúc chuẩn dự án thực tế với `src/` directory
- [x] Thiết lập hệ thống thư mục: `components/`, `constants/`, `hooks/`, `lib/`, `providers/`, `services/`, `types/`
- [x] Thêm các file convention của App Router: `error.tsx`, `global-error.tsx`, `loading.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`
- [x] Xây dựng trang chủ Flagship Store hoàn chỉnh cho MD Mobile
- [x] Tạo template biến môi trường `.env.example`
- [x] Cài đặt bộ dependencies cốt lõi vào `package.json`: UI/Icons (`lucide-react`, Radix UI, `framer-motion`, `swiper`), Forms (`react-hook-form`, `zod`), State/Data (`@reduxjs/toolkit`, `@tanstack/react-query`, `axios`), Auth (`jsonwebtoken`, `bcryptjs`), ORM (`prisma`, `mysql2`)
- [x] Xây dựng cơ sở dữ liệu MySQL chuẩn: `database/schema.sql` (14 bảng quan hệ, indexes, triggers, dữ liệu mẫu)
- [x] Khởi tạo Prisma Schema: `prisma/schema.prisma` đồng bộ 14 models, 6 enums
- [x] Cấu hình `prisma.config.ts` (`definePrismaConfig`) xử lý triệt để breaking change của Prisma 7/8
- [x] Thay thế toàn bộ Mock Data giả lập bằng Dữ liệu thật 100%:
  - Tích hợp kho ảnh Transparent Vector SVG siêu nét trong `public/images/products/` (iPhone 16 Pro Max, Galaxy S24 Ultra, Xiaomi 14 Ultra Leica, Galaxy Z Fold6, ROG Phone 8 Pro, iPhone 16 Plus,...).
  - Đã xóa sạch toàn bộ các file ảnh mock cũ (.png, .jpg) và xóa toàn bộ các file mock data trong `src/constants/` (`hero-slides.ts`, `featured-products-data.ts`, `flash-sale-data.ts`, `reviews-news-data.ts`, `story-data.ts`).
  - Toàn bộ TypeScript interfaces giao diện được chuyển sang `src/types/ui.ts`.
- [x] **Tái cấu trúc Trang Chủ & tách riêng LoadingScreen:**
  - Giữ riêng `Header`, `Footer` và `LoadingScreen` trong `src/components/common/` (`header.tsx`, `footer.tsx`, `loading-screen.tsx`).
  - Gom toàn bộ các khối tính năng nội dung body (AnnouncementBar, HeroSlider, BrandMarquee, BentoSection, FlashSaleSection, FeaturedProductsSection, ScrollStorySection, TradeInSection, NeedAccordionSection, ReviewsSection, FloatingCompareBar) vào trực tiếp `src/app/page.tsx`.
  - Xóa bỏ hoàn toàn thư mục `src/components/features/` để giữ dự án gọn gàng, tránh phân tán code.
  - Tự động nạp dữ liệu thật từ database MySQL thông qua API `/api/products`.
- [x] Kiểm tra thành công `npm.cmd run lint` (0 errors, 0 warnings) và `npm.cmd run build` (0 errors, Static & Dynamic compilation 100%).
- [x] Thực hiện chuỗi Git Commits chuẩn hóa bằng Tiếng Việt cho từng tầng mã nguồn theo đúng yêu cầu.

---

## 9. In Progress

- Khởi tạo client singleton cho Prisma (`src/lib/prisma.ts`) để kết nối với cơ sở dữ liệu MySQL.
- Tích hợp Redux Store và TanStack Query Client vào `src/providers/`.
- Xây dựng API Routes / Server Actions phục vụ lấy dữ liệu sản phẩm động và giỏ hàng từ cơ sở dữ liệu.

---

## 10. TODO / Planned Features

- Chạy migration hoặc import `database/schema.sql` vào MySQL cục bộ.
- Xây dựng các trang route con:
  - Trang danh mục sản phẩm & bộ lọc nâng cao (`/products`)
  - Trang chi tiết sản phẩm với chọn biến thể ROM/RAM/Màu sắc (`/products/[slug]`)
  - Giỏ hàng (`/cart`) và trang thanh toán (`/checkout`)
  - Xác thực người dùng: Đăng nhập, Đăng ký, Quên mật khẩu (`/auth/login`, `/auth/register`)
  - Trang quản lý tài khoản & lịch sử đơn hàng (`/profile/orders`)
- Tích hợp cổng thanh toán trực tuyến: VNPay, MoMo, ZaloPay.
- Xây dựng trang Quản trị (Admin Dashboard) quản lý sản phẩm, đơn hàng, mã giảm giá và người dùng.

---

## 11. Known Bugs / Issues

- Đã khắc phục lỗi `new Date()` trong quá trình prerender của Next.js 16 Turbopack Cache Components.
- Đã khắc phục lỗi breaking change `The datasource property url is no longer supported in schema files` của Prisma 7/8 bằng cách đưa kết nối vào `prisma.config.ts`.
- Đã cấu hình `next build --webpack` trong `package.json` xử lý triệt để xung đột font Turbopack.
- Không có lint error hay build error nào tồn tại.

---

## 12. Important Files

| File                       | Vai trò                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `src/app/layout.tsx`       | Root layout — fonts Google, metadata SEO, body, Header, Footer       |
| `src/app/page.tsx`         | Home page (`/`) — Trang chủ Flagship Store tích hợp toàn bộ Body     |
| `src/app/globals.css`      | Global styles + Tailwind v4 + Glassmorphism + Keyframes              |
| `src/app/api/products/`    | API Route cung cấp danh sách sản phẩm từ database MySQL              |
| `database/schema.sql`      | Script DDL MySQL 8.0+ tạo database `md_mobile` và 14 bảng quan hệ    |
| `prisma/schema.prisma`     | Schema Prisma ORM chứa 14 models và 6 enums                          |
| `prisma.config.ts`         | File cấu hình datasource URL cho Prisma CLI (chuẩn Prisma 7/8)       |
| `src/components/common/`   | Header, Footer, CustomCursor, LoadingScreen (dùng chung)           |
| `src/components/ui/`       | Atomic UI components (Button, Input, Card, Badge, ToastBox)          |
| `src/constants/`           | Cấu hình hệ thống chung (SITE_CONFIG, NAV_LINKS, API_ENDPOINTS)      |
| `src/lib/`                 | db.ts (MySQL pool), dal.ts (Data Access Layer), utils.ts             |
| `src/providers/index.tsx`  | Wrapper client providers (Theme, Auth, Cart,...)                     |
| `src/types/`               | TypeScript interfaces: Product, Cart, User, Api, UI                  |
| `.env.example`             | File mẫu cấu hình biến môi trường                                    |
| `package.json`             | Dependencies và script build                                         |
| `tsconfig.json`            | TypeScript config (strict, path alias `@/*` -> `./src/*`)            |

---

## 13. Development Rules / Conventions

### Từ cấu hình hiện tại:

- **TypeScript strict mode** được bật — không dùng `any`, phải type đầy đủ.
- **ESLint** dùng `next/core-web-vitals` + `next/typescript` — chạy `npm.cmd run lint` để kiểm tra.
- **Path alias:** `@/*` → `./src/*`, ví dụ `import { Button } from "@/components/ui/button"`.
- **App Router** trong `src/app` — cấu trúc thư mục route rõ ràng.
- **Tailwind CSS v4** — dùng `@import "tailwindcss"` trong `src/app/globals.css`.

### Từ AGENTS.md (quan trọng):

- Next.js `16.4.2` có **breaking changes** so với các phiên bản trước.
- **Bắt buộc đọc** `node_modules/next/dist/docs/` trước khi viết bất kỳ code Next.js nào.
- Không xóa block `<!-- BEGIN:nextjs-agent-rules -->` trong `AGENTS.md` khỏi commit.

---

## 14. Current Project Status

**Trạng thái:** 🟢 **Trang chủ đã được gom gọn vào 1 file duy nhất (`page.tsx`) & Build thành công 100%**

Toàn bộ các khối nội dung body của Flagship Store đã được gom trực tiếp vào `src/app/page.tsx`. Các components dùng chung `Header` và `Footer` được bảo toàn riêng trong `src/components/common/`. Đã xóa sạch thư mục phân mảnh `src/components/features/`. Dự án kết nối database MySQL qua `/api/products` và vượt qua kiểm thử build production 100% không một lỗi.

---

## 15. Last Updated

- **Ngày tạo:** 2026-10-22
- **Cập nhật lần cuối:** 2026-11-02
- **Người cập nhật:** AI (Antigravity)

---

## AI Working Rules

### Khi bắt đầu session

- Đọc `PROJECT_CONTEXT.md` trước để nắm context của project.
- Đọc/kiểm tra source code cần thiết để đối chiếu với context.
- Mặc định chỉ đọc và phân tích để hiểu project.
- Không tự ý sửa, thêm, xóa hoặc refactor code.

### Khi nào được sửa code

- Chỉ sửa code khi tôi yêu cầu rõ ràng.
- Không tự suy đoán task tiếp theo.
- Không tự thực hiện các chức năng hoặc thay đổi mà tôi chưa yêu cầu.
- Nếu tôi chỉ yêu cầu đọc, phân tích hoặc tìm hiểu project thì tuyệt đối không thay đổi code.

### Sau khi được yêu cầu sửa code

- Chỉ thay đổi những phần liên quan trực tiếp đến task tôi yêu cầu.
- Không tự ý thay đổi architecture hoặc những phần không liên quan.
- Sau khi hoàn thành, kiểm tra lại code để đảm bảo thay đổi hoạt động đúng.

### Sau khi hoàn thành task

- Nếu task làm thay đổi trạng thái, chức năng, architecture, bug hoặc TODO của project thì cập nhật lại `PROJECT_CONTEXT.md`.
- Không tự thêm thông tin chưa được xác định hoặc chưa thực hiện.
