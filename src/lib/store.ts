import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import type { MarcheEvent, GalleryWork, Review } from "@/types";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * 有効な文字列IDであることを保証（空文字やnull・undefinedなら crypto.randomUUID() を生成）
 * DB の id カラムが text 型になったため、既存の ID（UUID形式または英数字記号）をそのまま保持します。
 * 絶対に null や undefined を返しません。
 */
export function safeId(rawId?: string | null): string {
  if (rawId && typeof rawId === "string") {
    const trimmed = rawId.trim();
    if (trimmed !== "") {
      return trimmed;
    }
  }
  return crypto.randomUUID();
}

/** 後方互換用エイリアス */
export const safeUuid = safeId;
export const ensureUuid = safeId;

/* ============================================================
   初期静的データ（インメモリ・安全なフォールバック用）
   ============================================================ */
const INITIAL_EVENTS: MarcheEvent[] = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    startDate: "2026-10-24",
    endDate: "2026-10-25",
    time: "10:00〜16:00",
    location: "さくら公園 中央広場（青空マルシェ）",
    mapUrl: "",
    title: "もりのマルシェ 秋のどんぐりまつり",
    description:
      "木漏れ日の心地よい季節になりました。工房でひとつずつ仕立てた、ほっこり温まる秋の新作をお届けします。",
    highlights: [
      "小さなお子さまにも人気の木のおもちゃ",
      "秋の新作・どんぐりお守りチャーム",
      "松ぼっくりの季節のミニリース",
      "お買い物のお客様にちいさな木の実プレゼント",
    ],
    publishAt: null,
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "b2222222-2222-4222-8222-222222222222",
    startDate: "2026-11-14",
    endDate: "2026-11-14",
    time: "10:30〜15:30",
    location: "みどり駅前 ふれあい広場",
    mapUrl: "",
    title: "ハンドメイド市 冬のあったかフェア",
    description:
      "冬の暮らしを温かく彩る木工小物をたくさんご用意しています。温かい服装でお散歩がてら遊びにいらしてください。",
    highlights: [
      "北軽井沢の白樺小枝で作ったオーナメント",
      "冬の森の木の実ブローチ",
    ],
    publishAt: null,
    createdAt: "2026-10-05T10:00:00.000Z",
    updatedAt: "2026-10-05T10:00:00.000Z",
  },
  {
    id: "c3333333-3333-4333-8333-333333333333",
    startDate: "2026-12-19",
    endDate: "2026-12-20",
    time: "11:00〜16:30",
    location: "川越 蔵の街 クラフトビレッジ",
    mapUrl: "",
    title: "森のクリスマス手作りマーケット",
    description:
      "今年最後の出店です。松ぼっくりツリーや特別なギフトラッピングをご用意してお待ちしております。",
    highlights: [
      "クリスマス限定・松ぼっくりツリー",
      "自然木のちいさなキャンドルホルダー",
      "大切な方への手作りギフトラッピング無料",
    ],
    publishAt: null,
    createdAt: "2026-10-10T12:00:00.000Z",
    updatedAt: "2026-10-10T12:00:00.000Z",
  },
];

const INITIAL_GALLERY: GalleryWork[] = [
  {
    id: "d4444444-4444-4444-8444-444444444444",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    caption: "木の実のチャーム",
    title: "どんぐりのお守りストラップ",
    tag: "Natural Craft",
    sortOrder: 1,
    isDeleted: false,
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "e5555555-5555-4555-8555-555555555555",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    caption: "木のおうちとおもちゃ",
    title: "北欧風小さな木のおうち",
    tag: "Wood Work",
    sortOrder: 2,
    isDeleted: false,
    createdAt: "2026-10-02T00:00:00.000Z",
  },
  {
    id: "f6666666-6666-4666-8666-666666666666",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    caption: "森の木の実リース",
    title: "松ぼっくりとドライフラワーのリース",
    tag: "Botanical Wreath",
    sortOrder: 3,
    isDeleted: false,
    createdAt: "2026-10-03T00:00:00.000Z",
  },
  {
    id: "a7777777-7777-4777-8777-777777777777",
    imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80",
    caption: "マルシェの風景",
    title: "木漏れ日の出店ブース",
    tag: "Marché Scene",
    sortOrder: 4,
    isDeleted: false,
    createdAt: "2026-10-04T00:00:00.000Z",
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: "b8888888-8888-4888-8888-888888888888",
    nickname: "さくらさん",
    comment:
      "どんぐりのストラップ、とってもかわいかったです！色合いがやさしくて、バッグにつけて毎日出かけています。",
    ownerReply: "ありがとうございます。お出かけのお供になれたらうれしいです。",
    createdAt: "2026-09-28T10:00:00+09:00",
    userImage: { url: "/images/goods-acorn.png", width: 800, height: 800 },
  },
  {
    id: "c9999999-9999-4999-8999-999999999999",
    nickname: "みどりのおばあちゃん",
    comment: "文字が大きくて見やすいサイトでした。次の出店日もすぐわかって助かります。",
    ownerReply: "うれしいお言葉をありがとうございます。見やすさを大切に更新しています。",
    createdAt: "2026-10-02T14:30:00+09:00",
  },
  {
    id: "daaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    nickname: "コグマ",
    comment: "松ぼっくりのリースをプレゼントに。手作り感が伝わって、にこにこ顔で受け取ってもらえました。",
    ownerReply: "大切な贈り物に選んでいただき、本当にありがとうございました！",
    createdAt: "2026-10-08T09:15:00+09:00",
    userImage: { url: "/images/goods-pinecone.png", width: 800, height: 800 },
  },
];

/* ============================================================
   ローカルファイル安全読み書き（EROFS対策）
   ============================================================ */

/** 安全なローカルJSON読み取り（ファイル書き込みは一切行わない） */
async function readLocalJsonSafely<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * 安全なローカルJSON書き込み
 * ※Supabase設定環境またはVercel本番環境（/var/task: EROFS read-only）では絶対に書き込みを行いません。
 */
async function writeLocalJsonSafely(filePath: string, data: unknown): Promise<void> {
  if (isSupabaseConfigured() || process.env.VERCEL) {
    return;
  }
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`[Local store write skipped] Cannot write to ${filePath}:`, err);
  }
}

/* ============================================================
   Events 操作（Supabase ＆ ローカル JSON ハイブリッド）
   ============================================================ */
export async function loadEvents(): Promise<MarcheEvent[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("start_date", { ascending: true });

        if (error) {
          console.error("[Supabase loadEvents error]", error);
        } else if (data) {
          return data.map((row) => ({
            id: safeUuid(row.id),
            startDate: row.start_date,
            endDate: row.end_date,
            time: row.time,
            location: row.location,
            mapUrl: row.map_url || undefined,
            title: row.title,
            description: row.description,
            highlights: Array.isArray(row.highlights) ? row.highlights : [],
            publishAt: row.publish_at || null,
            createdAt: row.created_at,
            updatedAt: row.created_at,
          }));
        }
      } catch (err) {
        console.error("[Supabase loadEvents exception]", err);
      }
    }
    return INITIAL_EVENTS;
  }

  // ローカル開発環境（Supabase未設定時）のみJSONファイルから安全に読み取り
  return readLocalJsonSafely(EVENTS_FILE, INITIAL_EVENTS);
}

export async function saveEvents(events: MarcheEvent[]): Promise<void> {
  // すべてのイベントに有効なUUIDが割り当てられていることを保証（nullやundefinedを100%排除）
  const rows = events.map((e) => {
    const validId = safeUuid(e.id);
    e.id = validId;
    return {
      id: validId,
      start_date: e.startDate,
      end_date: e.endDate,
      time: e.time,
      location: e.location,
      map_url: e.mapUrl || null,
      title: e.title,
      description: e.description,
      highlights: Array.isArray(e.highlights) ? e.highlights : [],
      publish_at: e.publishAt || null,
    };
  });

  // isSupabaseConfigured() が true の場合は、Supabaseへの保存のみを行い、ローカルファイルへの書き込みを完全にスキップ
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("events").upsert(rows);
      if (error) {
        console.error("[Supabase saveEvents error]", error);
        throw new Error(`Supabase saveEvents failed: ${error.message}`);
      }
    }
    return;
  }

  // ローカル開発環境（Supabase未設定時）のみJSONファイルへ書き込み
  await writeLocalJsonSafely(EVENTS_FILE, events);
}

export async function deleteEventFromSupabase(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const cleanId = String(id).trim();
        const { error } = await supabase.from("events").delete().eq("id", cleanId);
        if (error) console.error("[Supabase deleteEvent error]", error);
      } catch (err) {
        console.error("[Supabase deleteEvent exception]", err);
      }
    }
  }
}

/* ============================================================
   Gallery 操作（Supabase ＆ ローカル JSON ハイブリッド）
   ============================================================ */
export async function loadGallery(): Promise<GalleryWork[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("gallery_items")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) {
          console.error("[Supabase loadGallery error]", error);
        } else if (data) {
          return data.map((row) => ({
            id: safeUuid(row.id),
            imageUrl: row.image_url,
            title: row.title || undefined,
            caption: row.caption,
            sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
            isDeleted: Boolean(row.is_deleted),
            createdAt: row.created_at,
          }));
        }
      } catch (err) {
        console.error("[Supabase loadGallery exception]", err);
      }
    }
    return INITIAL_GALLERY;
  }

  return readLocalJsonSafely(GALLERY_FILE, INITIAL_GALLERY);
}

export async function saveGallery(works: GalleryWork[]): Promise<void> {
  // 安全装置：表示状態（!isDeleted）の作品が0件になる場合は保存をブロック
  const visibleCount = works.filter((w) => !w.isDeleted).length;
  if (works.length > 0 && visibleCount === 0) {
    throw new Error("少なくとも1つの作品は表示状態にする必要があります（全件非表示はできません）。");
  }

  const rows = works.map((w) => {
    const validId = safeId(w.id);
    w.id = validId;
    return {
      id: validId,
      image_url: w.imageUrl,
      title: w.title || null,
      caption: w.caption,
      sort_order: typeof w.sortOrder === "number" ? w.sortOrder : 0,
      is_deleted: Boolean(w.isDeleted),
    };
  });

  // isSupabaseConfigured() が true の場合は、Supabaseへの保存のみを行い、ローカルファイルへの書き込みを完全にスキップ
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("gallery_items").upsert(rows);
      if (error) {
        console.error("[Supabase saveGallery error]", error);
        throw new Error(`Supabase saveGallery failed: ${error.message}`);
      }
    }
    return;
  }

  await writeLocalJsonSafely(GALLERY_FILE, works);
}

export async function deleteGalleryFromSupabase(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const cleanId = String(id).trim();
        const { error } = await supabase.from("gallery_items").delete().eq("id", cleanId);
        if (error) console.error("[Supabase deleteGallery error]", error);
      } catch (err) {
        console.error("[Supabase deleteGallery exception]", err);
      }
    }
  }
}

/* ============================================================
   Reviews 操作（Supabase ＆ ローカル JSON ハイブリッド）
   ============================================================ */
export async function loadReviews(): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[Supabase loadReviews error]", error);
        } else if (data) {
          return data.map((row) => ({
            id: safeUuid(row.id),
            nickname: row.nickname,
            comment: row.comment,
            ownerReply: row.reply || undefined,
            userImage: row.image_url ? { url: row.image_url, width: 800, height: 800 } : undefined,
            createdAt: row.created_at,
          }));
        }
      } catch (err) {
        console.error("[Supabase loadReviews exception]", err);
      }
    }
    return INITIAL_REVIEWS;
  }

  return readLocalJsonSafely(REVIEWS_FILE, INITIAL_REVIEWS);
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  // すべての口コミに有効なUUIDが割り当てられていることを保証（nullやundefinedを100%排除）
  const rows = reviews.map((r) => {
    const validId = safeId(r.id);
    r.id = validId;
    return {
      id: validId,
      nickname: r.nickname,
      comment: r.comment,
      image_url: r.userImage?.url || null,
      reply: r.ownerReply || null,
      created_at: r.createdAt || new Date().toISOString(),
    };
  });

  // isSupabaseConfigured() が true の場合は、Supabaseへの保存のみを行い、ローカルファイルへの書き込みを完全にスキップ
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("reviews").upsert(rows);
      if (error) {
        console.error("[Supabase saveReviews error]", error);
        throw new Error(`Supabase saveReviews failed: ${error.message}`);
      }
    }
    return;
  }

  // ローカル開発環境（Supabase未設定時）のみJSONファイルへ書き込み
  await writeLocalJsonSafely(REVIEWS_FILE, reviews);
}

export async function deleteReviewFromSupabase(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const cleanId = String(id).trim();
        const { error } = await supabase.from("reviews").delete().eq("id", cleanId);
        if (error) console.error("[Supabase deleteReview error]", error);
      } catch (err) {
        console.error("[Supabase deleteReview exception]", err);
      }
    }
  }
}
