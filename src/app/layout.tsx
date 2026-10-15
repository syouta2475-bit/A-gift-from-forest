import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic, Klee_One, Caveat } from "next/font/google";
import { ChalkFilterDefs } from "@/components/ui/Icons";
import "./globals.css";

// 読みやすい丸ゴシック（本文や基本テキスト用）
const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

// 手仕事のぬくもりを伝える手書き教科書体（メイン見出し・タイトル用）
const kleeOne = Klee_One({
  variable: "--font-klee",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

// たまランド風のおしゃれな手書き欧文レタリング用
const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "森からのおくりもの | マルシェ出店情報・口コミ",
  description:
    "北軽井沢と川越を行き来しながら、森の恵みと木の実で作る手作りマルシェ「森からのおくりもの」公式サイトです。",
};

export const viewport: Viewport = {
  themeColor: "#fffaf0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${zenMaru.variable} ${kleeOne.variable} ${caveat.variable}`}>
      <body className="min-h-dvh antialiased">
        {/* 全SVG手描きイラスト用のチョーク質感フィルター */}
        <ChalkFilterDefs />
        {children}
      </body>
    </html>
  );
}
