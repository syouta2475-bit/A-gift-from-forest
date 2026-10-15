"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  MainLogo,
  PineconeIllust,
  NordicHouseIllust,
  ChalkWavyLine,
  PeekingHedgehogIllust,
  SproutBerryIllust,
  TwigArrowRightIllust,
} from "@/components/ui/Icons";

type HeroProps = {
  /** true になったら入場アニメーションを開始（Splash の退場に合わせる） */
  ready: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

export function Hero({ ready }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative min-h-[88dvh] flex items-center justify-center overflow-hidden bg-cream-50 pt-16 pb-20 sm:pt-24 sm:pb-28"
    >
      {/* ── 背景の透かしイラスト（たまランド風・絵本のような奥行き） ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-10 opacity-[0.08] select-none"
      >
        <NordicHouseIllust className="w-72 sm:w-96 h-auto" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/4 opacity-[0.08] select-none"
      >
        <PineconeIllust className="w-80 sm:w-[420px] h-auto" />
      </div>

      {/* ほのかな森の空気を感じさせる淡い光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-leaf-100/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-88 w-88 rounded-full bg-honey-200/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8 w-full z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="flex flex-col items-center text-center"
        >
          {/* 手書き欧文バッジ（Caveat） */}
          <motion.div variants={rise} className="flex items-center justify-center mb-3">
            <span className="font-caveat text-xl sm:text-2xl text-acorn-700 tracking-wide -rotate-2 inline-block bg-honey-200/50 px-4 py-0.5 rounded-full border border-honey-300/60">
              ~ Natural Craft & Marche ~
            </span>
          </motion.div>

          {/* メインロゴSVG（iPhone 393px でも画面中央に美しく鎮座） */}
          <motion.div
            variants={rise}
            className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[400px] mx-auto flex justify-center"
          >
            <h1 id="hero-title" className="sr-only">
              森からのおくりもの - A gift from the forest
            </h1>
            <MainLogo className="w-full h-auto drop-shadow-xs" />
          </motion.div>

          {/* 手描きの波線 */}
          <motion.div variants={rise} className="mt-3 text-acorn-400 flex justify-center">
            <ChalkWavyLine className="w-36 sm:w-44 h-3.5" />
          </motion.div>

          {/* キャッチコピー（Klee One の柔らかい日本語教科書体、文節でリズムよく改行） */}
          <motion.div
            variants={rise}
            className="mt-6 font-klee text-xl sm:text-2xl md:text-3xl font-semibold leading-[1.8] text-acorn-900"
          >
            <p>
              自然からいただいた恵みを、
              <br className="sm:hidden" />
              小さな物語にとじこめて。
            </p>
          </motion.div>

          {/* 説明文 */}
          <motion.p
            variants={rise}
            className="mt-4 text-base sm:text-lg leading-relaxed text-acorn-800/85 max-w-lg mx-auto font-sans"
          >
            北軽井沢と川越。ふたつの街の穏やかな風情に包まれながら、
            <br className="hidden sm:inline" />
            木の実や小枝をひとつひとつ紡ぐ、手作りのちいさなマルシェです。
          </motion.p>

          {/* アクションボタン（森の手仕事クラフトボタン） */}
          <motion.div
            variants={rise}
            className="mt-9 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-center gap-4 sm:gap-6"
          >
            {/* メインボタン：森の看板タグ風（フォレストグリーン＋破線ステッチ＋ひょっこりハリネズミ） */}
            <a
              id="hero-cta-next-event"
              href="#next-event"
              className="relative group inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#4E6E58] px-8 sm:px-10 py-3.5 text-cream-50 shadow-md transition-all duration-300 hover:bg-[#3F5A47] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F5A47]"
            >
              {/* 内側の破線ステッチ枠 */}
              <span
                className="absolute inset-1.5 rounded-xl border-[1.5px] border-dashed border-[#FAF7F2]/60 pointer-events-none"
                aria-hidden="true"
              />
              {/* ボタンテキスト（文字のみでスッキリ配置） */}
              <span className="font-sans font-bold text-base sm:text-lg text-[#FAF7F2] tracking-wider relative z-10">
                次の出店日を見る
              </span>
              {/* 右端からひょっこり顔を覗かせるハリネズミ */}
              <span
                className="absolute -right-3 -bottom-2 sm:-right-4 sm:-bottom-2.5 pointer-events-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 z-20"
                aria-hidden="true"
              >
                <PeekingHedgehogIllust className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-xs" />
              </span>
            </a>

            {/* サブボタン：生成り背景＋手描きブラウン枠＋双葉木の実＋小枝矢印 */}
            <a
              id="hero-cta-concept"
              href="#concept"
              className="relative group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#FAF7F2] px-7 sm:px-9 py-3.5 border-2 border-[#5A4030] shadow-sm transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A4030]"
            >
              {/* 左上にちょこんと重なる双葉と木の実のチョークイラスト */}
              <span
                className="absolute -left-2.5 -top-3.5 sm:-left-3 sm:-top-4 pointer-events-none transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 z-20"
                aria-hidden="true"
              >
                <SproutBerryIllust className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs" />
              </span>
              {/* ボタンテキスト */}
              <span className="font-sans font-bold text-base sm:text-lg text-[#5A4030] tracking-wide">
                私たちの想い
              </span>
              <span className="font-caveat text-xl sm:text-2xl font-bold text-acorn-600 -rotate-2">
                Story
              </span>
              {/* 小枝と葉っぱの手描き風矢印SVG */}
              <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
                <TwigArrowRightIllust className="w-5 h-4" />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* スクロールの案内 */}
      <motion.a
        id="hero-scroll-hint"
        href="#concept"
        aria-label="下へスクロール"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 font-caveat text-base text-acorn-500 hover:text-acorn-800 transition-colors"
      >
        <span className="tracking-widest">scroll</span>
        <motion.span
          aria-hidden="true"
          animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="block h-5 w-px bg-acorn-300"
        />
      </motion.a>
    </section>
  );
}
