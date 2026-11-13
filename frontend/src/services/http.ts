import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// 1. Khởi tạo instance Axios với cấu hình mặc định
const http: AxiosInstance = axios.create({
  // Đường dẫn gốc của API (ưu tiên biến môi trường, mặc định cổng backend 5000)
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  // Thời gian chờ tối đa cho mỗi request là 10 giây
  timeout: 10000,
  // Header mặc định gửi dữ liệu dạng JSON
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 2. Request Interceptor — Xử lý TRƯỚC KHI request được gửi đi
 * Tự động kiểm tra và gắn Access Token vào Header nếu người dùng đã đăng nhập
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Kiểm tra an toàn cho môi trường Next.js (chỉ đọc localStorage ở phía trình duyệt)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Trả về lỗi nếu bước chuẩn bị request thất bại
    return Promise.reject(error);
  }
);

/**
 * 3. Response Interceptor — Xử lý KHI NHẬN ĐƯỢC phản hồi từ Server
 * Tự động bóc tách dữ liệu và gom nhóm xử lý lỗi tập trung
 */
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về trực tiếp data của phản hồi (bỏ qua các thông tin bọc ngoài của Axios)
    return response.data;
  },
  (error) => {
    // Bóc tách câu thông báo lỗi chi tiết từ Server gửi về (nếu có)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Đã có lỗi xảy ra khi kết nối máy chủ!";

    // Xử lý khi token hết hạn hoặc chưa đăng nhập (mã 401)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Xóa token cũ nếu không còn hợp lệ
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default http;
export { http };
