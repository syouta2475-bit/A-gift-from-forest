import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getReviews } from "@/lib/reviews";
import { loadReviews, saveReviews } from "@/lib/store";
import { notifyNewReview } from "@/lib/notify";
import { uploadImageToSupabase } from "@/lib/supabase";
import type { Review } from "@/types";

export const dynamic = "force-dynamic";

const REVIEW_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "reviews");

/**
 * ニックネームのバリデーション
 * - 2文字以上〜20文字以内
 * - 全角・半角英数字、ひらがな、カタカナ、漢字、長音（ー〜）、スペース禁止または単一空白のみ
 * - 記号やタグ、URL文字（< > & " ' / ; = 等）は完全拒否
 */
function validateNickname(raw: string): { valid: boolean; value: string; error?: string } {
  const trimmed = raw.trim().replace(/\s+/g, ""); // 空白を詰める
  if (trimmed.length < 2 || trimmed.length > 20) {
    return { valid: false, value: "", error: "お名前（ニックネーム）は2文字以上20文字以内で入力してください。" };
  }

  // 許可文字：日本語（ひらがな・カタカナ・漢字・長音・波ダッシュ）、半角英数字、全角英数字
  const allowedRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z0-9０-９ａ-ｚＡ-Ｚー〜]+$/;
  if (!allowedRegex.test(trimmed)) {
    return {
      valid: false,
      value: "",
      error: "お名前には漢字・ひらがな・カタカナ・英数字のみ使用できます（記号やURLは含められません）。",
    };
  }

  return { valid: true, value: trimmed };
}

/**
 * コメントのバリデーション ＆ サニタイズ
 * - 2文字以上〜256文字以内
 * - 空白のみ禁止
 * - HTMLタグ、JavaScript構文、URL を厳格に拒否
 */
function validateComment(raw: string): { valid: boolean; value: string; error?: string } {
  const trimmed = raw.trim();
  if (trimmed.length < 2 || trimmed.length > 256) {
    return { valid: false, value: "", error: "メッセージは2文字以上256文字以内で入力してください。" };
  }

  // 空白のみの判定
  if (/^[\s\u3000]+$/.test(trimmed)) {
    return { valid: false, value: "", error: "メッセージを入力してください。" };
  }

  // HTMLタグ・スクリプト・イベントハンドラ構文の検出
  if (/<[a-z/][\s\S]*>/i.test(trimmed) || /javascript:/i.test(trimmed) || /on\w+\s*=/i.test(trimmed)) {
    return { valid: false, value: "", error: "HTMLタグやスクリプトを含むメッセージは投稿できません。" };
  }

  // URL（http://, https://, www.）の検出
  if (/https?:\/\/|www\./i.test(trimmed)) {
    return { valid: false, value: "", error: "URLリンクを含むメッセージは投稿できません。" };
  }

  // 改行コード統一と連続改行の正規化（最大2連続までに抑制）
  const normalizedNewlines = trimmed
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n");

  // サニタイズ（エスケープ）
  const sanitized = normalizedNewlines
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return { valid: true, value: sanitized };
}

/** 公開用口コミ一覧取得 */
export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json({ reviews });
}

/**
 * 口コミ投稿API
 * 個人情報（IP、User-Agent等）は一切保持・記録しません。
 */
export async function POST(request: Request) {
  try {
    let rawNickname = "";
    let rawComment = "";
    let websiteUrl = "";
    let formRenderTimeStr = "";
    let photo: File | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await request.json();
      rawNickname = String(json.nickname ?? "");
      rawComment = String(json.comment ?? "");
      websiteUrl = String(json.website_url ?? "");
      formRenderTimeStr = String(json.formRenderTime ?? "");
    } else {
      const form = await request.formData();
      rawNickname = String(form.get("nickname") ?? "");
      rawComment = String(form.get("comment") ?? "");
      websiteUrl = String(form.get("website_url") ?? "");
      formRenderTimeStr = String(form.get("formRenderTime") ?? "");
      const photoField = form.get("photo");
      if (photoField instanceof File) {
        photo = photoField;
      }
    }

    // ── ボット対策 1: ハニーポット判定（ダミーフィールドに値があればボット） ──
    const isHoneypotFilled = websiteUrl.trim().length > 0;

    // ── ボット対策 2: 表示経過時間判定（2秒未満の機械的送信はボット） ──
    let isTooFast = false;
    if (formRenderTimeStr) {
      const renderTime = Number(formRenderTimeStr);
      if (!isNaN(renderTime) && Date.now() - renderTime < 2000) {
        isTooFast = true;
      }
    }

    // ボットと判定された場合は保存・通知を行わず、エラーも出さずに「送信成功」を偽装
    if (isHoneypotFilled || isTooFast) {
      console.warn(`[Bot Detected] Honeypot=${isHoneypotFilled}, TooFast=${isTooFast}. Discarding silently.`);
      const dummyReview: Review = {
        id: `rev-${Date.now()}-mock`,
        nickname: rawNickname.trim().slice(0, 20) || "どんぐりさん",
        comment: rawComment.trim().slice(0, 256) || "",
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(
        { success: true, message: "温かいメッセージをありがとうございました！", review: dummyReview },
        { status: 201 }
      );
    }

    // 1. ニックネーム検証
    const nickResult = validateNickname(rawNickname);
    if (!nickResult.valid) {
      return NextResponse.json({ error: nickResult.error }, { status: 400 });
    }

    // 2. コメント検証
    const commentResult = validateComment(rawComment);
    if (!commentResult.valid) {
      return NextResponse.json({ error: commentResult.error }, { status: 400 });
    }

    // 3. 写真処理（フロントエンドでEXIF消去＆リサイズ済みのBlob）
    let userImage: { url: string; width: number; height: number } | undefined = undefined;

    if (photo instanceof File && photo.size > 0) {
      // 3MB 超過チェック
      if (photo.size > 3 * 1024 * 1024) {
        return NextResponse.json({ error: "写真は3MB以内にしてください。" }, { status: 400 });
      }

      const filename = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const buffer = Buffer.from(await photo.arrayBuffer());

      // 1. Supabase Storage への保存を試みる
      const supabaseUrl = await uploadImageToSupabase(buffer, `reviews/${filename}`, photo.type || "image/jpeg");

      if (supabaseUrl) {
        userImage = {
          url: supabaseUrl,
          width: 800,
          height: 800,
        };
      } else {
        // 2. 未設定または失敗時はローカルへフォールバック
        await fs.mkdir(REVIEW_UPLOAD_DIR, { recursive: true });
        const filePath = path.join(REVIEW_UPLOAD_DIR, filename);
        await fs.writeFile(filePath, buffer);

        userImage = {
          url: `/uploads/reviews/${filename}`,
          width: 800,
          height: 800,
        };
      }
    }

    // 4. データ作成（IPアドレスやUserAgent等は一切記録しない）
    const newReview: Review = {
      id: crypto.randomUUID(),
      nickname: nickResult.value,
      comment: commentResult.value,
      userImage,
      createdAt: new Date().toISOString(),
    };

    // 5. ストアへ永続化
    const reviews = await loadReviews();
    reviews.unshift(newReview);
    await saveReviews(reviews);

    // 6. 管理者へのLINE・メール非同期通知（レスポンスをブロックしない）
    notifyNewReview({
      nickname: newReview.nickname,
      comment: commentResult.value,
      hasPhoto: Boolean(userImage),
      createdAt: newReview.createdAt,
    }).catch((err) => console.error("[Review notification failed]", err));

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err) {
    console.error("[Review POST error]", err);
    return NextResponse.json({ error: "投稿処理中にエラーが発生しました。" }, { status: 500 });
  }
}
