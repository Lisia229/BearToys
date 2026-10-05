import type { Metadata } from "next";
import { Montserrat, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTc = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(basePath ? "https://lisia229.github.io" : "https://bear-toys-shop.h200022923.chatgpt.site"),
  title: "熊賀勝 Bear Toys",
  description:
    "熊賀勝線上玩具店，提供盲盒、小賞、預購商品、Line Pay 結帳、7-11 取貨與宅配送達。",
  openGraph: {
    title: "熊賀勝 Bear Toys",
    description:
      "高雄熊賀勝線上玩具店，盲盒、小賞、會員中心與商家後台一次完成。",
    images: [
      {
        url: `${basePath}/og.png`,
        width: 1568,
        height: 1003,
        alt: "熊賀勝 Bear Toys 品牌分享圖",
      },
    ],
    locale: "zh_TW",
    siteName: "熊賀勝 Bear Toys",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "熊賀勝 Bear Toys",
    description:
      "盲盒、小賞、Line Pay 結帳、7-11 取貨與宅配服務。",
    images: [`${basePath}/og.png`],
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "any" },
      { url: `${basePath}/favicon.svg`, type: "image/svg+xml" },
    ],
    shortcut: `${basePath}/favicon.ico`,
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
        className={`${notoSansTc.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
