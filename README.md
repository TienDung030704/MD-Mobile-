# MD Mobile - Fullstack E-Commerce Platform

Dự án website thương mại điện tử Flagship Store cho thiết bị di động công nghệ cao, được phân tách cấu trúc rõ ràng thành **Frontend (Next.js)** và **Backend (Express.js)**.

---

## 📁 Cấu trúc thư mục

```text
md-mobile/
├── frontend/                  # Next.js 16 + React 19 Frontend (Port 3000)
│   ├── src/
│   │   ├── app/               # Next.js App Router (UI pages, layouts)
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API clients gọi sang Backend
│   │   └── types/             # Frontend Types
│   └── .env.local             # Cấu hình API URL (http://localhost:5000)
│
├── backend/                   # Express.js + TypeScript Backend (Port 5000)
│   ├── database/              # DDL MySQL 8.0+ (schema.sql, sample data)
│   ├── prisma/                # Prisma ORM schema & migrations
│   ├── src/
│   │   ├── config/            # Kết nối MySQL pool
│   │   ├── controllers/       # Xử lý request
│   │   ├── routes/            # Khai báo Express API endpoints
│   │   ├── services/          # Business logic & Database queries
│   │   └── server.ts          # Express Server entry point
│   └── .env                   # Cấu hình MySQL & JWT
│
└── package.json               # Root scripts điều phối
```

---

## 🚀 Hướng dẫn khởi chạy

### 1. Cài đặt thư viện (nếu mới clone về)
```bash
npm run install:all
```

### 2. Khởi chạy môi trường phát triển (Development)

* **Chạy song song cả Frontend & Backend (Khuyên dùng):**
  ```bash
  npm run dev
  ```
  *(Backend chạy tại `http://localhost:5000`, Frontend chạy tại `http://localhost:3000`)*

* **Chỉ chạy Frontend:**
  ```bash
  npm run dev:frontend
  ```

* **Chỉ chạy Backend:**
  ```bash
  npm run dev:backend
  ```

---

## 👥 Phân chia công việc cho team 2 người:
- **Người làm Frontend:** Làm việc hoàn toàn trong thư mục `frontend/`.
- **Người làm Backend:** Làm việc hoàn toàn trong thư mục `backend/`.
