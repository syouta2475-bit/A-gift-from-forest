import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 注: create-next-app 既定の cacheComponents / partialPrefetching は外しています。
  // 「次の出店日」を現在日時から算出するため、Date を使うサーバーコンポーネントと相性が悪いためです。
  // CMS 連携後は ISR（revalidate）で更新します。
  images: {
    remotePatterns: [
      // microCMS の画像配信ドメイン（フェーズ3以降のCMS連携で使用）
      { protocol: "https", hostname: "images.microcms-assets.io" },
      // リアル写真用の Unsplash ドメイン
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
