"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { WreathIllust, ChalkWavyLine } from "@/components/ui/Icons";
import type { GalleryWork } from "@/types";

const FALLBACK_ITEMS = [
  {
    id: "g-acorn",
    src: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    alt: "どんぐりのお守りストラップ",
    caption: "木の実のチャーム",
    tag: "Natural Craft",
  },
  {
    id: "g-woodcraft",
    src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    alt: "北欧風小さな木のおうち",
    caption: "木のおうちとおもちゃ",
    tag: "Wood Work",
  },
  {
    id: "g-pinecone",
    src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    alt: "松ぼっくりとドライフラワーのリース",
    caption: "森の木の実リース",
    tag: "Botanical Wreath",
  },
  {
    id: "g-stall",
    src: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80",
    alt: "木漏れ日の出店ブース",
    caption: "マルシェの風景",
    tag: "Marché Scene",
  },
];

type GalleryProps = {
  works?: GalleryWork[];
};

/**
 * Gallery：横スクロールのモダンカルーセル。
 * たまランド風の手描きレタリングと贅沢なリースあしらいで、温かいクラフト感を表現。
 * 管理画面からの追加・並び替え・論理削除と完全連動。
 */
export function Gallery({ works }: GalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  const items = works && works.length > 0
    ? works.map((w) => ({
        id: w.id,
        src: w.imageUrl,
        alt: w.title || w.caption,
        caption: w.caption,
        tag: w.tag || "Natural Craft",
      }))
    : FALLBACK_ITEMS;

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="relative overflow-hidden bg-cream-50 py-24 sm:py-32"
    >
      {/* ── 背景の透かしリース（たまランド風） ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 -bottom-10 opacity-[0.08] select-none"
      >
        <WreathIllust className="w-80 sm:w-96 h-auto" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* 見出しブロック */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <WreathIllust className="w-14 sm:w-16 h-auto drop-shadow-xs" />
              <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-2">
                Handmade Works
              </span>
            </div>
            <h2
              id="gallery-title"
              className="mt-1 font-klee text-3xl sm:text-4xl lg:text-5xl font-semibold text-acorn-900"
            >
              森のおくりものたち
            </h2>
            <ChalkWavyLine className="w-36 h-3 text-acorn-400 mt-2" />
            <p className="mt-3 text-base sm:text-lg text-acorn-800/85 max-w-lg">
              季節の木の実や自然木から生まれた、ひとつひとつ表情の違う作品たちです。
            </p>
          </Reveal>

          {/* 前へ／次へナビゲーションボタン */}
          <Reveal delay={0.1} className="hidden md:flex items-center gap-3">
            <button
              type="button"
              id="gallery-prev"
              onClick={() => scrollByCard(-1)}
              aria-label="前の写真へ"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-acorn-200 bg-white text-lg font-bold text-acorn-700 shadow-xs transition hover:bg-cream-100 hover:border-acorn-400 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              id="gallery-next"
              onClick={() => scrollByCard(1)}
              aria-label="次の写真へ"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-600 text-lg font-bold text-cream-50 shadow-xs transition hover:bg-forest-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
            >
              <span aria-hidden="true">→</span>
            </button>
          </Reveal>
        </div>

        {/* カルーセルリスト */}
        <ul
          ref={trackRef}
          aria-label="作品の写真（左右にスライドできます）"
          tabIndex={0}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pt-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acorn-500 -mx-5 px-5 sm:-mx-8 sm:px-8"
        >
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className="w-[82vw] max-w-[320px] sm:max-w-[360px] shrink-0 snap-center group"
            >
              <figure className="flex flex-col">
                {/* 洗練された角丸の写真フレーム */}
                <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-stone-100 shadow-xs border border-stone-200/60">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 82vw, 360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-3.5 px-1">
                  <h3 className="font-klee text-lg sm:text-xl font-semibold text-acorn-900 group-hover:text-forest-600 transition-colors">
                    {item.caption}
                  </h3>
                  <p className="text-xs sm:text-sm text-acorn-700/75 mt-0.5 line-clamp-1">
                    {item.alt}
                  </p>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>

        {/* スマホ用コントロール */}
        <div className="mt-6 flex md:hidden justify-center gap-3">
          <button
            type="button"
            id="gallery-prev-mobile"
            onClick={() => scrollByCard(-1)}
            aria-label="前の写真へ"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-acorn-200 bg-white text-base font-bold text-acorn-700 shadow-xs active:scale-95"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            id="gallery-next-mobile"
            onClick={() => scrollByCard(1)}
            aria-label="次の写真へ"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-600 text-base font-bold text-cream-50 shadow-xs active:scale-95"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
