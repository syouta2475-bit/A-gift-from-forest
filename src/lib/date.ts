import { differenceInCalendarDays, format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * サーバー(UTC)とブラウザ(JST)でタイムゾーンが違っても、
 * 必ず「日本時間の日付・時刻」として扱うための変換。
 * 戻り値の Date は、ローカルの年月日時が JST と一致するようにずらしてある。
 */
export function toJst(date: Date): Date {
  return new Date(date.getTime() + (9 * 60 + date.getTimezoneOffset()) * 60_000);
}

const DAY_KEY = "yyyy-MM-dd";

/** 出店日・カレンダーで共通の「日本時間の日付」キー（タイムゾーンずれ防止） */
export function jstDayKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(toJst(d), DAY_KEY);
}

export type EventDateView = {
  /** 例: "10" */
  month: string;
  /** 例: "24" */
  day: string;
  /** 例: "土" */
  weekday: string;
  /** 例: "10:00" */
  time: string;
  /** 例: "2026年10月24日（土）" */
  full: string;
  /** 今日からの日数。今日なら 0 */
  daysLeft: number;
};

/** ISO 8601 の日付文字列を、表示用の部品にまとめる */
export function buildEventDateView(iso: string, now: Date = new Date()): EventDateView {
  const d = toJst(new Date(iso));
  return {
    month: format(d, "M"),
    day: format(d, "d"),
    weekday: format(d, "E", { locale: ja }),
    time: format(d, "HH:mm"),
    full: format(d, "yyyy年M月d日（E）", { locale: ja }),
    daysLeft: differenceInCalendarDays(d, toJst(now)),
  };
}
