import { loadEvents } from "@/lib/store";
import type { MarcheEvent } from "@/types";

export * from "./events-utils";

/**
 * 公開用出店予定一覧を取得（予約公開が未来のものは除外）
 */
export async function getEvents(): Promise<MarcheEvent[]> {
  const allEvents = await loadEvents();
  const now = new Date();

  // 予約公開判定（publishAt が現在以前、または未設定のもの）
  const published = allEvents.filter((e) => {
    if (!e.publishAt) return true;
    return new Date(e.publishAt) <= now;
  });

  // startDate 昇順でソート
  published.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return published;
}
