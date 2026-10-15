import { NextResponse } from "next/server";
import crypto from "crypto";
import { checkAdminAuthFromRequest } from "@/lib/auth";
import { loadEvents, saveEvents } from "@/lib/store";
import type { MarcheEvent } from "@/types";

export const dynamic = "force-dynamic";

/** 全イベント取得（予約公開中・過去すべて） */
export async function GET(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await loadEvents();
  // startDate 昇順でソート
  events.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
  return NextResponse.json({ events });
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** 新規イベント作成 */
export async function POST(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { startDate, endDate, time, location, mapUrl, title, description, highlights, publishAt } = body;

    const rawStart = String(startDate ?? "").trim();
    const rawEnd = String(endDate || rawStart).trim();

    if (!rawStart || !time || !location || !title || !description) {
      return NextResponse.json({ error: "必須項目（開始日・時間・場所・タイトル・紹介文）を入力してください。" }, { status: 400 });
    }

    if (!DATE_REGEX.test(rawStart) || !DATE_REGEX.test(rawEnd)) {
      return NextResponse.json({ error: "日付は YYYY-MM-DD 形式で入力してください（例: 2026-10-24）。" }, { status: 400 });
    }

    // highlights: 全消し（空配列）時はそのまま空配列として保存（デフォルト値の自動挿入は行わない）
    const filteredHighlights: string[] = Array.isArray(highlights)
      ? highlights.map((h: string) => String(h).trim()).filter(Boolean)
      : [];

    // mapUrl: 自動検索フォールバックは廃止。入力された場合のみ文字列、未入力時は null
    const cleanedMapUrl = mapUrl && String(mapUrl).trim() !== "" ? String(mapUrl).trim() : null;

    const newEvent: MarcheEvent = {
      id: crypto.randomUUID(),
      startDate: rawStart,
      endDate: rawEnd,
      time: String(time).trim(),
      location: String(location).trim(),
      mapUrl: cleanedMapUrl ?? undefined,
      title: String(title).trim(),
      description: String(description).trim(),
      highlights: filteredHighlights,
      publishAt: publishAt ? new Date(publishAt).toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const events = await loadEvents();
    events.push(newEvent);
    await saveEvents(events);

    return NextResponse.json({ success: true, event: newEvent });
  } catch (err) {
    console.error("[Events POST error]", err);
    return NextResponse.json({ error: "イベントの保存に失敗しました。" }, { status: 500 });
  }
}
