import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-full bg-red-50 p-6 dark:bg-red-950/30 mb-6">
        <svg
          className="w-16 h-16 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
        404 - Không tìm thấy trang
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400 mb-8 text-sm leading-relaxed">
        Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không khả dụng.
      </p>

      <div className="flex gap-4">
        <Link href="/">
          <Button variant="primary" size="md">
            Quay lại trang chủ
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="md">
            Xem danh mục sản phẩm
          </Button>
        </Link>
      </div>
    </div>
  );
}
