import { NextResponse } from "next/server";
import { getEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

/** 公開用出店予定一覧（予約公開フィルタ済み、startDate 昇順） */
export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json({ events });
  } catch (err) {
    console.error("[GET /api/events error]", err);
    return NextResponse.json({ error: "出店予定の取得に失敗しました。" }, { status: 500 });
  }
}
