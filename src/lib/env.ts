/** microCMS の口コミ取得が使えるか（サーバー専用） */
export function isMicroCmsConfigured(): boolean {
  return Boolean(process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY);
}

export function getTurnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}

export function getTurnstileSecretKey(): string | undefined {
  return process.env.TURNSTILE_SECRET_KEY;
}
