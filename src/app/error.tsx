"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an error reporting service
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-full bg-red-100 p-5 dark:bg-red-950/40 mb-6">
        <svg
          className="w-12 h-12 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Đã có lỗi xảy ra!
      </h2>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
        Hệ thống không thể tải trang này. Bạn có thể bấm nút bên dưới để thử lại.
      </p>

      <div className="flex gap-4">
        <Button variant="primary" onClick={() => reset()}>
          Thử lại
        </Button>
        <Link href="/">
          <Button variant="outline">
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}
