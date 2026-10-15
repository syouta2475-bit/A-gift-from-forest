"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Splash } from "@/components/splash/Splash";
import { Hero } from "@/components/hero/Hero";

/** 「このセッションですでにスプラッシュを見た」目印（sessionStorage） */
const SESSION_KEY = "mori-splash-seen";

type Visit = "unknown" | "new" | "seen";

// sessionStorage はブラウザ内だけで変わるので、購読は不要
const subscribe = () => () => {};

function getClientVisit(): Visit {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) ? "seen" : "new";
  } catch {
    // プライベートモード等で使えない場合は毎回表示
    return "new";
  }
}

// サーバー描画時（および水和中）は判定できないので "unknown"
const getServerVisit = (): Visit => "unknown";

/**
 * ファーストビュー：Splash → Hero の遷移を管理する。
 * - 1セッションに1回だけ Splash を表示（sessionStorage）
 * - 判定が終わるまでは cream の幕で隠し、Hero や Splash がチラつくのを防ぐ
 */
export function FirstView() {
  const visit = useSyncExternalStore(subscribe, getClientVisit, getServerVisit);
  const [splashDone, setSplashDone] = useState(false);

  const handleComplete = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // 保存できなくても動作には影響なし
    }
    setSplashDone(true);
  }, []);

  const showSplash = visit === "new" && !splashDone;
  const showCover = visit === "unknown";
  // 2回目以降のアクセスは、判定でき次第すぐ Hero を表示
  const heroReady = visit === "seen" || splashDone;

  return (
    <>
      <Hero ready={heroReady} />

      <AnimatePresence>
        {showCover && (
          <motion.div
            key="cover"
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-cream-100"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          />
        )}
        {showSplash && <Splash key="splash" onComplete={handleComplete} />}
      </AnimatePresence>
    </>
  );
}
