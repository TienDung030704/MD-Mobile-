"use client";

import React, { useState, useEffect } from "react";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setBarWidth(100), 50);
    const t2 = setTimeout(() => setLoading(false), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      id="loader-screen"
      className="fixed inset-0 z-[9999] bg-[var(--bg-primary)] flex flex-col items-center justify-center transition-opacity duration-700 select-none"
    >
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-aurora opacity-30 blur-2xl animate-pulse absolute" />
        <div className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center border border-white/20 shadow-2xl relative overflow-hidden">
          <svg className="w-11 h-11 text-white" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 4L35 32H27.5L20 17.5L12.5 32H5L20 4Z"
              fill="url(#loaderGrad)"
            />
            <circle cx="20" cy="27" r="3.5" fill="#D87D56" />
            <defs>
              <linearGradient
                id="loaderGrad"
                x1="5"
                y1="4"
                x2="35"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7F9C8B" />
                <stop offset="0.6" stopColor="#688574" />
                <stop offset="1" stopColor="#D87D56" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="font-display font-extrabold text-2xl tracking-[0.28em] text-white mb-3">
        MD MOBILE™
      </div>
      <div className="text-xs font-mono uppercase tracking-[0.2em] text-textSecondary mb-5">
        Khởi tạo không gian Flagship 3D...
      </div>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          id="loader-bar"
          className="h-full bg-aurora transition-all duration-700 ease-out"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}
