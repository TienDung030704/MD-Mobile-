/**
 * Utility helper functions for MD Mobile
 */

/**
 * Combines class names conditionally.
 * When clsx and tailwind-merge are installed, this can be swapped with twMerge(clsx(inputs)).
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format number as currency (default: VND)
 * Example: 24990000 -> "24.990.000 ₫"
 */
export function formatCurrency(
  amount: number,
  currency: string = "VND",
  locale: string = "vi-VN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date string or Date object to localized string
 */
export function formatDate(
  date: string | number | Date,
  locale: string = "vi-VN"
): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Truncate a long string to a specific length with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}
