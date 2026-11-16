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

  // 4. Hàm chuyển trang: cập nhật URL và cuộn mượt lên đầu
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { page, totalPages, currentItems, handlePageChange };
}

export default usePagination;
