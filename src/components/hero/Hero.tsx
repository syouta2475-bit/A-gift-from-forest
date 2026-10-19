"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MainLogo, ChalkWavyLine } from "@/components/ui/Icons";
import { MozSilhouette } from "@/components/ui/MozSilhouette";
import { ForestIcon } from "@/components/ui/ForestIcon";

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
  const [logoLoadError, setLogoLoadError] = useState(false);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-cream-50 pt-16 pb-20 sm:pt-24 sm:pb-28"
    >
      {/* ── 背景のMOZ風2Dベタ塗り大型シルエット（左上: 大判リース、右下: とまり木フクロウ） ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-12 sm:-left-10 sm:-top-8 select-none z-0"
      >
        <MozSilhouette
          variant="wreath"
          className="w-72 sm:w-96 md:w-[420px] h-auto opacity-40 -rotate-6"
          color="#C8AD90"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 bottom-6 sm:-right-8 sm:bottom-10 select-none z-0"
      >
        <MozSilhouette
          variant="owl"
          className="w-64 sm:w-80 md:w-[360px] h-auto opacity-40 rotate-3"
          color="#C8AD90"
        />
      </div>

      {/* ほのかな森の空気を感じさせる淡い環境光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-leaf-100/40 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-88 w-88 rounded-full bg-honey-200/25 blur-3xl z-0"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8 w-full z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          className="flex flex-col items-center text-center"
        >
          {/* 手書き欧文バッジ（Caveat） */}
          <motion.div variants={rise} className="flex items-center justify-center mb-2 sm:mb-3">
            <span className="font-caveat text-xl sm:text-2xl text-acorn-700 tracking-wide -rotate-2 inline-block bg-honey-200/50 px-4 py-0.5 rounded-full border border-honey-300/60 shadow-2xs">
              ~ Natural Craft &amp; Marché ~
            </span>
          </motion.div>

          {/* メインロゴ画像（mix-blend-mode: multiply でピーチクリーム色背景をサイト背景に美しく馴染ませる） */}
          <motion.div
            variants={rise}
            className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] mx-auto flex justify-center py-2"
          >
            <h1 id="hero-title" className="sr-only">
              森からのおくりもの - A gift from the forest
            </h1>
            {!logoLoadError ? (
              <Image
                src="/images/logo.jpg"
                alt="森からのおくりもの - A gift from the forest"
                width={560}
                height={380}
                priority
                onError={() => setLogoLoadError(true)}
                className="w-full h-auto object-contain mix-blend-multiply select-none pointer-events-none drop-shadow-xs"
              />
            ) : (
              <MainLogo className="w-full h-auto drop-shadow-xs" />
            )}
          </motion.div>

          {/* 手描きの波線 */}
          <motion.div variants={rise} className="mt-2 text-acorn-400 flex justify-center">
            <ChalkWavyLine className="w-36 sm:w-44 h-3.5" />
          </motion.div>

          {/* キャッチコピー（Klee One の柔らかい日本語教科書体） */}
          <motion.div
            variants={rise}
            className="mt-5 sm:mt-6 font-klee text-xl sm:text-2xl md:text-3xl font-semibold leading-[1.8] text-acorn-900"
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

          {/* アクションボタン */}
          <motion.div
            variants={rise}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-center gap-4 sm:gap-6"
          >
            {/* メインボタン：次の出店日を見る（フォレストグリーン＋線画カレンダーアイコン） */}
            <a
              id="hero-cta-next-event"
              href="#next-event"
              className="relative group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#4E6E58] px-8 sm:px-10 py-3.5 text-cream-50 shadow-md transition-all duration-300 hover:bg-[#3F5A47] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F5A47]"
            >
              <span
                className="absolute inset-1.5 rounded-xl border-[1.5px] border-dashed border-[#FAF7F2]/60 pointer-events-none"
                aria-hidden="true"
              />
              <ForestIcon
                name="calendar"
                size={22}
                color="#FAF7F2"
                strokeWidth={2.4}
                className="relative z-10"
              />
              <span className="font-sans font-bold text-base sm:text-lg text-[#FAF7F2] tracking-wider relative z-10">
                次の出店日を見る
              </span>
            </a>

            {/* サブボタン：私たちの想い（生成り背景＋新ロゴ線画どんぐりアイコン） */}
            <a
              id="hero-cta-concept"
              href="#concept"
              className="relative group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#FAF7F2] px-7 sm:px-9 py-3.5 border-2 border-[#5A4030] shadow-sm transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A4030]"
            >
              <ForestIcon
                name="acorn"
                size={22}
                color="#5A4030"
                strokeWidth={2.4}
              />
              <span className="font-sans font-bold text-base sm:text-lg text-[#5A4030] tracking-wide">
                私たちの想い
              </span>
              <span className="font-caveat text-xl sm:text-2xl font-bold text-acorn-600 -rotate-2">
                Story
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
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-acorn-700/70 hover:text-acorn-900 transition-colors z-10"
      >
        <span className="font-caveat text-sm tracking-widest uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ForestIcon name="pinecone" size={18} color="#6B4423" strokeWidth={2.2} />
        </motion.span>
      </motion.a>
    </section>
  );
}

export default Hero;
