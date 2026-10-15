import { format, differenceInCalendarDays, parseISO, isValid } from "date-fns";
import { toJst } from "@/lib/date";
import type { MarcheEvent, Event } from "@/types";

/** 曜日日本語名 */
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

/**
 * 今日以降で終了する予定のうち、startDate が最も近い1件を自動選出（来月でも半年後でも最も近い未来の予定）
 * なければ null
 */
export function pickNextEvent(events: MarcheEvent[], now: Date = new Date()): MarcheEvent | null {
  if (!Array.isArray(events) || events.length === 0) return null;

  const todayKey = format(toJst(now), "yyyy-MM-dd");

  // 有効な日付を持ち、endDate が今日以降の予定を抽出
  const upcoming = events.filter((e) => {
    const rawStart = e?.startDate || (e as unknown as { date?: string })?.date;
    const rawEnd = e?.endDate || rawStart;
    if (!rawStart || !rawEnd) return false;
    return rawEnd >= todayKey;
  });

  if (upcoming.length === 0) return null;

  // startDate が最も近い順にソート
  upcoming.sort((a, b) => {
    const startA = a.startDate || (a as unknown as { date?: string }).date || "";
    const startB = b.startDate || (b as unknown as { date?: string }).date || "";
    return startA.localeCompare(startB);
  });

  return upcoming[0];
}

export type EventDateInfo = {
  displayDate: string;
  isMultiDay: boolean;
  startMonth: number | string;
  startDay: number | string;
  startWeekday: string;
  endMonth?: number | string;
  endDay?: number | string;
  endWeekday?: string;
  isValid: boolean;
};

/**
 * 複数日開催・単日開催に応じた日付範囲の美しい日本語表記
 * - startDate === endDate: "10月26日(月)"
 * - startDate !== endDate (同月): "10月24日(土) 〜 25日(日)"
 * - startDate !== endDate (月跨ぎ): "10月31日(土) 〜 11月1日(日)"
 * ※ startDate または endDate が空・未定義・不正な文字列でも絶対に NaN を返さず、安全なオブジェクトを返す。
 */
export function formatEventDateRange(
  startDateStr?: string | null,
  endDateStr?: string | null
): EventDateInfo {
  const rawStart = (startDateStr ?? "").trim();
  const rawEnd = (endDateStr ?? rawStart).trim();

  // 空文字または不正な日付の完全ガード
  if (!rawStart) {
    return {
      displayDate: "開催日未定",
      isMultiDay: false,
      startMonth: "--",
      startDay: "--",
      startWeekday: "未定",
      isValid: false,
    };
  }

  const start = parseISO(rawStart);
  if (!isValid(start) || isNaN(start.getTime())) {
    return {
      displayDate: "開催日未定",
      isMultiDay: false,
      startMonth: "--",
      startDay: "--",
      startWeekday: "未定",
      isValid: false,
    };
  }

  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const startWeekday = WEEKDAYS[start.getDay()] || "日";

  // 終了日が未設定または開始日と同じ場合
  if (!rawEnd || rawStart === rawEnd) {
    return {
      displayDate: `${startMonth}月${startDay}日（${startWeekday}）`,
      isMultiDay: false,
      startMonth,
      startDay,
      startWeekday,
      isValid: true,
    };
  }

  const end = parseISO(rawEnd);
  if (!isValid(end) || isNaN(end.getTime())) {
    // 終了日のみ不正な場合は開始日の単日として安全に処理
    return {
      displayDate: `${startMonth}月${startDay}日（${startWeekday}）`,
      isMultiDay: false,
      startMonth,
      startDay,
      startWeekday,
      isValid: true,
    };
  }

  const endMonth = end.getMonth() + 1;
  const endDay = end.getDate();
  const endWeekday = WEEKDAYS[end.getDay()] || "日";

  let displayDate = "";
  if (startMonth === endMonth) {
    displayDate = `${startMonth}月${startDay}日（${startWeekday}）〜 ${endDay}日（${endWeekday}）`;
  } else {
    displayDate = `${startMonth}月${startDay}日（${startWeekday}）〜 ${endMonth}月${endDay}日（${endWeekday}）`;
  }

  return {
    displayDate,
    isMultiDay: true,
    startMonth,
    startDay,
    startWeekday,
    endMonth,
    endDay,
    endWeekday,
    isValid: true,
  };
}

/**
 * 「あと〇日」バッジの文言生成
 * - startDate <= 今日 <= endDate: "本日開催中！"
 * - 今日 < startDate: "あと X 日" または "明日開催！"
 * ※ 不正な日付文字列でも安全に "Coming Soon" を返す。
 */
export function getCountdownBadge(
  startDateStr?: string | null,
  endDateStr?: string | null,
  now: Date = new Date()
): string {
  const rawStart = (startDateStr ?? "").trim();
  const rawEnd = (endDateStr ?? rawStart).trim();

  if (!rawStart) return "Coming Soon";

  const start = parseISO(rawStart);
  if (!isValid(start) || isNaN(start.getTime())) return "Coming Soon";

  const todayKey = format(toJst(now), "yyyy-MM-dd");

  if (rawEnd && todayKey >= rawStart && todayKey <= rawEnd) {
    return "本日開催中！";
  }

  const daysLeft = differenceInCalendarDays(start, toJst(now));

  if (daysLeft <= 0) return "本日開催中！";
  if (daysLeft === 1) return "明日開催！";
  if (daysLeft > 0 && daysLeft <= 999) return `あと ${daysLeft} 日`;
  return "Coming Soon";
}

/**
 * 旧コンポーネント互換用変換
 */
export function convertToLegacyEvent(event: MarcheEvent): Event {
  const rawStart = event?.startDate || (event as unknown as { date?: string })?.date || "2026-10-01";
  return {
    id: event.id,
    title: event.title,
    date: `${rawStart}T${event.time?.split("〜")[0] || "10:00"}:00+09:00`,
    location: event.location,
    content: `<p>${event.description}</p><ul>${(event.highlights || []).map((h) => `<li>${h}</li>`).join("")}</ul>`,
    startDate: event.startDate || rawStart,
    endDate: event.endDate || rawStart,
    time: event.time,
    description: event.description,
    highlights: event.highlights,
  };
}
