/**
 * 森からのおくりもの - データ型定義
 */

/** microCMS / 画像共通型 */
export type CmsImage = {
  url: string;
  width?: number;
  height?: number;
};

/** 出店予定（Events）：カレンダー＆黒板の自動連動マスターデータ */
export type MarcheEvent = {
  id: string;
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD (1日開催は startDate と同日)
  time: string;             // 例: "10:00〜15:00"
  location: string;         // 会場名
  mapUrl?: string;          // GoogleマップURL（未入力時は自動生成）
  title: string;            // マルシェ名 / 黒板見出し
  description: string;      // 黒板のチョーク手書きエリアに表示するメイン紹介文
  highlights: string[];     // 黒板の「✽」箇条書きリスト (1〜4項目)
  publishAt: string | null; // 予約公開日時 (ISO8601 または null)
  createdAt: string;
  updatedAt: string;
};

/** 旧 Event 互換型（移行期間中のコンポーネントサポート） */
export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: CmsImage;
  content: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  description?: string;
  highlights?: string[];
};

/** 森のおくりものたち（Gallery） */
export type GalleryWork = {
  id: string;
  imageUrl: string;
  caption: string;          // ひとこと紹介文（必須）
  title?: string;            // 作品名（任意）
  tag?: string;              // カテゴリ/欧文サブタイトル
  sortOrder: number;         // 表示順（小さい順）
  isDeleted: boolean;        // 論理削除フラグ（true は公開サイト非表示）
  createdAt: string;
};

/** 旧 GalleryItem 互換型 */
export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: string;
  sortOrder?: number;
  isDeleted?: boolean;
};

/** お客様の声（Reviews）：個人情報完全非保持 */
export type Review = {
  id: string;
  nickname: string;
  userImage?: CmsImage;
  comment: string;
  ownerReply?: string;
  createdAt: string;
};

/** 黒板メッセージ履歴プリセット */
export type EmptyBoardPreset = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  savedAt?: string;
};

/** サイト設定（LINE通知、予定なし黒板メッセージ等） */
export type SiteSettings = {
  id: string;
  lineNotifyEnabled: boolean;
  emptyBoardTitle: string;
  emptyBoardMessage: string;
  emptyBoardHistory: EmptyBoardPreset[];
  updatedAt: string;
};
