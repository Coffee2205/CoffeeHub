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
        <PwaClient />
        {children}
      </body>
    </html>
  );
}
