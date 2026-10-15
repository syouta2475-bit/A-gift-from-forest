import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { checkAdminAuthFromRequest } from "@/lib/auth";
import { loadSettings, saveSettings } from "@/lib/store";
import type { SiteSettings, EmptyBoardPreset } from "@/types";

export const dynamic = "force-dynamic";

/** サイト設定取得 */
export async function GET(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await loadSettings();
  return NextResponse.json({ settings });
}

/** サイト設定更新 */
export async function PUT(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const currentSettings = await loadSettings();

    const lineNotifyEnabled =
      typeof body.lineNotifyEnabled === "boolean"
        ? body.lineNotifyEnabled
        : currentSettings.lineNotifyEnabled;

    const emptyBoardTitle =
      typeof body.emptyBoardTitle === "string"
        ? body.emptyBoardTitle.trim()
        : currentSettings.emptyBoardTitle;

    const emptyBoardMessage =
      typeof body.emptyBoardMessage === "string"
        ? body.emptyBoardMessage.trim()
        : currentSettings.emptyBoardMessage;

    let history: EmptyBoardPreset[] = Array.isArray(body.emptyBoardHistory)
      ? body.emptyBoardHistory
      : currentSettings.emptyBoardHistory || [];

    // 文言保存時、最新の履歴と異なる場合は先頭に追加（最大10件）
    if (body.addToHistory !== false && emptyBoardTitle && emptyBoardMessage) {
      const latestPreset = history[0];
      const isDifferent =
        !latestPreset ||
        latestPreset.title !== emptyBoardTitle ||
        latestPreset.message !== emptyBoardMessage;

      if (isDifferent) {
        const newPreset: EmptyBoardPreset = {
          id: crypto.randomUUID(),
          title: emptyBoardTitle,
          message: emptyBoardMessage,
          createdAt: new Date().toISOString(),
          savedAt: new Date().toISOString(),
        };
        history = [
          newPreset,
          ...history.filter(
            (h) => !(h.title === emptyBoardTitle && h.message === emptyBoardMessage)
          ),
        ].slice(0, 10);
      }
    }

    const updatedSettings: SiteSettings = {
      id: "default",
      lineNotifyEnabled,
      emptyBoardTitle,
      emptyBoardMessage,
      emptyBoardHistory: history.slice(0, 10),
      updatedAt: new Date().toISOString(),
    };

    await saveSettings(updatedSettings);

    // キャッシュを破棄して公開画面および管理画面に即座に反映
    revalidatePath("/", "page");
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error("[Settings PUT error]", err);
    return NextResponse.json({ error: "設定の保存に失敗しました。" }, { status: 500 });
  }
}
