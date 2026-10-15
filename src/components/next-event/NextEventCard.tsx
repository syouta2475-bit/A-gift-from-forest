"use client";

import { motion } from "framer-motion";
import type { MarcheEvent } from "@/types";
import { formatEventDateRange, getCountdownBadge } from "@/lib/events-utils";
import { ChalkGarlandBottom, HandDrawnPinIllust } from "@/components/ui/Icons";

type NextEventCardProps = {
  event: MarcheEvent | null;
  /** プレビュー表示フラグ（アニメーションやカレンダー誘導ボタンを省略） */
  preview?: boolean;
};

/**
 * つぎに会える場所（アーチ木枠のチョーク黒板デザイン）
 * カレンダーの予定データと完全自動連動。
 * 予定が0件または日付未入力のときは黒板デザインを維持したまま温かい未定UIを表示。
 */
export function NextEventCard({ event, preview = false }: NextEventCardProps) {
  // 日付の安全な抽出（startDate と旧 date の両方に対応、空文字・undefined ガード）
  const rawStart = (event?.startDate || (event as unknown as { date?: string })?.date || "").trim();
  const rawEnd = (event?.endDate || rawStart || "").trim();

  const hasDate = Boolean(rawStart);
  const dateInfo = hasDate ? formatEventDateRange(rawStart, rawEnd) : null;
  const isDateValid = Boolean(dateInfo && dateInfo.isValid);

  const countdown = isDateValid ? getCountdownBadge(rawStart, rawEnd) : "Coming Soon";
  // GoogleマップURL：入力された場合のみ有効、未入力時は null（自動検索フォールバックは廃止）
  const mapUrl = event?.mapUrl && event.mapUrl.trim() !== "" ? event.mapUrl.trim() : null;

  const chalkColors = ["#9BB894", "#F3D79B", "#F4C2B8", "#99B8C6"];

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* ── イーゼル＆木枠黒板ラッパー ── */}
      <motion.div
        initial={preview ? false : { opacity: 0, y: 30 }}
        whileInView={preview ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-2 pb-6"
      >
        {/* イーゼル脚（黒板の下部にちょこんと出る木製の脚） */}
        <div className="easel-leg leg-left" aria-hidden="true" />
        <div className="easel-leg leg-right" aria-hidden="true" />

        {/* 木枠アーチ（wood-frame-arch） */}
        <div className="wood-frame-arch relative z-10">
          {/* 黒板盤面（chalkboard-surface） */}
          <div className="chalkboard-surface">
            {/* ── 【上部SVG：どんぐりを持つ黄色いリスと4色のチョーク葉っぱアーチ】 ── */}
            <svg
              viewBox="0 0 300 62"
              className="w-full h-[62px] overflow-visible -mt-1 mb-1 select-none pointer-events-none"
            >
              <g filter="url(#chalk-rough)" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 6 54 C 18 22, 54 10, 102 12" stroke="#9BB894" strokeWidth="2.6" />
                <path d="M 26 30 C 14 22, 22 10, 34 20 Z" fill="#9BB894" stroke="#9BB894" strokeWidth="1.5" />
                <path d="M 58 16 C 52 4, 66 0, 68 12 Z" fill="#F3D79B" stroke="#F3D79B" strokeWidth="1.5" />
                <path d="M 42 38 C 52 44, 60 34, 48 30 Z" fill="#9BB894" stroke="#9BB894" strokeWidth="1.5" />
                <circle cx="15" cy="42" r="3.5" fill="#E8A89A" />
                <circle cx="24" cy="49" r="3" fill="#99B8C6" />
                <circle cx="82" cy="10" r="3.5" fill="#E8A89A" />
                <path d="M 294 54 C 282 22, 246 10, 198 12" stroke="#9BB894" strokeWidth="2.6" />
                <path d="M 274 30 C 286 22, 278 10, 266 20 Z" fill="#9BB894" stroke="#9BB894" strokeWidth="1.5" />
                <path d="M 242 16 C 248 4, 234 0, 232 12 Z" fill="#E8A89A" stroke="#E8A89A" strokeWidth="1.5" />
                <path d="M 258 38 C 248 44, 240 34, 252 30 Z" fill="#9BB894" stroke="#9BB894" strokeWidth="1.5" />
                <circle cx="285" cy="42" r="3.5" fill="#F3D79B" />
                <circle cx="276" cy="49" r="3" fill="#E8A89A" />
                <circle cx="218" cy="10" r="3.5" fill="#99B8C6" />
                <g transform="translate(150, 26)">
                  <path
                    d="M 7 12 C 28 16, 36 -8, 20 -16 C 10 -20, 6 -6, 12 4 C 15 8, 22 6, 20 0"
                    fill="#D99B52"
                    fillOpacity="0.88"
                    stroke="#F3D79B"
                    strokeWidth="2.2"
                  />
                  <path
                    d="M -8 14 C -12 2, -10 -12, 0 -14 C 8 -14, 10 0, 8 14 Z"
                    fill="#D99B52"
                    fillOpacity="0.88"
                    stroke="#F3D79B"
                    strokeWidth="2.2"
                  />
                  <path d="M -4 -13 L -6 -20 L 0 -15 M 3 -13 L 6 -20 L 7 -12" stroke="#F3D79B" strokeWidth="2.2" />
                  <circle cx="-3" cy="-7" r="1.8" fill="#3B2E26" />
                  <circle cx="-15" cy="2" r="5.5" fill="#FAF7F2" stroke="#F3D79B" strokeWidth="1.8" />
                  <path d="M -20 0 Q -15 -5 -10 0" stroke="#9E7352" strokeWidth="3.2" />
                </g>
                <text
                  x="150"
                  y="56"
                  textAnchor="middle"
                  fontSize="16.5"
                  fill="#F3D79B"
                  letterSpacing="1.5"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  ~ Forest Craft Marché ~
                </text>
              </g>
            </svg>

            {/* ── 【中段：マスキングテープで貼られた白い情報メモ紙（Zen Maru Gothic）】 ── */}
            <div className="relative mt-4 mb-6 rounded-xl bg-[#FAF7F2] p-5 sm:p-6 text-acorn-900 shadow-md border border-[#E6DEC8]/80 font-sans">
              {/* 黄色いマスキングテープ装飾 */}
              <div
                className="absolute w-20 h-[19px] bg-[#EBC682]/85 -top-2.5 left-1/2 -translate-x-1/2 -rotate-2 rounded-xs shadow-xs pointer-events-none"
                style={{
                  clipPath: "polygon(0% 10%, 5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%)",
                }}
                aria-hidden="true"
              />

              {event && isDateValid && dateInfo ? (
                <>
                  {/* 上段：ラベル＆あと〇日バッジ */}
                  <div className="flex items-center justify-between gap-2 border-b border-dashed border-acorn-200/80 pb-3 mb-3">
                    <span className="font-caveat text-xl sm:text-2xl font-bold text-acorn-600 tracking-wide">
                      Date & Location
                    </span>
                    <span className="rounded-full bg-honey-200/95 border border-honey-300/90 px-3.5 py-1 text-xs sm:text-sm font-bold text-acorn-900 shadow-xs">
                      {countdown}
                    </span>
                  </div>

                  {/* 日時情報（複数日開催にも対応した大きな表示・NaN完全ガード） */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <p className="flex items-baseline flex-wrap gap-1 text-acorn-900 font-bold">
                        <span className="text-xl sm:text-2xl">{String(dateInfo.startMonth)}月</span>
                        <span className="text-3xl sm:text-4xl md:text-5xl leading-none text-acorn-900">
                          {String(dateInfo.startDay)}
                        </span>
                        <span className="text-lg sm:text-xl text-acorn-700">（{String(dateInfo.startWeekday)}）</span>

                        {dateInfo.isMultiDay && (
                          <>
                            <span className="mx-1 text-acorn-500 font-normal">〜</span>
                            {dateInfo.endMonth && String(dateInfo.endMonth) !== String(dateInfo.startMonth) && (
                              <span className="text-xl sm:text-2xl">{String(dateInfo.endMonth)}月</span>
                            )}
                            <span className="text-3xl sm:text-4xl md:text-5xl leading-none text-acorn-900">
                              {String(dateInfo.endDay)}
                            </span>
                            <span className="text-lg sm:text-xl text-acorn-700">（{String(dateInfo.endWeekday)}）</span>
                          </>
                        )}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-acorn-600 mt-1">
                        時間: {event.time || "10:00〜16:00"}
                      </p>
                    </div>

                    {/* 会場名 ＆ 地図ボタン（入力時のみ表示） */}
                    <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end gap-2">
                      <p className="text-base sm:text-lg font-bold text-acorn-900 text-left sm:text-right">
                        {event.location || "会場未定"}
                      </p>
                      {mapUrl && (
                        <a
                          id="next-event-map"
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs sm:text-sm font-bold text-acorn-800 border border-acorn-200/90 shadow-xs transition hover:bg-cream-100 hover:border-acorn-300"
                        >
                          <HandDrawnPinIllust className="w-3.5 h-3.5" />
                          <span>地図を開く</span>
                          <span className="text-xs">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* 予定が未定、またはプレビューで日付未入力のときの未定UI */
                <div className="py-2 text-center sm:text-left">
                  <div className="flex items-center justify-between gap-2 border-b border-dashed border-acorn-200/80 pb-2 mb-3">
                    <span className="font-caveat text-xl sm:text-2xl font-bold text-acorn-600 tracking-wide">
                      Next Marché Info
                    </span>
                    <span className="rounded-full bg-cream-200/90 border border-acorn-200/80 px-3 py-0.5 text-xs font-bold text-acorn-700">
                      {preview ? "日付入力待ち" : "準備中"}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-acorn-800 font-medium">
                    {preview
                      ? "フォームで日付を入力すると、ここに開催日とバッジのプレビューが表示されます。"
                      : "ただいま次回マルシェへの出店を計画しています。"}
                  </p>
                  <p className="mt-1 text-xs text-acorn-600">
                    {preview && event?.location
                      ? `予定会場: ${event.location}`
                      : "詳細が決まり次第、こちらの黒板でお知らせいたします。"}
                  </p>
                </div>
              )}
            </div>

            {/* ── 【下段：運用で書くフリーメッセージエリア（手書きペン字 Yomogi）】 ── */}
            <div className="font-yomogi chalk-text-shadow px-2 sm:px-4 py-2">
              {event && (event.title || event.description) ? (
                <>
                  {/* イベントタイトル（チョークイエロー＋下部点線ボーダー） */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#F3D79B] pb-2 border-b-2 border-dashed border-[#F3D79B]/40 leading-snug tracking-wide">
                    {event.title || "出店タイトル"}
                  </h3>

                  {/* メイン紹介文 */}
                  {event.description && (
                    <p className="mt-4 text-sm sm:text-base leading-loose text-[#FAF7F2]/95 whitespace-pre-wrap break-words">
                      {event.description}
                    </p>
                  )}

                  {/* 箇条書きハイライト（色チョークの✽） */}
                  {event.highlights && event.highlights.filter(Boolean).length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm sm:text-base leading-relaxed text-[#FAF7F2]/95">
                      {event.highlights.filter(Boolean).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span
                            style={{ color: chalkColors[idx % chalkColors.length] }}
                            className="font-bold shrink-0 text-base"
                          >
                            ✽
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                /* 予定が0件のときの未定UI（チョーク手書きエリア） */
                <>
                  <h3 className="text-lg sm:text-xl font-bold text-[#F3D79B] pb-2 border-b-2 border-dashed border-[#F3D79B]/40 leading-snug tracking-wide">
                    森の工房より
                  </h3>
                  <p className="mt-4 text-sm sm:text-base leading-loose text-[#FAF7F2]/95 whitespace-pre-wrap break-words">
                    つぎの季節のマルシェに向けて、木の実を拾いながら少しずつ作品を準備しています。日程が決まり次第、この黒板でお知らせしますね。
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm sm:text-base leading-relaxed text-[#FAF7F2]/95">
                    <li className="flex items-start gap-2">
                      <span style={{ color: chalkColors[0] }} className="font-bold shrink-0 text-base">
                        ✽
                      </span>
                      <span>新作の木の実チャームを製作中</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: chalkColors[1] }} className="font-bold shrink-0 text-base">
                        ✽
                      </span>
                      <span>松ぼっくりのリースも心を込めて準備しています</span>
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* ── 【最下部SVG：4色の葉っぱと木の実のチョークガーランド】 ── */}
            <div className="mt-5 pt-2 select-none pointer-events-none">
              <ChalkGarlandBottom className="w-full h-6 sm:h-7 opacity-90" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── カレンダーへの誘導ボタン（プレビュー時は非表示） ── */}
      {!preview && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4"
        >
          <a
            id="next-event-to-calendar"
            href="#calendar"
            className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-cream-100/90 hover:bg-cream-200/90 border border-acorn-200/70 p-3.5 text-sm sm:text-base font-bold text-acorn-800 transition-colors font-sans shadow-xs"
          >
            <span>その他の出店スケジュールをカレンダーで確認する</span>
            <span aria-hidden="true" className="font-sans">
              ↓
            </span>
          </a>
        </motion.div>
      )}
    </div>
  );
}
