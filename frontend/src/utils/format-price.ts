export type PriceInput = number | string;

/**
 * Định dạng số tiền sang định dạng VNĐ (Ví dụ: 34.490.000 ₫)
 */
export const formatPrice = (price: PriceInput): string => {
  return Number(price).toLocaleString("vi-VN") + " ₫";
};

export default formatPrice;
