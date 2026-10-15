"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";
type TurnstileFieldProps = {
  onToken: (token: string | null) => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile。サイトキー未設定時はデモ用プレースホルダー。
 * （getTurnstileSiteKey はビルド時に NEXT_PUBLIC_* を参照）
 */
export function TurnstileField({ onToken }: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const labelId = useId();

  const handleDemoVerify = useCallback(() => {
    onToken("demo-turnstile-token");
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) {
      onToken("demo-turnstile-token");
      return;
    }
    if (!scriptReady || !containerRef.current || !window.turnstile) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onToken, scriptReady, siteKey]);

  if (!siteKey) {
    return (
      <div
        className="rounded-[1.5rem] border-2 border-dashed border-acorn-300 bg-cream-100 px-5 py-4"
        role="group"
        aria-labelledby={labelId}
      >
        <p id={labelId} className="font-klee text-base font-semibold text-acorn-800">
          いたずら防止の確認
        </p>
        <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-acorn-800/80">
          本番公開時に自動で表示されます。いまはデモのため、下のボタンで「確認済み」にできます。
        </p>
        <button
          type="button"
          onClick={handleDemoVerify}
          className="mt-3 min-h-11 rounded-full bg-white px-5 font-sans text-sm font-bold text-acorn-800 shadow-xs transition hover:bg-cream-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500 border border-acorn-200/60"
        >
          確認しました（デモ）
        </button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" aria-label="スパム防止の確認" />
    </>
  );
}
