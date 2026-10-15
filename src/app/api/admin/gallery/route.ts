import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { checkAdminAuthFromRequest } from "@/lib/auth";
import { loadGallery, saveGallery, deleteGalleryFromSupabase } from "@/lib/store";
import type { GalleryWork } from "@/types";

export const dynamic = "force-dynamic";

/** 全作品取得（管理画面用：論理削除済みも含む） */
export async function GET(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const works = await loadGallery();
  works.sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ works });
}

/** 新規作品追加 */
export async function POST(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { imageUrl, caption, title, tag } = body;

    if (!imageUrl || !caption) {
      return NextResponse.json({ error: "写真とひとこと紹介文は必須です。" }, { status: 400 });
    }

    const works = await loadGallery();
    const maxSort = works.reduce((max, w) => Math.max(max, w.sortOrder || 0), 0);

    const newWork: GalleryWork = {
      id: crypto.randomUUID(),
      imageUrl: String(imageUrl).trim(),
      caption: String(caption).trim(),
      title: title ? String(title).trim() : undefined,
      tag: tag ? String(tag).trim() : "Handmade Craft",
      sortOrder: maxSort + 1,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };

    works.push(newWork);
    await saveGallery(works);

    // キャッシュを破棄して公開画面および管理画面に即座に反映
    revalidatePath("/", "page");
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, work: newWork });
  } catch (err) {
    console.error("[Gallery POST error]", err);
    return NextResponse.json({ error: "作品の保存に失敗しました。" }, { status: 500 });
  }
}

/** 作品のステータス更新（論理削除、復活、並び替え） */
export async function PATCH(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isDeleted, sortOrder, swapWithId } = body;

    const works = await loadGallery();

    // 順序の入れ替え（swapWithId）
    if (id && swapWithId) {
      const idxA = works.findIndex((w) => w.id === id);
      const idxB = works.findIndex((w) => w.id === swapWithId);
      if (idxA !== -1 && idxB !== -1) {
        const temp = works[idxA].sortOrder;
        works[idxA].sortOrder = works[idxB].sortOrder;
        works[idxB].sortOrder = temp;
        await saveGallery(works);

        // キャッシュ破棄
        revalidatePath("/", "page");
        revalidatePath("/");
        revalidatePath("/admin");

        return NextResponse.json({ success: true });
      }
    }

    // 単体プロパティ更新（isDeleted や sortOrder）
    if (id) {
      const work = works.find((w) => w.id === id);
      if (!work) {
        return NextResponse.json({ error: "作品が見つかりません。" }, { status: 404 });
      }

      if (typeof isDeleted === "boolean") {
        // 安全装置：非表示化しようとした結果、表示中作品が0件になる場合はブロック
        if (isDeleted) {
          const remainingVisible = works.filter((w) => (w.id === id ? false : !w.isDeleted)).length;
          if (remainingVisible === 0) {
            return NextResponse.json(
              { error: "少なくとも1つの作品は表示状態にする必要があります（全件非表示はできません）。" },
              { status: 400 }
            );
          }
        }
        work.isDeleted = isDeleted;
      }
      if (typeof sortOrder === "number") {
        work.sortOrder = sortOrder;
      }

      await saveGallery(works);

      // キャッシュ破棄
      revalidatePath("/", "page");
      revalidatePath("/");
      revalidatePath("/admin");

      return NextResponse.json({ success: true, work });
    }

    return NextResponse.json({ error: "リクエストパラメータが不足しています。" }, { status: 400 });
  } catch (err) {
    console.error("[Gallery PATCH error]", err);
    const msg = err instanceof Error ? err.message : "更新処理に失敗しました。";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** 作品の完全削除 */
export async function DELETE(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
    }

    const works = await loadGallery();
    const filtered = works.filter((w) => w.id !== id);
    if (filtered.length === works.length) {
      return NextResponse.json({ error: "作品が見つかりません。" }, { status: 404 });
    }

    // 安全装置：削除によって表示中の作品が0件になってしまう場合はブロック
    const remainingVisible = filtered.filter((w) => !w.isDeleted).length;
    if (remainingVisible === 0) {
      return NextResponse.json(
        { error: "少なくとも1つの作品は表示状態にする必要があります（表示中の作品をすべて削除することはできません）。" },
        { status: 400 }
      );
    }

    await deleteGalleryFromSupabase(id);
    await saveGallery(filtered);

    // キャッシュ破棄
    revalidatePath("/", "page");
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Gallery DELETE error]", err);
    const msg = err instanceof Error ? err.message : "削除処理に失敗しました。";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
