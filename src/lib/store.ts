import fs from "fs/promises";
import path from "path";
import type { MarcheEvent, GalleryWork, Review } from "@/types";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

/** ディレクトリと初期データの存在を保証（ローカルフォールバック用） */
async function ensureInit() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // 1. 出店予定（Events）の初期データ
  try {
    await fs.access(EVENTS_FILE);
  } catch {
    const initialEvents: MarcheEvent[] = [
      {
        id: "event-2026-10-autumn",
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
        id: "event-2026-11-winter",
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
        id: "event-2026-12-xmas",
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
    await fs.writeFile(EVENTS_FILE, JSON.stringify(initialEvents, null, 2), "utf-8");
  }

  // 2. 作品（Gallery）の初期データ
  try {
    await fs.access(GALLERY_FILE);
  } catch {
    const initialGallery: GalleryWork[] = [
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
    await fs.writeFile(GALLERY_FILE, JSON.stringify(initialGallery, null, 2), "utf-8");
  }

  // 3. 口コミ（Reviews）の初期データ
  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    const initialReviews: Review[] = [
      {
        id: "rev-1",
        nickname: "さくらさん",
        comment:
          "どんぐりのストラップ、とってもかわいかったです！色合いがやさしくて、バッグにつけて毎日出かけています。",
        ownerReply: "ありがとうございます。お出かけのお供になれたらうれしいです。",
        createdAt: "2026-09-28T10:00:00+09:00",
        userImage: { url: "/images/goods-acorn.png", width: 800, height: 800 },
      },
      {
        id: "rev-2",
        nickname: "みどりのおばあちゃん",
        comment: "文字が大きくて見やすいサイトでした。次の出店日もすぐわかって助かります。",
        ownerReply: "うれしいお言葉をありがとうございます。見やすさを大切に更新しています。",
        createdAt: "2026-10-02T14:30:00+09:00",
      },
      {
        id: "rev-3",
        nickname: "コグマ",
        comment: "松ぼっくりのリースをプレゼントに。手作り感が伝わって、にこにこ顔で受け取ってもらえました。",
        ownerReply: "大切な贈り物に選んでいただき、本当にありがとうございました！",
        createdAt: "2026-10-08T09:15:00+09:00",
        userImage: { url: "/images/goods-pinecone.png", width: 800, height: 800 },
      },
    ];
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(initialReviews, null, 2), "utf-8");
  }
}

/* ============================================================
   Events 操作（Supabase ＆ ローカル JSON ハイブリッド）
   ============================================================ */
export async function loadEvents(): Promise<MarcheEvent[]> {
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
          id: row.id,
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

  // ローカル JSON フォールバック
  await ensureInit();
  const raw = await fs.readFile(EVENTS_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function saveEvents(events: MarcheEvent[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const rows = events.map((e) => ({
        id: e.id.includes("-") && e.id.length === 36 ? e.id : undefined, // UUIDのみ渡す
        start_date: e.startDate,
        end_date: e.endDate,
        time: e.time,
        location: e.location,
        map_url: e.mapUrl || null,
        title: e.title,
        description: e.description,
        highlights: e.highlights || [],
        publish_at: e.publishAt || null,
      }));

      // 全件upsert
      const { error } = await supabase.from("events").upsert(rows);
      if (error) console.error("[Supabase saveEvents error]", error);
    } catch (err) {
      console.error("[Supabase saveEvents exception]", err);
    }
  }

  // ローカル JSON も常に同期
  await ensureInit();
  await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8");
}

/* ============================================================
   Gallery 操作（Supabase ＆ ローカル JSON ハイブリッド）
   ============================================================ */
export async function loadGallery(): Promise<GalleryWork[]> {
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
          id: row.id,
          imageUrl: row.image_url,
          title: row.title || undefined,
          caption: row.caption,
          sortOrder: row.sort_order ?? 0,
          isDeleted: Boolean(row.is_deleted),
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      console.error("[Supabase loadGallery exception]", err);
    }
  }

  await ensureInit();
  const raw = await fs.readFile(GALLERY_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function saveGallery(works: GalleryWork[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const rows = works.map((w) => ({
        id: w.id.includes("-") && w.id.length === 36 ? w.id : undefined,
        image_url: w.imageUrl,
        title: w.title || null,
        caption: w.caption,
        sort_order: w.sortOrder,
        is_deleted: w.isDeleted,
      }));
      const { error } = await supabase.from("gallery_items").upsert(rows);
      if (error) console.error("[Supabase saveGallery error]", error);
    } catch (err) {
      console.error("[Supabase saveGallery exception]", err);
    }
  }

  await ensureInit();
  await fs.writeFile(GALLERY_FILE, JSON.stringify(works, null, 2), "utf-8");
}

/* ============================================================
   Reviews 操作（Supabase ＆ ローカル JSON ハイブリッド）
   ============================================================ */
export async function loadReviews(): Promise<Review[]> {
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
          id: row.id,
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

  await ensureInit();
  const raw = await fs.readFile(REVIEWS_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const rows = reviews.map((r) => ({
        id: r.id.includes("-") && r.id.length === 36 ? r.id : undefined,
        nickname: r.nickname,
        comment: r.comment,
        image_url: r.userImage?.url || null,
        reply: r.ownerReply || null,
        created_at: r.createdAt,
      }));
      const { error } = await supabase.from("reviews").upsert(rows);
      if (error) console.error("[Supabase saveReviews error]", error);
    } catch (err) {
      console.error("[Supabase saveReviews exception]", err);
    }
  }

  await ensureInit();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}
