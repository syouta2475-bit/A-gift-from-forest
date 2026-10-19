import React from "react";

export type ForestIconName =
  | "pine-mouse"
  | "slim-house"
  | "marche-booth"
  | "tree"
  | "pinecone"
  | "acorn"
  | "ribbon-wreath"
  | "logo-house"
  | "owl"
  | "simple-wreath"
  | "message"
  | "calendar"
  | "camera"
  | "map-pin"
  | "vine";

export type ForestIconProps = {
  name: ForestIconName;
  className?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
};

/**
 * 新ロゴ準拠・統一線画アイコン（全15種）
 * - 線色: #4E210F（深煎りブラウン）
 * - strokeWidth: 2.5（丸みのある線端 strokeLinecap="round" strokeLinejoin="round"）
 * - 塗りつぶしの丸い木の実アクセント
 */
export function ForestIcon({
  name,
  className = "w-6 h-6 inline-block shrink-0",
  size,
  color = "#4E210F",
  strokeWidth = 2.5,
}: ForestIconProps) {
  const style = size ? { width: size, height: size } : undefined;

  const baseSvgProps: React.SVGProps<SVGSVGElement> = {
    viewBox: "0 0 48 48",
    className,
    style,
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  switch (name) {
    /* 1. pine-mouse: 松ぼっくりのネズミ */
    case "pine-mouse":
      return (
        <svg {...baseSvgProps}>
          {/* 耳 2つ */}
          <circle cx="16" cy="14" r="7" />
          <circle cx="28" cy="14" r="5.5" />
          {/* 顔・鼻先 */}
          <path d="M 12 21 C 8 23, 6 27, 8 30 C 11 32, 16 30, 20 26" />
          <circle cx="7" cy="27" r="1.8" fill={color} stroke="none" />
          {/* 目 */}
          <circle cx="15" cy="23" r="1.5" fill={color} stroke="none" />
          {/* 松ぼっくりボディとうろこスリット */}
          <path d="M 18 24 C 24 20, 36 21, 40 28 C 43 35, 38 41, 30 42 C 22 42, 17 38, 16 33" />
          <path d="M 23 26 C 27 25, 32 28, 32 32" />
          <path d="M 26 33 C 30 32, 35 35, 35 38" />
          <path d="M 19 33 C 23 35, 26 39, 25 41" />
          {/* くるんとしたしっぽ */}
          <path d="M 40 33 C 44 32, 46 27, 44 24" />
          {/* 足元に小さな丸い木の実 */}
          <circle cx="36" cy="42" r="2.2" fill={color} stroke="none" />
        </svg>
      );

    /* 2. slim-house: 細長いお家（煙突・十字窓・アーチドア） */
    case "slim-house":
      return (
        <svg {...baseSvgProps}>
          {/* とんがり屋根 */}
          <path d="M 24 4 L 11 18 L 37 18 Z" />
          {/* 煙突 */}
          <path d="M 29 8 V 5 H 33 V 13" />
          {/* 壁 */}
          <path d="M 14 18 V 43 H 34 V 18" />
          {/* 2階の十字窓 */}
          <rect x="20" y="22" width="8" height="8" rx="1" />
          <path d="M 24 22 V 30 M 20 26 H 28" />
          {/* アーチドア */}
          <path d="M 20 43 V 37 C 20 35, 28 35, 28 37 V 43" />
          <circle cx="26" cy="39" r="0.9" fill={color} stroke="none" />
          {/* 屋根の上の小さな木の実 */}
          <circle cx="24" cy="3" r="1.8" fill={color} stroke="none" />
        </svg>
      );

    /* 3. marche-booth: マルシェ出店ブース（人なし） */
    case "marche-booth":
      return (
        <svg {...baseSvgProps}>
          {/* オーニングテント（スカラップ付きストライプ屋根） */}
          <path d="M 6 18 L 12 7 H 36 L 42 18 Z" />
          <path d="M 18 7 L 16 18 M 24 7 V 18 M 30 7 L 32 18" />
          <path d="M 6 18 C 9 21, 12 21, 15 18 C 18 21, 21 21, 24 18 C 27 21, 30 21, 33 18 C 36 21, 39 21, 42 18" />
          {/* 支柱 */}
          <path d="M 10 20 V 42 M 38 20 V 42" />
          {/* カウンターテーブル */}
          <path d="M 8 28 H 40 V 34 H 8 Z" />
          {/* カウンター上の木の実 */}
          <circle cx="16" cy="25" r="2" fill={color} stroke="none" />
          <circle cx="22" cy="24" r="2.5" fill={color} stroke="none" />
          {/* テーブルの足 */}
          <path d="M 14 34 V 42 M 34 34 V 42" />
          {/* 地面ライン */}
          <path d="M 4 42 H 44" />
        </svg>
      );

    /* 4. tree: 木の実のツリー */
    case "tree":
      return (
        <svg {...baseSvgProps}>
          {/* 3段の北欧もみの木 */}
          <path d="M 24 6 L 15 17 H 20 L 12 28 H 18 L 9 39 H 39 L 30 28 H 36 L 28 17 H 33 Z" />
          {/* 幹と地面 */}
          <path d="M 22 39 V 44 H 26 V 39" />
          <path d="M 14 44 H 34" />
          {/* 木の実のオーナメント丸 */}
          <circle cx="24" cy="14" r="2" fill={color} stroke="none" />
          <circle cx="19" cy="24" r="2" fill={color} stroke="none" />
          <circle cx="29" cy="25" r="2" fill={color} stroke="none" />
          <circle cx="17" cy="35" r="2.2" fill={color} stroke="none" />
          <circle cx="25" cy="33" r="2.2" fill={color} stroke="none" />
          <circle cx="32" cy="35" r="2.2" fill={color} stroke="none" />
        </svg>
      );

    /* 5. pinecone: 松ぼっくり単体 */
    case "pinecone":
      return (
        <svg {...baseSvgProps}>
          {/* 軸 */}
          <path d="M 24 4 V 9" />
          {/* 松ぼっくりの重なるうろこ輪郭 */}
          <path d="M 24 9 C 20 9, 13 14, 11 22 C 9 30, 13 38, 19 42 C 22 44, 26 44, 29 42 C 35 38, 39 30, 37 22 C 35 14, 28 9, 24 9 Z" />
          {/* うろこのスリット線 */}
          <path d="M 20 15 C 23 18, 26 18, 28 15" />
          <path d="M 16 22 C 22 25, 26 25, 32 22" />
          <path d="M 14 29 C 21 33, 27 33, 34 29" />
          <path d="M 18 36 C 22 39, 26 39, 30 36" />
          {/* 軸元の木の実 */}
          <circle cx="24" cy="5" r="1.5" fill={color} stroke="none" />
        </svg>
      );

    /* 6. acorn: どんぐり単体 */
    case "acorn":
      return (
        <svg {...baseSvgProps}>
          {/* 軸 */}
          <path d="M 24 4 C 23 7, 21 10, 24 13" />
          {/* 帽子（格子模様） */}
          <path d="M 10 17 C 12 11, 36 11, 38 17 C 39 20, 9 20, 10 17 Z" />
          <path d="M 16 13 L 22 19 M 23 12 L 29 19 M 30 13 L 35 18" />
          {/* ぷっくりした実 */}
          <path d="M 11 19 C 10 29, 17 41, 24 44 C 31 41, 38 29, 37 19" />
          {/* 実のハイライト線 */}
          <path d="M 17 24 C 15 29, 17 35, 20 38" />
          {/* てっぺんの木の実 */}
          <circle cx="24" cy="4" r="1.5" fill={color} stroke="none" />
        </svg>
      );

    /* 7. ribbon-wreath: リボン付き木の実リース */
    case "ribbon-wreath":
      return (
        <svg {...baseSvgProps}>
          {/* 二重リングリース */}
          <circle cx="24" cy="27" r="15" strokeDasharray="3 3" />
          <circle cx="24" cy="27" r="11" />
          {/* 散りばめられた木の実 */}
          <circle cx="11" cy="22" r="2.5" fill={color} stroke="none" />
          <circle cx="37" cy="22" r="2.5" fill={color} stroke="none" />
          <circle cx="15" cy="36" r="2.2" fill={color} stroke="none" />
          <circle cx="33" cy="36" r="2.2" fill={color} stroke="none" />
          <circle cx="24" cy="42" r="2.5" fill={color} stroke="none" />
          {/* 葉っぱ */}
          <path d="M 12 28 C 8 28, 9 32, 12 30" />
          <path d="M 36 28 C 40 28, 39 32, 36 30" />
          {/* トップのリボン結びと垂れ */}
          <circle cx="24" cy="13" r="2" fill={color} stroke="none" />
          <path d="M 22 13 C 16 8, 14 15, 22 14 Z" />
          <path d="M 26 13 C 32 8, 34 15, 26 14 Z" />
          <path d="M 22 15 C 19 20, 16 23, 15 24 M 26 15 C 29 20, 32 23, 33 24" />
        </svg>
      );

    /* 8. logo-house: ロゴのとんがり屋根の小屋 */
    case "logo-house":
      return (
        <svg {...baseSvgProps}>
          {/* とんがり三角屋根 */}
          <path d="M 24 5 L 8 22 H 40 Z" />
          {/* 壁 */}
          <path d="M 12 22 V 42 H 36 V 22" />
          {/* 煙突 */}
          <path d="M 28 8 V 4 H 32 V 13" />
          {/* 丸い明かり窓（木の実あしらい） */}
          <circle cx="24" cy="15" r="3" />
          {/* 扉 */}
          <path d="M 20 42 V 32 C 20 30, 28 30, 28 32 V 42" />
          <circle cx="26" cy="37" r="1" fill={color} stroke="none" />
          {/* 左右の小窓 */}
          <circle cx="16" cy="29" r="2" fill={color} stroke="none" />
          <circle cx="32" cy="29" r="2" fill={color} stroke="none" />
        </svg>
      );

    /* 9. owl: 森のフクロウ */
    case "owl":
      return (
        <svg {...baseSvgProps}>
          {/* 耳と頭と胴体 */}
          <path d="M 15 14 C 18 10, 21 14, 24 14 C 27 14, 30 10, 33 14 C 37 18, 38 25, 37 34 C 36 40, 31 43, 24 43 C 17 43, 12 40, 11 34 C 10 25, 11 18, 15 14 Z" />
          {/* 大きな目 2つ */}
          <circle cx="19" cy="21" r="4.5" />
          <circle cx="29" cy="21" r="4.5" />
          <circle cx="19" cy="21" r="2" fill={color} stroke="none" />
          <circle cx="29" cy="21" r="2" fill={color} stroke="none" />
          {/* くちばし */}
          <path d="M 23 23 L 24 27 L 25 23 Z" fill={color} />
          {/* 胸の羽模様 */}
          <path d="M 20 32 C 22 34, 26 34, 28 32 M 22 36 C 23 37, 25 37, 26 36" />
          {/* 止まり木 */}
          <path d="M 6 43 H 42" />
          <circle cx="9" cy="43" r="2" fill={color} stroke="none" />
        </svg>
      );

    /* 10. simple-wreath: シンプル木の実枠 */
    case "simple-wreath":
      return (
        <svg {...baseSvgProps}>
          <circle cx="24" cy="24" r="17" />
          {/* 四方の木の実と葉 */}
          <circle cx="24" cy="7" r="2.5" fill={color} stroke="none" />
          <circle cx="24" cy="41" r="2.5" fill={color} stroke="none" />
          <circle cx="7" cy="24" r="2.5" fill={color} stroke="none" />
          <circle cx="41" cy="24" r="2.5" fill={color} stroke="none" />
          <path d="M 22 5 C 18 3, 19 9, 23 7 M 26 5 C 30 3, 29 9, 25 7" />
          <path d="M 5 22 C 3 18, 9 19, 7 23 M 5 26 C 3 30, 9 29, 7 25" />
          <path d="M 43 22 C 45 18, 39 19, 41 23 M 43 26 C 45 30, 39 29, 41 25" />
          <path d="M 22 43 C 18 45, 19 39, 23 41 M 26 43 C 30 45, 29 39, 25 41" />
        </svg>
      );

    /* 11. message: 木の実と小枝の吹き出し（お客様の声用） */
    case "message":
      return (
        <svg {...baseSvgProps}>
          {/* 吹き出し輪郭 */}
          <path d="M 8 12 C 8 7, 14 6, 24 6 C 34 6, 40 7, 40 12 V 28 C 40 33, 34 34, 24 34 C 20 34, 17 35, 12 39 V 34 C 9 34, 8 32, 8 28 Z" />
          {/* 吹き出し内の3つの木の実ドット */}
          <circle cx="18" cy="20" r="2.2" fill={color} stroke="none" />
          <circle cx="24" cy="20" r="2.2" fill={color} stroke="none" />
          <circle cx="30" cy="20" r="2.2" fill={color} stroke="none" />
          {/* 吹き出し右上の双葉 */}
          <path d="M 37 6 C 41 3, 44 6, 42 10 C 39 10, 37 8, 37 6 Z" />
          <circle cx="43" cy="8" r="1.5" fill={color} stroke="none" />
        </svg>
      );

    /* 12. calendar: どんぐりマークのカレンダー */
    case "calendar":
      return (
        <svg {...baseSvgProps}>
          {/* 上の留め具リング 2つ */}
          <path d="M 15 4 V 10 M 33 4 V 10" />
          {/* カレンダー本体枠 */}
          <rect x="7" y="8" width="34" height="34" rx="4" />
          {/* ヘッダー線 */}
          <path d="M 7 17 H 41" />
          {/* 中央のどんぐりマーク */}
          <g transform="translate(19, 21) scale(0.6)">
            <path d="M 8 0 C 7 3, 5 6, 8 9" />
            <path d="M -4 12 C -2 6, 18 6, 20 12 Z" />
            <path d="M -3 13 C -4 20, 2 28, 8 30 C 14 28, 20 20, 19 13" />
          </g>
          {/* 日付ドット */}
          <circle cx="14" cy="24" r="1.5" fill={color} stroke="none" />
          <circle cx="34" cy="24" r="1.5" fill={color} stroke="none" />
          <circle cx="14" cy="33" r="1.5" fill={color} stroke="none" />
          <circle cx="34" cy="33" r="1.5" fill={color} stroke="none" />
        </svg>
      );

    /* 13. camera: 葉っぱあしらいのカメラ（写真選択用） */
    case "camera":
      return (
        <svg {...baseSvgProps}>
          {/* カメラ本体とファインダー突起 */}
          <path d="M 17 11 L 20 7 H 28 L 31 11 H 40 C 42 11, 43 12, 43 14 V 38 C 43 40, 42 41, 40 41 H 8 C 6 41, 5 40, 5 38 V 14 C 5 12, 6 11, 8 11 Z" />
          {/* レンズ */}
          <circle cx="24" cy="26" r="8" />
          <circle cx="24" cy="26" r="3" fill={color} stroke="none" />
          {/* フラッシュ/木の実アクセント */}
          <circle cx="36" cy="16" r="2" fill={color} stroke="none" />
          {/* カメラからちょこんと出た双葉 */}
          <path d="M 19 7 C 16 3, 13 5, 15 9" />
          <circle cx="14" cy="4" r="1.5" fill={color} stroke="none" />
        </svg>
      );

    /* 14. map-pin: 双葉付きマップピン */
    case "map-pin":
      return (
        <svg {...baseSvgProps}>
          {/* マップピン輪郭 */}
          <path d="M 24 43 C 24 43, 10 28, 10 18 C 10 10, 16 4, 24 4 C 32 4, 38 10, 38 18 C 38 28, 24 43, 24 43 Z" />
          {/* ピン中央のくり抜き穴（木の実） */}
          <circle cx="24" cy="18" r="4.5" />
          <circle cx="24" cy="18" r="2" fill={color} stroke="none" />
          {/* ピンの横に芽吹く双葉 */}
          <path d="M 36 12 C 42 10, 44 14, 40 17 C 38 17, 36 15, 36 12 Z" />
          <circle cx="43" cy="12" r="1.5" fill={color} stroke="none" />
        </svg>
      );

    /* 15. vine: くるんと巻くツルと木の実（装飾用） */
    case "vine":
      return (
        <svg {...baseSvgProps}>
          {/* くるんとしたS字のツル */}
          <path d="M 4 28 C 12 36, 18 12, 28 20 C 34 26, 38 32, 44 20" />
          <path d="M 44 20 C 46 16, 42 12, 38 15" />
          {/* 葉っぱ 3枚 */}
          <path d="M 14 26 C 10 22, 14 18, 17 21 C 17 24, 15 26, 14 26 Z" />
          <path d="M 26 17 C 28 11, 33 13, 31 18 C 29 19, 27 18, 26 17 Z" />
          <path d="M 36 26 C 36 32, 41 32, 40 27 C 39 25, 37 25, 36 26 Z" />
          {/* 木の実 3粒 */}
          <circle cx="9" cy="32" r="2.2" fill={color} stroke="none" />
          <circle cx="22" cy="15" r="2" fill={color} stroke="none" />
          <circle cx="42" cy="13" r="2.5" fill={color} stroke="none" />
        </svg>
      );

    default:
      return null;
  }
}
