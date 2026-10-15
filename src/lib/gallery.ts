import { loadGallery } from "@/lib/store";
import type { GalleryWork, GalleryItem } from "@/types";

/**
 * 公開用ギャラリー作品一覧を取得（論理削除された作品は除外、sortOrder 順）
 */
export async function getGalleryWorks(): Promise<GalleryWork[]> {
  try {
    const works = await loadGallery();
    return works
      .filter((w) => !w.isDeleted)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    console.error("[getGalleryWorks error]", err);
    return DEFAULT_GALLERY_WORKS;
  }
}

/** 初期フォールバック用作品データ */
const DEFAULT_GALLERY_WORKS: GalleryWork[] = [
  {
    id: "g-acorn",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    caption: "木の実のチャーム",
    title: "どんぐりのお守りストラップ",
    tag: "Natural Craft",
    sortOrder: 1,
    isDeleted: false,
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "g-woodcraft",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    caption: "木のおうちとおもちゃ",
    title: "北欧風小さな木のおうち",
    tag: "Wood Work",
    sortOrder: 2,
    isDeleted: false,
    createdAt: "2026-10-02T00:00:00.000Z",
  },
  {
    id: "g-pinecone",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    caption: "森の木の実リース",
    title: "松ぼっくりとドライフラワーのリース",
    tag: "Botanical Wreath",
    sortOrder: 3,
    isDeleted: false,
    createdAt: "2026-10-03T00:00:00.000Z",
  },
  {
    id: "g-stall",
    imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80",
    caption: "マルシェの風景",
    title: "木漏れ日の出店ブース",
    tag: "Marché Scene",
    sortOrder: 4,
    isDeleted: false,
    createdAt: "2026-10-04T00:00:00.000Z",
  },
];

/** 旧コンポーネント用 GALLERY_ITEMS 定数（互換性維持） */
export const GALLERY_ITEMS: GalleryItem[] = DEFAULT_GALLERY_WORKS.map((w) => ({
  id: w.id,
  src: w.imageUrl,
  alt: w.title || w.caption,
  caption: w.caption,
  tag: w.tag || "Handmade",
}));
