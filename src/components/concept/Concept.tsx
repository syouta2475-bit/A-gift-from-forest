"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChalkWavyLine } from "@/components/ui/Icons";
import { MozSilhouette } from "@/components/ui/MozSilhouette";
import { ForestIcon } from "@/components/ui/ForestIcon";

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
    iconName: "pinecone" as const,
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
    iconName: "tree" as const,
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
    iconName: "marche-booth" as const,
  },
] as const;

export function Concept() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="concept" aria-labelledby="concept-title" className="relative bg-cream-50 overflow-hidden">
      {/* ── 背景のMOZ風大型シルエット（左上: 木の実を届ける小鳥、右下: 松ぼっくりネズミとキノコ） ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10" aria-hidden="true">
        <div className="absolute -left-12 top-20 sm:-left-6 sm:top-24">
          <MozSilhouette
            variant="bird"
            className="w-72 sm:w-88 md:w-96 h-auto opacity-40 rotate-6"
            color="#C8AD90"
          />
        </div>
        <div className="absolute -right-16 top-[42%] sm:-right-10">
          <MozSilhouette
            variant="mouse"
            className="w-72 sm:w-88 md:w-[400px] h-auto opacity-40 -rotate-3"
            color="#C8AD90"
          />
        </div>
        {/* ほのかな環境光 */}
        <div className="absolute -right-20 top-28 h-80 w-80 rounded-full bg-leaf-100/35 blur-3xl" />
        <div className="absolute -left-16 bottom-24 h-80 w-80 rounded-full bg-berry-100/30 blur-3xl" />
      </div>

      {/* ============================================================
          Part 1: CONCEPT（余白をたっぷりとった上質なコンセプト導入）
          ============================================================ */}
      <div className="relative py-24 sm:py-32 md:py-40 px-5 sm:px-8 flex items-center justify-center min-h-[85vh]">
        {/* 背景：見上げる爽やかな木漏れ日の森 */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
            alt="木漏れ日の美しい爽やかな緑の森"
            fill
            sizes="100vw"
            className="object-cover brightness-[1.08] saturate-[1.12]"
            priority
          />
          {/* 上下のふんわりクリーム色フェード */}
          <div className="absolute inset-x-0 top-0 h-36 sm:h-52 bg-gradient-to-b from-[#fffaf0] via-[#fffaf0]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-52 bg-gradient-to-t from-[#fffaf0] via-[#fffaf0]/80 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.48) 0%, rgba(250,247,242,0.2) 50%, rgba(250,247,242,0.35) 100%)",
            }}
          />
        </div>

        {/* 和紙風カード（ゆったりとした余白と上質なタイポグラフィ） */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl sm:max-w-3xl bg-[#FAF7F2]/95 backdrop-blur-md rounded-3xl p-7 sm:p-11 md:p-14 shadow-xl border border-[#E6DEC8] my-auto"
        >
          {/* バッジ */}
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
            <ForestIcon name="pine-mouse" size={24} color="#6B4423" />
            <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-1 inline-block bg-honey-200/50 px-5 py-0.5 rounded-full border border-honey-300/60 shadow-2xs">
              ~ Concept ~
            </span>
            <ForestIcon name="acorn" size={20} color="#6B4423" />
          </div>

          <div className="flex flex-col items-center text-center">
            {/* メイン見出し */}
            <h2
              id="concept-title"
              className="font-shippori text-xl sm:text-2xl md:text-3xl font-medium leading-[1.65] text-acorn-900 tracking-wide max-w-xl mx-auto"
            >
              ひとつとして同じ形のない、
              <br className="hidden sm:inline" />
              自然の造形をそのまま活かすこと。
            </h2>

            <ChalkWavyLine className="w-32 sm:w-40 h-3 text-acorn-400 mt-4 mb-6 sm:mb-8" />

            {/* 本文 */}
            <div className="space-y-4 text-sm sm:text-base md:text-[17px] leading-[2.1] text-acorn-800/90 font-sans max-w-xl mx-auto text-left sm:text-center">
              <p>
                松ぼっくりのうろこを一枚ずつ重ねてつくる小さな屋根や、ころんとした木の実から生まれる森の動物たち。
              </p>
              <p>
                ふと目をやったときに、森の澄んだ空気や木漏れ日のあたたかさを思い出してもらえるように。
              </p>
              <p className="font-klee text-base sm:text-lg text-acorn-900 font-semibold pt-1">
                季節の移ろいとともに、心を込めてお届けしています。
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================================
          Part 2: 「大切にしている3つのこと（01〜03）」
          ============================================================ */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto z-10">
        {/* セクション見出し */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-1">
            <ForestIcon name="tree" size={22} color="#6B4423" />
            <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-1">
              Our Commitment
            </span>
          </div>
          <h3 className="font-klee text-2xl sm:text-3xl lg:text-4xl font-semibold text-acorn-900 mt-1">
            大切にしている 3つのこと
          </h3>
          <div className="flex justify-center mt-2">
            <ChalkWavyLine className="w-36 h-3.5 text-acorn-400" />
          </div>
        </motion.div>

        {/* 3つのカード一覧 */}
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
                  <div className="shrink-0 p-1.5 rounded-full bg-honey-200/30 border border-honey-300/40">
                    <ForestIcon name={item.iconName} size={28} color="#6B4423" />
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

export default Concept;
