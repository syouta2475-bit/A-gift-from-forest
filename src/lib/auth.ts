/**
 * 管理者認証ヘルパー（Web Crypto API を使用し、Edge Middleware と Node.js 双方で完全動作）
 */

export const ADMIN_COOKIE_NAME = "mori_admin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7日間

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || "mori-karuizawa-kawagoe-secret-key-2026";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "mori2026admin";
}

/** Web Crypto API による HMAC-SHA256 署名の生成 */
async function sign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** トークンの生成 */
export async function createAdminToken(): Promise<string> {
  const payload = {
    role: "admin",
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = await sign(payloadStr, getSecretKey());
  return `${payloadStr}.${signature}`;
}

/** トークンの検証 */
export async function verifyAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadStr, signature] = parts;
  try {
    const expectedSig = await sign(payloadStr, getSecretKey());
    if (expectedSig !== signature) return false;

    const payload = JSON.parse(atob(payloadStr)) as { role?: string; exp?: number };
    if (payload.role !== "admin") return false;
    if (!payload.exp || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

/** Cookie オプション */
export function getAdminCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/** NextRequest または Request からセッションCookieを抽出して認証を検証 */
export async function checkAdminAuthFromRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_COOKIE_NAME}=`));

  if (!match) return false;
  const token = match.substring(ADMIN_COOKIE_NAME.length + 1);
  return verifyAdminToken(token);
}

