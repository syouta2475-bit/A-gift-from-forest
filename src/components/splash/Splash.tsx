"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type SplashProps = {
  /** スプラッシュ演出が終わった（または「SKIP」された）ときに呼ばれるコールバック */
  onComplete: () => void;
};

/** 表示開始からフェードアウト開始までの時間（2.8秒） */
const SPLASH_DISPLAY_DURATION_MS = 2800;

/**
 * NSL風「文字のみスプラッシュ画面」
 * - 生成りベージュ（#F6EFE6）の背景
 * - 深煎りブラウン（#4E210F）の明朝体（Shippori Mincho）
 * - 余計なロゴやイラストは出さず、コピーのみがブラーから静かにクリアに浮かび上がる
 * - 2.8秒後に1.0秒かけて滑らかにフェードアウト
 * - 右下に控えめなSKIPボタン
 */
export function Splash({ onComplete }: SplashProps) {
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, SPLASH_DISPLAY_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setSkipped(true);
    onComplete();
  };

  return (
    <motion.aside
      key="nsl-splash"
      aria-label="オープニング演出"
      aria-live="polite"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F6EFE6] text-[#4E210F] select-none px-6"
    >
      {/* 画面中央の静かなコピー */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto">
        {/* メインコピー：「森のぬくもりを、てのひらに」 */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(14px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.25,
          }}
          className="font-shippori text-2xl sm:text-3xl md:text-[2rem] font-medium tracking-[0.22em] text-[#4E210F] leading-[1.8]"
        >
          森のぬくもりを、てのひらに
        </motion.h1>

        {/* サブコピー：「～ A gift from the forest ～」 */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.85,
          }}
          className="font-shippori text-xs sm:text-sm md:text-[15px] tracking-[0.2em] text-[#4E210F]/70 mt-4 sm:mt-6 font-normal"
        >
          ～ A gift from the forest ～
        </motion.p>
      </div>

      {/* 右下の控えめなSKIPボタン */}
      <motion.button
        type="button"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase text-[#4E210F]/45 hover:text-[#4E210F] transition-colors py-1.5 px-3 rounded-full hover:bg-[#4E210F]/5 focus:outline-hidden"
      >
        SKIP
      </motion.button>
    </motion.aside>
  );
}

export default Splash;
