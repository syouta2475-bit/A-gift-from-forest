import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { checkAdminAuthFromRequest } from "@/lib/auth";
import { uploadImageToSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  const isAuth = await checkAdminAuthFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "ファイルが送信されていません。" }, { status: 400 });
    }

    // 5MB 制限
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "ファイルサイズは5MB以内にしてください。" }, { status: 400 });
    }

    const mime = file.type;
    const allowedMimes: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
    };

    const ext = allowedMimes[mime] || path.extname(file.name) || ".jpg";
    const filename = `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Supabase Storage への保存を試みる
    const supabaseUrl = await uploadImageToSupabase(buffer, `works/${filename}`, mime || "image/jpeg");
    if (supabaseUrl) {
      return NextResponse.json({ success: true, url: supabaseUrl });
    }

    // Vercel本番環境またはSupabase設定時はローカルファイルシステムへの書き込みを行わない（EROFS防止）
    if (process.env.VERCEL || Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
      console.error("[Upload error] Supabase Storage upload failed in production.");
      return NextResponse.json(
        { error: "画像の保存に失敗しました。Supabase Storageのアクセス設定を確認してください。" },
        { status: 500 }
      );
    }

    // 2. ローカル開発環境のみローカルストレージへ保存
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("[Upload error]", err);
    return NextResponse.json({ error: "画像の保存に失敗しました。" }, { status: 500 });
  }
}
