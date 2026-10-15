import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

/** Supabase 環境変数が設定されているか判定 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/**
 * サーバー側 Supabase クライアントを取得（サービスロール優先）
 * 未設定環境では null を返却
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseInstance;
}

export const SUPABASE_STORAGE_BUCKET = "morikara-images";

/**
 * Supabase Storage への画像アップロード
 * 成功時は Public URL を返却、未設定または失敗時は null
 */
export async function uploadImageToSupabase(
  buffer: Buffer | Uint8Array,
  filename: string,
  contentType: string = "image/jpeg"
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(filename, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("[Supabase Storage error]", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("[uploadImageToSupabase error]", err);
    return null;
  }
}
