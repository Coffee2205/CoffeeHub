import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { PwaClient } from "@/features/pwa/pwa-client";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "CV và portfolio công khai được quản lý từ nội dung đã xuất bản.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "CoffeeHub",
    statusBarStyle: "black-translucent",
  },
};
export const viewport = { themeColor: "#050b18" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-sm bg-primary-control px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
        >
          Bỏ qua đến nội dung chính
        </a>
        <PwaClient />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
