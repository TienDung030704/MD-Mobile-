import { z } from "zod";

/**
 * Biểu thức chính quy kiểm tra số điện thoại Việt Nam (10 chữ số)
 */
export const vnPhoneRegex = /^(0|\+84)[0-9]{9,10}$/;

/**
 * Schema xác thực số điện thoại
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập số điện thoại.")
  .refine(
    (val) => vnPhoneRegex.test(val.replace(/\s+/g, "")),
    "Số điện thoại không hợp lệ (cần 10 chữ số)."
  );

/**
 * Schema xác thực mật khẩu
 */
export const passwordSchema = z
  .string()
  .min(1, "Vui lòng nhập mật khẩu.")
  .min(6, "Mật khẩu không chính xác (tối thiểu 6 ký tự).");

/**
 * Schema đăng nhập đơn giản (chỉ dùng SĐT và Mật khẩu)
 */
export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema form khôi phục mật khẩu (chỉ dùng SĐT)
 */
export const forgotPasswordFormSchema = z.object({
  forgotPhone: phoneSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

/**
 * Kiểm tra nhanh số điện thoại hợp lệ (để hiển thị dấu check xanh Mint)
 */
export function isPhoneValid(value: string): boolean {
  if (!value.trim()) return false;
  return phoneSchema.safeParse(value).success;
}
