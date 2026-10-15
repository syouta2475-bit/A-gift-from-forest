"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ja } from "date-fns/locale";
import { jstDayKey, toJst } from "@/lib/date";
import { MarcheTent, OwlIllust, ChalkWavyLine, HandDrawnPinIllust } from "@/components/ui/Icons";
import type { MarcheEvent } from "@/types";

type CalendarProps = {
  events: MarcheEvent[];
  /** 今日の日付（JST, "yyyy-MM-dd"） */
  todayKey: string;
  /** 最初に表示する月（"yyyy-MM-dd"） */
  initialMonthKey: string;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

const monthVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.2 } }),
};

const bentoContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const bentoTile: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * 複数日開催に対応した日付ごとのイベントマッピング
 * startDate から endDate までのすべての日に該当イベントを紐づける
 */
function groupEventsByDay(events: MarcheEvent[]): Map<string, MarcheEvent[]> {
  const map = new Map<string, MarcheEvent[]>();

  for (const e of events) {
    const rawStart = (e?.startDate || (e as unknown as { date?: string })?.date || "").trim();
    const rawEnd = (e?.endDate || rawStart || "").trim();
    if (!rawStart) continue;

    const start = parseISO(rawStart);
    const end = parseISO(rawEnd);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

    try {
      const intervalDays = eachDayOfInterval({ start, end });
      for (const d of intervalDays) {
        const key = format(d, "yyyy-MM-dd");
        const list = map.get(key) ?? [];
        list.push(e);
        map.set(key, list);
      }
    } catch {
      // 終了日が開始日より前などの例外ガード
      const key = format(start, "yyyy-MM-dd");
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
  }

  return map;
}

/**
 * 出店カレンダー（複数日開催・0件月オーバーレイ・月移動保持）
 */
export function Calendar({ events, todayKey, initialMonthKey }: CalendarProps) {
  const reduceMotion = useReducedMotion();
  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  const [month, setMonth] = useState(() => startOfMonth(parseISO(initialMonthKey)));
  const [direction, setDirection] = useState<1 | -1>(1);

  // 最初は「今日以降でいちばん近い出店日」を選んでおく（なければ今日）
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const upcomingKeys = [...eventsByDay.keys()].sort().filter((k) => k >= todayKey);
    return upcomingKeys[0] ?? todayKey;
  });

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(month), end: endOfWeek(endOfMonth(month)) }),
    [month]
  );

  const goMonth = useCallback((delta: 1 | -1) => {
    setDirection(delta);
    setMonth((m) => (delta === 1 ? addMonths(m, 1) : subMonths(m, 1)));
  }, []);

  const monthKey = format(month, "yyyy-MM");
  const monthLabel = format(month, "yyyy年M月", { locale: ja });
  const selectedDate = parseISO(selectedKey);
  const selectedEvents = eventsByDay.get(selectedKey);

  // 表示中の月に含まれる出店日数
  const eventDaysInMonth = useMemo(() => {
    return [...eventsByDay.keys()].filter((k) => k.startsWith(monthKey)).length;
  }, [eventsByDay, monthKey]);

  return (
    <motion.div
      variants={bentoContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-1 md:grid-cols-12 gap-5"
    >
      {/* ── タイル1：カレンダー本体 ───────────────────────── */}
      <motion.div
        variants={bentoTile}
        className="rounded-[2.5rem] bg-white p-5 sm:p-7 border border-stone-200/60 shadow-xs md:col-span-7 flex flex-col justify-between"
      >
        <div>
          {/* ★月移動ヘッダー（オーバーレイの外・上部に配置し、いつでも前後の月へ移動可能） */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <button
              type="button"
              id="calendar-prev"
              onClick={() => goMonth(-1)}
              aria-label="前の月へ"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-acorn-200 bg-white text-base font-bold text-acorn-700 shadow-xs transition hover:bg-cream-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500"
            >
              <span aria-hidden="true">←</span>
            </button>

            <p
              id="calendar-month-label"
              aria-live="polite"
              className="text-center text-xl sm:text-2xl font-klee font-semibold text-acorn-900"
            >
              {monthLabel}
            </p>

            <button
              type="button"
              id="calendar-next"
              onClick={() => goMonth(1)}
              aria-label="次の月へ"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-acorn-700 text-base font-bold text-cream-50 shadow-xs transition hover:bg-acorn-900 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* 曜日インデックス */}
          <div
            className="grid grid-cols-7 text-center text-xs sm:text-sm font-bold pb-2 border-b border-stone-100"
            aria-hidden="true"
          >
            {WEEKDAYS.map((w, i) => (
              <span
                key={w}
                className={i === 0 ? "text-[#c2413a]" : i === 6 ? "text-[#356bb3]" : "text-acorn-500"}
              >
                {w}
              </span>
            ))}
          </div>

          {/* 日付グリッド（0件月はここにのみ半透明オーバーレイを重ねる） */}
          <div className="relative mt-3">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={monthKey}
                custom={direction}
                variants={reduceMotion ? undefined : monthVariants}
                initial="enter"
                animate="center"
                exit="exit"
                role="grid"
                aria-label={`${monthLabel}のカレンダー`}
                className="grid grid-cols-7 gap-1 sm:gap-1.5"
              >
                {days.map((day) => {
                  if (!isSameMonth(day, month)) {
                    return <div key={day.toISOString()} role="gridcell" aria-hidden="true" />;
                  }

                  const key = jstDayKey(day);
                  const dayEvents = eventsByDay.get(key);
                  const hasEvent = Boolean(dayEvents && dayEvents.length > 0);
                  const isToday = key === todayKey;
                  const isSelected = key === selectedKey;
                  const dow = day.getDay();
                  const numberColor = isSelected
                    ? "text-white"
                    : dow === 0
                      ? "text-[#c2413a]"
                      : dow === 6
                        ? "text-[#356bb3]"
                        : "text-acorn-900";

                  const label = `${format(day, "M月d日（E）", { locale: ja })}${
                    hasEvent ? ` 出店日：${dayEvents?.map((e) => e.title).join("、")}` : ""
                  }${isToday ? "（今日）" : ""}`;

                  return (
                    <div key={key} role="gridcell">
                      <motion.button
                        type="button"
                        onClick={() => setSelectedKey(key)}
                        aria-pressed={isSelected}
                        aria-label={label}
                        aria-current={isToday ? "date" : undefined}
                        whileTap={{ scale: 0.92 }}
                        className={`relative flex aspect-square min-h-[3.25rem] w-full flex-col items-center justify-center rounded-2xl p-1 text-sm sm:text-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-700 ${numberColor} ${
                          isSelected
                            ? "bg-forest-600 shadow-md ring-2 ring-forest-700"
                            : hasEvent
                              ? "bg-honey-200/80 hover:bg-honey-300/90 border border-honey-400/60 shadow-xs"
                              : isToday
                                ? "bg-leaf-100 ring-2 ring-leaf-500"
                                : "hover:bg-cream-100"
                        }`}
                      >
                        <span className="leading-none">{format(toJst(day), "d")}</span>
                        {/* 出店日の目印：マルシェテントアイコン */}
                        {hasEvent && (
                          <div className="mt-1 flex items-center justify-center">
                            <MarcheTent
                              className={`h-4 w-4 ${isSelected ? "text-honey-200 drop-shadow-xs" : "text-acorn-700"}`}
                            />
                          </div>
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* ★予定が0件の月のオーバーレイ（月移動ヘッダーは上部で操作可能なまま保護） */}
            {eventDaysInMonth === 0 && (
              <div
                className="absolute inset-0 bg-[#FAF7F2]/88 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-xs border border-stone-200/50"
                aria-live="polite"
              >
                <OwlIllust className="w-14 sm:w-16 h-auto mb-2 text-acorn-700 drop-shadow-xs opacity-90" />
                <p className="font-klee text-lg sm:text-xl font-bold text-acorn-900 leading-snug">
                  今月の出店予定はありません
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-acorn-700/85 font-sans">
                  前後の月（矢印ボタン）で他の月の予定をご確認いただけます。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 凡例（フッター） */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm text-acorn-700 font-medium font-sans">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-forest-600 ring-2 ring-forest-700/30" />
            <span>選択中の日</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-honey-200 border border-honey-400" />
            <span>出店予定日</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-leaf-100 ring-2 ring-leaf-500/40" />
            <span>今日</span>
          </div>
        </div>
      </motion.div>

      {/* ── タイル2：選択中の日の詳細（右側カラム） ───────── */}
      <motion.div
        variants={bentoTile}
        className="rounded-[2.5rem] bg-white p-5 sm:p-7 border border-stone-200/60 shadow-xs md:col-span-5 flex flex-col justify-between"
      >
        <div>
          {/* 日付ヘッダー */}
          <div className="flex items-baseline justify-between border-b border-stone-100 pb-3 mb-4">
            <p className="font-klee text-xl sm:text-2xl font-semibold text-acorn-900">
              {format(selectedDate, "M月d日（E）", { locale: ja })}
            </p>
            {selectedKey === todayKey && (
              <span className="rounded-full bg-leaf-100 px-3 py-0.5 text-xs font-bold text-forest-700">
                今日
              </span>
            )}
          </div>

          {/* イベント詳細リスト */}
          {selectedEvents && selectedEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl bg-cream-50/80 p-4 border border-acorn-100/80 font-sans"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-klee text-lg sm:text-xl font-bold text-acorn-900 leading-snug">
                      {ev.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-honey-200/90 px-2.5 py-0.5 text-xs font-bold text-acorn-900">
                      出店
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm font-semibold text-acorn-700 flex items-center gap-1.5">
                    <span>時間:</span>
                    <span>{ev.time}</span>
                  </p>

                  <p className="mt-1 text-xs sm:text-sm font-semibold text-acorn-700 flex items-start gap-1.5">
                    <HandDrawnPinIllust className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{ev.location}</span>
                  </p>

                  <p className="mt-2.5 text-xs sm:text-sm text-acorn-800/90 leading-relaxed font-sans whitespace-pre-wrap break-words">
                    {ev.description}
                  </p>

                  {ev.highlights && ev.highlights.filter(Boolean).length > 0 && (
                    <ul className="mt-2.5 space-y-1 text-xs sm:text-sm text-acorn-800">
                      {ev.highlights.filter(Boolean).map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-leaf-600 font-bold shrink-0">✽</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {ev.mapUrl && ev.mapUrl.trim() !== "" && (
                    <div className="mt-3 pt-2 border-t border-acorn-200/40">
                      <a
                        href={ev.mapUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:text-forest-800"
                      >
                        <span>Googleマップで会場を見る</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-acorn-700/80 font-sans">
              <p className="text-sm">この日の出店予定はありません。</p>
              <p className="mt-1 text-xs text-acorn-600">
                テントのマークがついている日を選択すると、詳細が表示されます。
              </p>
            </div>
          )}
        </div>

        {/* 下部案内 */}
        <div className="mt-6 pt-3 border-t border-stone-100 text-xs text-acorn-600/80">
          ※雨天や強風などにより、出店日時が変更になる場合がございます。
        </div>
      </motion.div>
    </motion.div>
  );
}
