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
| Framework (FE)       | Next.js `16.4.2` (App Router)                     |
| Runtime (FE)         | React `19.3.0`                                    |
| Backend Server (BE)  | Express.js `^4.21.2` (TypeScript NodeNext)        |
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
| Database / ORM       | `prisma` `^7.10.1`, `@prisma/client` `^7.10.1`, `mysql2` |
| Auth & Crypto        | `jsonwebtoken` `^9.0.3`, `bcryptjs` `^3.0.3`      |
| Utilities            | `dayjs`, `slugify`, `sharp`, `@number-flow/react` |

**Lưu ý quan trọng:** Next.js `16.4.2` và Prisma `7/8` có nhiều breaking changes so với các phiên bản cũ. Bắt buộc đọc tài liệu trong `node_modules` trước khi viết code.

---

## 3. Project Structure (Kiến trúc chuẩn tách bạch: Frontend + Backend)

```
d:\md-mobile\
├── frontend/                  # Next.js 16 + React 19 Frontend (Port 3000)
│   ├── public/                # Static assets, SVG sản phẩm, banners
│   │   └── images/
│   │       ├── banners/       # Banners trang chủ & md-member-banner.png cho trang Login
│   │       └── products/      # Transparent Vector SVG sản phẩm
│   ├── src/                   # Mã nguồn Frontend Next.js
│   │   ├── app/               # Next.js App Router
│   │   │   ├── page.tsx       # Trang chủ Flagship Store (11 sections)
│   │   │   ├── login/         # Trang Đăng nhập MD-MEMBER (/login)
│   │   │   │   └── page.tsx   # 2 khối độc lập (Full Banner + Form kính Aurora/Sunset)
│   │   │   ├── layout.tsx     # Root Layout, font, CustomCursor, Providers
│   │   │   ├── error.tsx      # App boundary error page
│   │   │   ├── global-error.tsx # Global root error page
│   │   │   ├── not-found.tsx  # Trang 404
│   │   │   ├── robots.ts      # Cấu hình SEO crawler
│   │   │   └── sitemap.ts     # Sơ đồ website SEO
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Header, Footer, LoadingScreen, CustomCursor, FloatingActions
│   │   │   └── ui/            # Atomic elements (Button, Input, Card, Badge, ToastBox)
│   │   ├── constants/         # Hằng số cấu hình hệ thống (SITE_CONFIG, NAV_LINKS)
│   │   ├── hooks/             # Custom React hooks (useDebounce, useLocalStorage, useMediaQuery)
│   │   ├── lib/               # Utility helpers (utils.ts)
│   │   ├── providers/         # React Context Providers
│   │   ├── services/          # API Client & data fetching (apiClient, productService)
│   │   ├── store/             # Redux Toolkit (đã khởi tạo cấu trúc):
│   │   │   ├── index.ts       # Root store config
│   │   │   ├── hooks.ts       # Typed hooks (useAppDispatch, useAppSelector)
│   │   │   └── slices/        # Slices: cartSlice, authSlice, productSlice, compareSlice, uiSlice, orderSlice
│   │   ├── types/             # TypeScript type definitions (Product, Cart, Api, UI...)
│   │   └── utils/             # Các module helper & logic tái sử dụng độc lập
│   │       ├── auth-validation.ts # Zod schema xác thực SĐT, Email, Password, Forgot Password
│   │       ├── password-toggle.ts # Hook usePasswordToggle quản lý ẩn/hiện mật khẩu & eye blink
│   │       └── theme-toggle.ts    # Hook useThemeToggle quản lý Sáng/Tối (React 19 Safe)
│   ├── next.config.ts         # Next.js config (proxy rewrites /api/:path* -> port 5000, remotePatterns)
│   ├── package.json           # Frontend dependencies & scripts
│   ├── tsconfig.json          # TypeScript config (alias @/* -> ./src/*)
│   └── .env.local             # Cấu hình API URL (http://localhost:5000)
│
├── backend/                   # Express.js + TypeScript Backend API Server (Port 5000)
│   ├── database/              # DDL MySQL 8.0+ (14 bảng, schema.sql, update_real_data.sql)
│   ├── prisma/                # Prisma schema & config
│   │   └── schema.prisma      # 14 models & 6 enums
│   ├── prisma.config.ts       # Prisma 7.10.1 config (defineConfig, env URL)
│   ├── src/
│   │   ├── config/            # Cấu hình kết nối MySQL pool (db.ts)
│   │   ├── controllers/       # Controller tiếp nhận request (product.controller.ts, banner.controller.ts)
│   │   ├── routes/            # Khai báo Express router (/api/products, /api/banners, /api/health)
│   │   ├── services/          # Business logic & Database queries (product.service.ts)
│   │   ├── types/             # TypeScript interfaces cho API & Database rows
│   │   └── server.ts          # Express entry point (Port 5000, CORS, Logger)
│   ├── package.json           # Backend dependencies (express, cors, mysql2, zod, tsx, prisma 7)
│   ├── tsconfig.json          # TypeScript NodeNext configuration
│   └── .env                   # Biến môi trường Database MySQL, JWT, Port
│
├── package.json               # Root package.json điều phối chạy dev song song cả 2 app
├── PROJECT_CONTEXT.md         # File ngữ cảnh dự án (đọc trước khi làm việc)
└── README.md
```

**Nhận xét:** Dự án đã được tổ chức tối ưu thành 2 thư mục độc lập:
- `frontend/`: Phục vụ riêng cho giao diện (Next.js 16, Tailwind v4, Swiper, Framer Motion, Redux Toolkit, Zod validation).
- `backend/`: Phục vụ riêng cho API & Database (Express.js, MySQL, Prisma 7, JWT).
- Chạy chung: Chạy backend ở port 5000, frontend ở port 3000. Next.js tự động proxy các request `/api/*` sang backend thông qua rewrites trong `next.config.ts`.

---

## 4. Architecture

- **Kiến trúc:** Phân tầng rõ rệt giữa Next.js Frontend và Express Backend.
- **Rendering & Data Flow:**
  - `frontend/src/app/page.tsx` là Client Component đảm nhiệm toàn bộ trải nghiệm tương tác động mượt mà (Swiper 3D, Flip Clock, Tab lọc sản phẩm, Modal định giá AI, Thanh so sánh cấu hình).
  - Tự động nạp dữ liệu thật 100% từ MySQL qua Backend Express API (`/api/products`, `/api/banners`).
  - Toàn bộ mock data đã được loại bỏ hoàn toàn khỏi dự án.
- **Frontend Design System:**
  - Root layout: `frontend/src/app/layout.tsx` — cấu hình 3 bộ font Google (`Plus Jakarta Sans`, `Inter`, `Space Grotesk`), metadata chuẩn SEO OpenGraph tiếng Việt, Custom Cursor và Toast Box.
  - Header: `frontend/src/components/common/header.tsx` — Thiết kế **Full chiều ngang 100vw** (`sticky top-0 w-full`), viền kính mờ sang trọng, thanh tìm kiếm thông minh gợi ý trực tiếp sản phẩm thật, nút User dẫn thẳng về `/login`.
  - Homepage: `frontend/src/app/page.tsx` — Tích hợp 11 khối tính năng chuẩn Flagship Store.
  - Login Page: `frontend/src/app/login/page.tsx` — Thiết kế 2 khối độc lập (55% Banner MD-MEMBER full 100% không crop / 45% Form đăng nhập kính mờ, Floating labels, viền phát sáng Aurora, nút bấm Sunset shimmer sweep, hỗ trợ Dark/Light toggle).
- **Backend API Design:**
  - Viết theo chuẩn hàm thuần (pure functions), không dùng OOP class rườm rà.
  - Chuẩn hóa 3 bước: Nhận Request -> Truy vấn MySQL -> Trả về JSON `{ success: true, data: ... }`.
  - Có đầy đủ Endpoint:
    - `GET /api/products`: Tất cả sản phẩm.
    - `GET /api/products/featured`: Sản phẩm nổi bật cho trang chủ.
    - `GET /api/products/flash-sale`: Sản phẩm giảm giá Flash Sale.
    - `GET /api/products/:slug`: Chi tiết 1 sản phẩm theo slug.
    - `GET /api/banners`: Danh sách banner cho Hero Slider.
    - `GET /api/health`: Kiểm tra trạng thái máy chủ.

---

## 5. Database

- **Database Engine:** MySQL 8.0+ / MariaDB 10.5+ (bảng mã `utf8mb4_unicode_ci`).
- **DDL Script:** [`backend/database/schema.sql`](file:///d:/md-mobile/backend/database/schema.sql) (hơn 390 dòng code tạo CSDL `md_mobile`, bảng và foreign keys).
- **Prisma ORM:** [`backend/prisma/schema.prisma`](file:///d:/md-mobile/backend/prisma/schema.prisma) đồng bộ 100% với DDL và cấu hình URL migrate qua [`backend/prisma.config.ts`](file:///d:/md-mobile/backend/prisma.config.ts) phiên bản `7.10.1`.
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
- **Frontend Auth & Validation:**
  - Trang đăng nhập `/login` đã hoàn thiện giao diện và validation.
  - Sử dụng thư viện `zod` (`^4.6.7`) quản lý schema xác thực tập trung tại `frontend/src/utils/auth-validation.ts`.
  - Quản lý trạng thái giao diện mật khẩu tại `frontend/src/utils/password-toggle.ts`.
  - Quản lý chế độ sáng/tối tại `frontend/src/utils/theme-toggle.ts`.
- **Session/Token management:** Đã định nghĩa key lưu trữ `STORAGE_KEYS.AUTH_TOKEN`.

---

## 7. Important Features

- Cấu trúc tách bạch chuyên nghiệp: `frontend/` (Next.js 16) và `backend/` (Express.js).
- Hệ thống UI components cơ bản: `Button`, `Input`, `Card`, `Badge`, `ToastBox`.
- Layout dùng chung: `Header` (full width 100vw, hotline, search bar gợi ý sản phẩm thật, navigation có gạch chân trượt, cart button, user profile button chuyển hướng `/login`, toggle theme), `Footer`, `LoadingScreen`.
- Trang chủ Flagship Store gom gọn trong `frontend/src/app/page.tsx`:
  - Fullscreen Hero Slider 100vw tràn viền với dữ liệu thật từ bảng `banners` MySQL.
  - Bento Grid 6 ô đặc quyền với hiệu ứng vầng sáng chuột Spotlight 3D (`--mouse-x`, `--mouse-y`).
  - Flash Sale với đồng hồ đếm ngược Flip Clock (Giờ : Phút : Giây) và thanh tiến độ bán shimmer với sản phẩm thật.
  - Danh mục sản phẩm nổi bật với tab lọc trượt, thẻ 3D tilt, nút thêm vào yêu thích và thêm giỏ hàng.
  - Bóc tách công nghệ 3D Scroll Story 4 bước.
  - Banner Thu cũ trợ giá 5 triệu + Modal định giá AI trực tiếp.
  - Accordion 4 nhu cầu mở rộng theo chiều ngang.
  - 2 hàng marquee đánh giá khách hàng chạy ngược chiều nhau + 3 thẻ tin tức công nghệ.
  - Thanh so sánh cấu hình nổi (Floating Compare Bar).
- Trang Đăng nhập MD-MEMBER (`frontend/src/app/login/page.tsx`):
  - Khối trái: Banner MD-MEMBER hiển thị toàn bộ 100% không cắt ảnh.
  - Khối phải: Thẻ đăng nhập kính mờ, Floating Label, Aurora focus glow, nút bấm Sunset gradient, form tối giản chỉ sử dụng **Số điện thoại & Mật khẩu** với **React Hook Form** + **Zod**, nút con mắt bật tắt gạch chéo thông thường, link "Quên mật khẩu?" căn giữa dưới nút, đăng nhập qua Google & Zalo, Modal khôi phục mật khẩu OTP. Bỏ nút điều hướng về trang chủ và bỏ phần ghi nhớ đăng nhập theo yêu cầu.
- Bộ module tiện ích độc lập (`frontend/src/utils/`):
  - `auth-validation.ts`: Schema Zod tinh gọn kiểm tra SĐT và mật khẩu.
  - `password-toggle.ts`: Hook đơn giản quản lý bật/tắt mật khẩu.
  - `theme-toggle.ts`: Hook chuyển chế độ sáng tối an toàn React 19 / Next.js 16.
  - `toast.ts`: Hook `useToast` quản lý thông báo Toast an toàn, type-safe (`ToastNotification`).
- Redux Toolkit: Đã khởi tạo cấu trúc thư mục và các file trống trong `frontend/src/store/`.
- Hooks tiện ích: `useDebounce`, `useLocalStorage` (chuẩn React 19 `useSyncExternalStore`), `useMediaQuery`.
- Xử lý lỗi & Trạng thái tải: `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`.
- Tối ưu hóa SEO: `robots.ts`, `sitemap.ts`, OpenGraph metadata.

---

## 8. Completed Features

- [x] Khởi tạo project Next.js 16 với App Router và Express.js Backend.
- [x] Phân chia cấu trúc tách bạch Monorepo: `frontend/` và `backend/`.
- [x] Cấu hình TypeScript (strict mode) trên cả 2 ứng dụng.
- [x] Tích hợp Tailwind CSS v4 với Webpack build xử lý xung đột font.
- [x] Cấu hình ESLint (0 errors, 0 warnings).
- [x] Xây dựng cơ sở dữ liệu MySQL chuẩn: `backend/database/schema.sql` (14 bảng quan hệ, indexes, triggers, dữ liệu mẫu chuẩn UTF-8).
- [x] Khởi tạo Prisma Schema: `backend/prisma/schema.prisma` và `backend/prisma.config.ts` (Prisma v7.10.1).
- [x] Thay thế toàn bộ Mock Data giả lập bằng Dữ liệu thật 100%:
  - Tích hợp kho ảnh Transparent Vector SVG siêu nét trong `frontend/public/images/products/`.
  - Đã xóa sạch toàn bộ các file ảnh mock cũ và file mock data constants.
  - Đổ 8 sản phẩm thật vào database MySQL và kết nối thành công lên trang chủ Frontend.
- [x] Tái cấu trúc Trang Chủ thành 1 file duy nhất (`frontend/src/app/page.tsx`):
  - Giữ riêng `Header`, `Footer` và `LoadingScreen` trong `components/common/`.
  - Tích hợp toàn bộ nội dung body vào `page.tsx` giúp code gọn gàng, không bị phân mảnh.
- [x] Tối ưu hóa Backend API:
  - Viết lại Controller & Service theo dạng hàm thuần (pure functions) đơn giản, dễ hiểu, bỏ Class OOP rườm rà.
  - Thêm API Banners (`GET /api/banners`) kết nối MySQL bảng `banners`.
  - Khắc phục lỗi hiển thị font tiếng Việt có dấu trong CSDL MySQL bảng `banners`.
- [x] Nâng cấp giao diện Header & Hero Banner Slider sang **Full chiều ngang 100vw** tràn viền hiện đại, sang trọng chuẩn Flagship Store.
- [x] Khởi tạo cấu trúc thư mục & các file rỗng cho **Redux Toolkit** trong `frontend/src/store/`:
  - `index.ts`, `hooks.ts`
  - Slices: `cartSlice.ts`, `authSlice.ts`, `productSlice.ts`, `compareSlice.ts`, `uiSlice.ts`, `orderSlice.ts`
- [x] Bổ sung cụm Tiện ích nổi bên phải màn hình ([FloatingActions](file:///d:/md-mobile/frontend/src/components/common/floating-actions.tsx)).
- [x] Tái cấu trúc & Tinh gọn Trang Chủ ([page.tsx](file:///d:/md-mobile/frontend/src/app/page.tsx)) xuống ~480 dòng code sạch sẽ, súc tích.
- [x] Tinh giản Header: Gỡ bỏ nút toggle ECO, thay thế bằng icon Tài khoản cá nhân (`User`) liên kết tới `/login`.
- [x] Cập nhật `next.config.ts` bổ sung `remotePatterns` cho `images.unsplash.com`.
- [x] Thiết kế hoàn chỉnh **Trang Đăng nhập MD-MEMBER** ([frontend/src/app/login/page.tsx](file:///d:/md-mobile/frontend/src/app/login/page.tsx)):
  - Cấu trúc 2 khối tách biệt rõ ràng (Khối trái: Banner ảnh thật `md-member-banner.png` hiển thị full 100% không crop; Khối phải: Thẻ form đăng nhập).
  - Tích hợp hệ thống màu sắc cao cấp: Nền Dark `#07070F` / Light `#F7F7FB`, viền phát sáng Aurora, nút bấm Sunset gradient với hiệu ứng quét sáng shimmer và magnetic hover.
  - Quản lý toàn diện form bằng **React Hook Form (`useForm`, `useWatch`)** kết hợp **`zodResolver`**: Tự động xác thực dữ liệu, chuẩn TypeScript typesafe, loại bỏ state rườm rà.
  - Hỗ trợ đăng nhập qua SĐT và Email, đăng nhập mạng xã hội (Google, Zalo), modal khôi phục mật khẩu OTP.
- [x] Module hóa các hàm logic tái sử dụng vào `frontend/src/utils/`:
  - `password-toggle.ts`: Custom hook `usePasswordToggle`.
  - `theme-toggle.ts`: Custom hook `useThemeToggle` (chuẩn React 19 `useSyncExternalStore` + `localStorage`).
  - `auth-validation.ts`: Toàn bộ schema kiểm tra tính hợp lệ của SĐT, Email, Password bằng thư viện **Zod**.
  - Loại bỏ hiệu ứng rung thẻ khi báo lỗi validate theo yêu cầu, giữ nguyên trạng thái cảnh báo viền đỏ và text lỗi tinh tế.
- [x] Kiểm tra thành công `npm run build` & `npm run lint` trên toàn bộ dự án: Biên dịch thành công 100% (0 lỗi, 0 cảnh báo).

---

## 9. In Progress

- Xây dựng trang Đăng ký tài khoản MD-MEMBER (`/register`).
- Triển khai logic code cho các Slice trong Redux Toolkit (`frontend/src/store/slices/`).
- Tích hợp Redux Store Provider vào `frontend/src/providers/`.
- Xây dựng các trang route con phục vụ mua sắm (`/products`, `/cart`, `/checkout`).

---

## 10. TODO / Planned Features

- Hoàn thiện trang Đăng ký tài khoản mới (`/register`).
- Tích hợp lại các thẻ sản phẩm chi tiết cho Flash Sale và Featured Products trên trang chủ khi cần.
- Hoàn thiện luồng Giỏ hàng (Cart) và Thanh toán (Checkout) với Redux Toolkit.
- Xây dựng trang danh mục sản phẩm & bộ lọc nâng cao (`/products`).
- Xây dựng trang chi tiết sản phẩm chọn biến thể ROM/RAM/Màu sắc (`/products/[slug]`).
- Trang quản lý tài khoản & lịch sử đơn hàng (`/profile/orders`).
- Tích hợp cổng thanh toán trực tuyến: VNPay, MoMo, ZaloPay.
- Xây dựng trang Quản trị (Admin Dashboard) quản lý sản phẩm, đơn hàng, mã giảm giá và người dùng.

---

## 11. Known Bugs / Issues

- Đã khắc phục lỗi `new Date()` trong quá trình prerender của Next.js 16.
- Đã khắc phục lỗi breaking change datasource URL của Prisma 7/8 qua `prisma.config.ts`.
- Đã cấu hình `next build --webpack` trong `package.json` xử lý triệt để xung đột font Turbopack.
- Đã sửa lỗi hiển thị tiếng Việt UTF-8 trong bảng `banners` MySQL.
- Đã sửa lỗi ESLint no-explicit-any trong `frontend/src/app/page.tsx`.
- Đã khắc phục lỗi Error Boundary / Hydration trên trang `/login` do thẻ `<style jsx global>` và đồng bộ hóa `useSyncExternalStore` cho theme toggle.
- Toàn bộ codebase hiện tại đạt **0 lint errors, 0 lint warnings, 0 build errors**.

---

## 12. Important Files

| File                                               | Vai trò                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| `frontend/src/app/layout.tsx`                      | Root layout — fonts Google, metadata SEO, body, Header, Footer       |
| `frontend/src/app/page.tsx`                        | Home page (`/`) — Trang chủ Flagship Store tích hợp toàn bộ Body     |
| `frontend/src/app/login/page.tsx`                  | Login page (`/login`) — Trang đăng nhập MD-MEMBER 2 khối độc lập     |
| `frontend/src/utils/auth-validation.ts`            | Schema Zod xác thực đăng nhập & khôi phục mật khẩu                    |
| `frontend/src/utils/password-toggle.ts`            | Custom hook ẩn/hiện mật khẩu và hiệu ứng nháy mắt                    |
| `frontend/src/utils/theme-toggle.ts`               | Custom hook đồng bộ Sáng/Tối chuẩn React 19                         |
| `frontend/src/components/common/header.tsx`        | Header Full width 100vw tràn viền, tìm kiếm sản phẩm thật, nút Login |
| `frontend/src/components/common/loading-screen.tsx`| Loading Screen mở màn chuyển cảnh animation logo                     |
| `frontend/src/components/common/footer.tsx`        | Dark Luxury Footer                                                   |
| `frontend/src/store/`                              | Thư mục cấu hình Redux Toolkit & các Slices                          |
| `backend/src/server.ts`                            | Entry point Backend Express server (Port 5000)                       |
| `backend/src/controllers/product.controller.ts`    | Controller xử lý API sản phẩm                                        |
| `backend/src/controllers/banner.controller.ts`     | Controller xử lý API banners                                         |
| `backend/src/services/product.service.ts`          | Service truy vấn CSDL MySQL cho sản phẩm                             |
| `backend/database/schema.sql`                      | Script DDL MySQL 8.0+ tạo database `md_mobile` và 14 bảng quan hệ    |
| `backend/prisma/schema.prisma`                     | Schema Prisma ORM chứa 14 models và 6 enums                          |
| `backend/prisma.config.ts`                         | Cấu hình Prisma v7.10.1 tương thích mới nhất                         |

---

## 13. Development Rules / Conventions

### Từ cấu hình hiện tại:

- **TypeScript strict mode** được bật — không dùng `any`, phải type đầy đủ.
- **ESLint** dùng `next/core-web-vitals` + `next/typescript` — chạy `npm run lint` để kiểm tra.
- **Path alias:** `@/*` → `./src/*` trong frontend.
- **App Router** trong `frontend/src/app`.
- **Tailwind CSS v4** — dùng `@import "tailwindcss"` trong `globals.css`.

### Từ AGENTS.md (quan trọng):

- Next.js `16.4.2` có **breaking changes** so với các phiên bản trước.
- **Bắt buộc đọc** `node_modules/next/dist/docs/` trước khi viết bất kỳ code Next.js nào.
- Không xóa block `<!-- BEGIN:nextjs-agent-rules -->` trong `AGENTS.md` khỏi commit.

---

## 14. Current Project Status

**Trạng thái:** 🟢 **Toàn bộ hệ thống Frontend & Backend đồng bộ 100%, Build thành công không một lỗi**

- **Frontend**:
  - Trang chủ Flagship Store tràn viền full width 100vw, nạp dữ liệu thật từ MySQL qua API.
  - Trang Đăng nhập MD-MEMBER hoàn chỉnh 2 khối, full banner tĩnh, hiệu ứng Aurora/Sunset, Zod validation, hooks riêng trong `utils`.
- **Backend**: Express API server tổ chức mạch lạc, code đơn giản dễ hiểu, phục vụ dữ liệu sản phẩm và banner từ MySQL qua Prisma 7.
- **Kiểm thử**: Đạt 0 lỗi lint, 0 lỗi TypeScript, biên dịch build production 100%.

---

## 15. Last Updated

- **Ngày tạo:** 2026-10-22
- **Cập nhật lần cuối:** 2026-11-08
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
