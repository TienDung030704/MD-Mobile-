import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "danger" | "success" | "outline";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-brandClay text-white",
  secondary: "bg-brandSage/15 text-brandSage dark:bg-brandSage/25 dark:text-brandCyan",
  danger: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  outline: "border border-zinc-300 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
