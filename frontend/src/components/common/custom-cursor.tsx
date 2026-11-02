"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";

function subscribePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getPointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function getServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const isFinePointer = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    getServerSnapshot
  );

  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(pct);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("[data-clickable]"))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isFinePointer]);

  // Smooth lerp for ring
  useEffect(() => {
    if (!isFinePointer) return;
    let animId: number;
    const lerp = () => {
      setRingPos((prev) => ({
        x: prev.x + (cursorPos.x - prev.x) * 0.18,
        y: prev.y + (cursorPos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [cursorPos, isFinePointer]);

  return (
    <>
      {/* Top Scroll Progress Indicator */}
      <div
        id="scroll-progress"
        className="fixed top-0 left-0 h-[2.5px] z-[200] bg-gradient-to-r from-brandViolet via-brandCyan to-brandPink transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Desktop Custom Cursor */}
      {isFinePointer && (
        <>
          <div
            id="cursor-dot"
            className="fixed w-2 h-2 rounded-full bg-brandCyan pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: isHovering ? "scale(0)" : "scale(1)",
            }}
          />
          <div
            id="cursor-ring"
            className="fixed rounded-full border border-brandCyan/50 pointer-events-none z-[998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color,background-color] duration-200"
            style={{
              left: `${ringPos.x}px`,
              top: `${ringPos.y}px`,
              width: isHovering ? "48px" : "32px",
              height: isHovering ? "48px" : "32px",
              backgroundColor: isHovering ? "rgba(34, 211, 238, 0.1)" : "transparent",
              borderColor: isHovering ? "#22D3EE" : "rgba(34, 211, 238, 0.4)",
            }}
          />
        </>
      )}
    </>
  );
}
