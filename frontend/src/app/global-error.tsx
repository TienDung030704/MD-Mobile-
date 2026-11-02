"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global Root Error:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col items-center justify-center p-4 text-center font-sans">
        <h1 className="text-3xl font-extrabold text-red-600 mb-2">
          Lỗi hệ thống nghiêm trọng
        </h1>
        <p className="text-zinc-600 mb-6 text-sm">
          Đã xảy ra sự cố ở cấp độ ứng dụng. Vui lòng tải lại trang.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Tải lại ứng dụng
        </button>
      </body>
    </html>
  );
}
