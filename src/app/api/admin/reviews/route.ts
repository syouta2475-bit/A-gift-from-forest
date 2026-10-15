import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkAdminAuthFromRequest } from "@/lib/auth";
import { loadReviews, saveReviews, deleteReviewFromSupabase } from "@/lib/store";

export const dynamic = "force-dynamic";

/** 全口コミ取得（管理画面用） */
export async function GET(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await loadReviews();
  // 新しい順にソート
  reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ reviews });
}

/** 店主返信（ownerReply）の保存・更新 */
export async function PATCH(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ownerReply } = body;

    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
    }

    const reviews = await loadReviews();
    const review = reviews.find((r) => r.id === id);
    if (!review) {
      return NextResponse.json({ error: "口コミが見つかりません。" }, { status: 404 });
    }

    review.ownerReply = ownerReply ? String(ownerReply).trim() : undefined;
    await saveReviews(reviews);

    // キャッシュ破棄
    revalidatePath("/", "page");
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("[Reviews PATCH error]", err);
    return NextResponse.json({ error: "返信の保存に失敗しました。" }, { status: 500 });
  }
}

/** 口コミ削除 */
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

    const reviews = await loadReviews();
    const filtered = reviews.filter((r) => r.id !== id);

    if (filtered.length === reviews.length) {
      return NextResponse.json({ error: "口コミが見つかりません。" }, { status: 404 });
    }

    await deleteReviewFromSupabase(id);
    await saveReviews(filtered);

    // キャッシュ破棄
    revalidatePath("/", "page");
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Reviews DELETE error]", err);
    return NextResponse.json({ error: "削除処理に失敗しました。" }, { status: 500 });
  }
}
