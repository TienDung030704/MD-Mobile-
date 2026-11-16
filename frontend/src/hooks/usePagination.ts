"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function usePagination<T>(items: T[] = [], limit: number = 9) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Lấy số trang hiện tại từ URL (nếu chưa có thì mặc định là trang 1)
  const page = Number(searchParams.get("page")) || 1;

  // 2. Tính tổng số trang (ít nhất là 1 trang)
  const totalPages = Math.ceil(items.length / limit) || 1;

  // 3. Lấy các phần tử của trang hiện tại
  const currentItems = useMemo(() => {
    const start = (page - 1) * limit;
    return items.slice(start, start + limit);
  }, [items, page, limit]);

  // 4. Tạo danh sách các số trang hiển thị rút gọn thông minh (tối đa 7 nút, có dấu '...')
  const paginationRange = useMemo(() => {
    // Nếu tổng số trang ít hơn hoặc bằng 7 thì hiển thị tất cả: [1, 2, 3, 4, 5, 6, 7]
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Khi đang ở các trang đầu: [1, 2, 3, 4, 5, "...", totalPages]
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // Khi đang ở các trang cuối: [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Khi đang ở giữa: [1, "...", page - 1, page, page + 1, "...", totalPages]
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }, [page, totalPages]);

  // 5. Hàm chuyển trang: cập nhật URL và cuộn mượt lên đầu
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { page, totalPages, currentItems, paginationRange, handlePageChange };
}

export default usePagination;
