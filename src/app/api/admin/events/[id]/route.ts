import { NextResponse } from "next/server";
import { checkAdminAuthFromRequest } from "@/lib/auth";
import { loadEvents, saveEvents } from "@/lib/store";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ id: string }>;
};

/** イベント更新 */
export async function PUT(request: Request, { params }: Params) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const events = await loadEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "イベントが見つかりません。" }, { status: 404 });
    }

    const current = events[index];
    const filteredHighlights = Array.isArray(body.highlights)
      ? body.highlights.map((h: string) => String(h).trim()).filter(Boolean)
      : current.highlights;

    const location = body.location !== undefined ? String(body.location).trim() : current.location;
    const mapUrl = body.mapUrl !== undefined ? String(body.mapUrl).trim() : current.mapUrl;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const rawStart = body.startDate !== undefined ? String(body.startDate).trim() : current.startDate;
    const rawEnd = body.endDate !== undefined ? String(body.endDate).trim() : (body.startDate !== undefined ? rawStart : current.endDate);

    if (body.startDate !== undefined && !dateRegex.test(rawStart)) {
      return NextResponse.json({ error: "開始日は YYYY-MM-DD 形式で入力してください。" }, { status: 400 });
    }
    if (body.endDate !== undefined && !dateRegex.test(rawEnd)) {
      return NextResponse.json({ error: "終了日は YYYY-MM-DD 形式で入力してください。" }, { status: 400 });
    }

    events[index] = {
      ...current,
      startDate: rawStart,
      endDate: rawEnd,
      time: body.time ? String(body.time).trim() : current.time,
      location,
      mapUrl: mapUrl && String(mapUrl).trim() !== "" ? String(mapUrl).trim() : undefined,
      title: body.title ? String(body.title).trim() : current.title,
      description: body.description ? String(body.description).trim() : current.description,
      highlights: filteredHighlights,
      publishAt: body.publishAt !== undefined ? (body.publishAt ? new Date(body.publishAt).toISOString() : null) : current.publishAt,
      updatedAt: new Date().toISOString(),
    };

    await saveEvents(events);
    return NextResponse.json({ success: true, event: events[index] });
  } catch (err) {
    console.error("[Event PUT error]", err);
    return NextResponse.json({ error: "更新処理に失敗しました。" }, { status: 500 });
  }
}

/** イベント削除 */
export async function DELETE(request: Request, { params }: Params) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const events = await loadEvents();
    const filtered = events.filter((e) => e.id !== id);

    if (filtered.length === events.length) {
      return NextResponse.json({ error: "イベントが見つかりません。" }, { status: 404 });
    }

    await saveEvents(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Event DELETE error]", err);
    return NextResponse.json({ error: "削除処理に失敗しました。" }, { status: 500 });
  }
}
