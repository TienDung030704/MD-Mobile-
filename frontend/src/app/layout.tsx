import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/constants";
import { Providers } from "@/providers";
import { ToastBox } from "@/components/ui/toast-box";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — Định Chuẩn Công Nghệ Tương Lai | Flagship Store Chính Hãng`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: "Trải nghiệm mua sắm điện thoại cao cấp, flagship AI hàng đầu cùng hệ sinh thái dịch vụ VIP: Thu cũ trợ giá 5 triệu, Trả góp 0%, Bảo hành 1 đổi 1 12 tháng.",
  keywords: [
    "điện thoại chính hãng",
    "iPhone 16 Pro Max",
    "Samsung Galaxy S25 Ultra",
    "MD Mobile Flagship",
    "MD Mobile",
    "thu cũ đổi mới",
    "trả góp 0%",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} — Flagship Store Chính Hãng`,
    description: "Hệ thống Flagship Store công nghệ cao cấp hàng đầu Việt Nam.",
    siteName: SITE_CONFIG.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`dark scroll-smooth ${plusJakartaSans.variable} ${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bgDark text-textPrimary font-sans antialiased selection:bg-brandViolet selection:text-white relative">
        <Providers>
          {children}
          <ToastBox />
        </Providers>
      </body>
    </html>
  );
}
