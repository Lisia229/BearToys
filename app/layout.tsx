import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "熊賀勝 Bear Toys",
  description:
    "熊賀勝線上玩具店，提供盲盒、小賞、預購商品、Line Pay 結帳、7-11 取貨與宅配送達。",
  openGraph: {
    title: "熊賀勝 Bear Toys",
    description:
      "高雄熊賀勝線上玩具店，盲盒、小賞、會員中心與商家後台一次完成。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
