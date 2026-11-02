"use client";

import React, { useEffect, useState } from "react";

interface ToastMessage {
  id: string;
  title: string;
  subtitle: string;
}

export function showToast(title: string, subtitle: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app-toast", { detail: { title, subtitle } })
    );
  }
}

export function ToastBox() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; subtitle: string }>;
      const newToast: ToastMessage = {
        id: Math.random().toString(36).substring(2, 9),
        title: customEvent.detail.title,
        subtitle: customEvent.detail.subtitle,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  return (
    <div
      id="toast-box"
      className="fixed bottom-6 right-6 z-[300] space-y-3 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3.5 glass-card px-5 py-3.5 rounded-2xl shadow-2xl border border-brandViolet/30 bg-[#0F1020]/90 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brandViolet to-brandCyan flex items-center justify-center text-white shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white">
              {toast.title}
            </div>
            <div className="text-xs text-textSecondary">{toast.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

