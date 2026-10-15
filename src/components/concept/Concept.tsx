"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  PineconeIllust,
  BotanicalTreeIllust,
  CommunicationIllust,
  ChalkWavyLine,
  NordicHouseIllust,
} from "@/components/ui/Icons";

const COMMITMENTS = [
  {
    num: "01",
    enTitle: "Forest Blessings",
    title: "森がくれた、自然の恵み",
    body: (
      <>
        松ぼっくりやどんぐり、小枝など、使うのは
        <span className="font-semibold text-acorn-900 bg-gradient-to-t from-[#E6C280]/40 to-transparent px-1">
          森で出会った本物の自然物たち
        </span>
        。<br />
        自然が作り出した不思議な形や温もりをそのまま活かして、
        <br className="hidden sm:inline" />
        ひとつずつ作品に仕立てています。
      </>
    ),
    image: "/images/commitment-01-pinecone.jpg",
    imageAlt: "松ぼっくりと森の玉ボケ写真",
    illust: <PineconeIllust className="w-16 sm:w-20 h-auto" />,
  },
  {
    num: "02",
    enTitle: "At My Own Pace",
    title: "自分のペースで、のんびりと",
    body: (
      <>
        誰に教わるでもなく、趣味の延長から始まった手仕事です。
        <br />
        型にとらわれず
        <span className="font-semibold text-acorn-900 bg-gradient-to-t from-[#E6C280]/40 to-transparent px-1">
          「こんなものがあったら可愛いな」
        </span>
        と想像しながら、今日もゆっくりと手を動かしています。
      </>
    ),
    image: "/images/commitment-02-atelier.jpg",
    imageAlt: "工房の作業机と麻袋の松ぼっくり写真",
    illust: <BotanicalTreeIllust className="w-16 sm:w-20 h-auto" />,
  },
  {
    num: "03",
    enTitle: "Sweet Encounters",
    title: "マルシェでの、ちいさな出会い",
    body: (
      <>
        実店舗は持たず、月に1〜2回、北軽井沢や川越周辺のマルシェに出店しています。
        <br />
        同じように自然が好きな方と、
        <span className="font-semibold text-acorn-900 bg-gradient-to-t from-[#E6C280]/40 to-transparent px-1">
          作品を通してお話しできる時間
        </span>
        が何よりの楽しみです。
      </>
    ),
    image: "/images/commitment-03-marche.jpg",
    imageAlt: "木漏れ日のマルシェのボケ風景写真",
    illust: <CommunicationIllust className="w-20 sm:w-24 h-auto" />,
  },
] as const;

export function Concept() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="concept" aria-labelledby="concept-title" className="relative bg-cream-50">
      {/* ── 背景の透かしイラスト（セクション内に閉じ込めて横揺れを完全防止） ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10" aria-hidden="true">
        <div className="absolute -right-12 top-24 opacity-[0.07]">
          <BotanicalTreeIllust className="w-72 sm:w-96 h-auto" />
        </div>
        <div className="absolute -left-16 bottom-36 opacity-[0.07]">
          <PineconeIllust className="w-72 sm:w-[420px] h-auto" />
        </div>
        {/* ほのかな環境光 */}
        <div className="absolute -right-20 top-28 h-80 w-80 rounded-full bg-leaf-100/35 blur-3xl" />
        <div className="absolute -left-16 bottom-24 h-80 w-80 rounded-full bg-berry-100/30 blur-3xl" />
      </div>

      {/* ============================================================
          Part 1: Story & Philosophy（明るく爽やかな見上げる森 ＋ 和紙風カード）
          確実・安定して画面内にフェードイン表示される構成
          ============================================================ */}
      <div className="relative py-20 sm:py-28 md:py-32 px-4 sm:px-6 flex items-center justify-center min-h-[85vh]">
        {/* 見上げる緑の森（木々の間から光が差す明るく爽やかな木漏れ日写真） */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
            alt="木漏れ日の美しい爽やかな緑の森"
            fill
            sizes="100vw"
            className="object-cover brightness-[1.08] saturate-[1.12]"
            priority
          />
          {/* 上下のふんわりクリーム色グラデーションフェード */}
          <div className="absolute inset-x-0 top-0 h-32 sm:h-48 bg-gradient-to-b from-[#fffaf0] via-[#fffaf0]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-48 bg-gradient-to-t from-[#fffaf0] via-[#fffaf0]/80 to-transparent" />
          {/* 爽やかな木漏れ日の光芒オーバーレイ */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.45) 0%, rgba(250,247,242,0.15) 50%, rgba(250,247,242,0.3) 100%)",
            }}
          />
        </div>

        {/* 確実にフェードインして浮かび上がる和紙風カード */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-xl sm:max-w-2xl bg-[#FAF7F2]/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 md:p-10 shadow-xl border border-[#E6DEC8] my-auto"
        >
          {/* カード上部のStory & Philosophyバッジ（カードと一体化して見切れを防止） */}
          <div className="flex items-center justify-center mb-4 sm:mb-5">
            <span className="font-caveat text-xl sm:text-2xl text-acorn-700 -rotate-2 inline-block bg-honey-200/50 px-4 py-0.5 rounded-full border border-honey-300/60 shadow-2xs">
              ~ Story & Philosophy ~
            </span>
          </div>

          {/* カード内のコンテンツ */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-5 md:gap-8">
            {/* 縦書きの添え字（PC表示） */}
            <div className="shrink-0 hidden md:block pt-1">
              <div className="vertical-text font-klee text-sm font-semibold tracking-[0.3em] text-acorn-700/85 py-2 border-r-2 border-dashed border-acorn-300/60 pr-3 min-h-[190px]">
                北軽井沢の風と、川越の街角から。
              </div>
            </div>

            {/* メイン見出し＆本文 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
              {/* スマホ用横書き添え字 */}
              <div className="md:hidden font-klee text-xs sm:text-sm font-semibold tracking-[0.2em] text-acorn-700/85 pb-1 mb-2.5 border-b border-dashed border-acorn-300/60">
                北軽井沢の風と、川越の街角から。
              </div>

              {/* 北欧の家イラスト */}
              <div className="mb-1.5">
                <NordicHouseIllust className="w-12 sm:w-14 h-auto drop-shadow-xs" />
              </div>

              {/* 見出し（途中で折り返さない2行表示） */}
              <h2
                id="concept-title"
                className="font-klee text-[18px] sm:text-2xl md:text-[1.65rem] font-semibold leading-[1.45] text-acorn-900 tracking-wide"
              >
                <span className="block whitespace-nowrap">自然の恵みを大切に、</span>
                <span className="block whitespace-nowrap">ひとつずつ、心のままに。</span>
              </h2>
              <ChalkWavyLine className="w-24 sm:w-28 h-3 text-acorn-400 mt-1.5" />

              {/* 本文 */}
              <div className="mt-4 space-y-3 sm:space-y-3.5 text-xs sm:text-sm md:text-[15px] leading-[2.0] text-acorn-800/90 font-sans">
                <p>
                  のどかな北軽井沢と、歴史ある川越。
                  <br />
                  ふたつの街を行き来しながら、
                  <br />
                  森で出会った木の実や小枝を使って
                  <br />
                  ちいさな作品をつくっています。
                </p>
                <p>
                  始まりは、ただ「自然のものが好き」という
                  <br />
                  純粋な気持ちからでした。
                  <br />
                  誰に教わるでもなく、自分の手で
                  <br />
                  少しずつ形にしていく時間は、
                  <br />
                  私にとって何よりの楽しみです。
                </p>
                <p className="pt-0.5">
                  手にとってくださった方の心がふっと癒され、
                  <br />
                  ちいさな「倖せ」をお届けできたなら。
                  <br />
                  <span className="font-klee text-sm sm:text-base text-acorn-900 font-semibold block mt-1">
                    どうぞ、お気に入りを見つけにいらしてください。
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================================
          Part 2: 「大切にしている3つのこと（01〜03）」
          スクロールすると確実に順次フェードインする安定したリッチカードレイアウト
          ============================================================ */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* セクション見出し */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-1 inline-block">
            Our Commitment
          </span>
          <h3 className="font-klee text-2xl sm:text-3xl lg:text-4xl font-semibold text-acorn-900 mt-1">
            大切にしている 3つのこと
          </h3>
          <div className="flex justify-center mt-2">
            <ChalkWavyLine className="w-36 h-3.5 text-acorn-400" />
          </div>
        </motion.div>

        {/* 3つのカード一覧（スクロールに合わせて確実に1枚ずつフェードイン出現） */}
        <div className="space-y-16 sm:space-y-24">
          {COMMITMENTS.map((item, index) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-3xl mx-auto"
            >
              {/* 背面：角丸写真フレーム */}
              <div className="relative w-full h-52 sm:h-64 md:h-72 rounded-3xl overflow-hidden shadow-md border border-[#E6DEC8]/80 bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 768px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-[#FAF7F2]/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/20 to-transparent" />
              </div>

              {/* 前面：写真に温かく重なるテキストカード */}
              <div className="relative z-10 -mt-14 sm:-mt-18 mx-3 sm:mx-6 md:mx-auto max-w-2xl bg-[#FAF7F2]/95 backdrop-blur-[4px] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-lg border border-[#E6DEC8]/90">
                <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-[#E6DEC8]/60 mb-3.5">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-caveat text-3xl sm:text-4xl md:text-5xl font-bold text-acorn-400 leading-none">
                      {item.num}
                    </span>
                    <span className="font-caveat text-lg sm:text-xl md:text-2xl text-acorn-600 -rotate-2">
                      ~ {item.enTitle} ~
                    </span>
                  </div>
                  <div className="shrink-0 drop-shadow-xs">
                    {item.illust}
                  </div>
                </div>

                <h4 className="font-klee text-lg sm:text-xl md:text-2xl font-semibold text-acorn-900 leading-snug [word-break:keep-all]">
                  {item.title}
                </h4>

                <p className="mt-3 text-xs sm:text-sm md:text-[15px] leading-[1.95] text-acorn-800/90 font-sans">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
