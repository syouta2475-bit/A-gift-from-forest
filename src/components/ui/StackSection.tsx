"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

type StackSectionProps = {
  children: ReactNode;
  /** 上の角を丸くして「カード」らしく見せるか（最初のセクションは false） */
  rounded?: boolean;
};

/**
 * Sticky Stacking：スクロールすると、次のセクションが前のセクションの上に
 * カードのように重なっていく。
 *
 * - 画面より縦に長いセクションでも、最後まで読めるようにする。
 *   → 「下端が画面の下端に揃った位置」で貼り付く（top = 画面の高さ - セクションの高さ）
 * - 次のカードが覆いかぶさるにつれ、下のカードは少し縮んで暗くなる（奥行き感）
 *
 * 注意：次に重なるセクションは、同じ親の中で data-stack-section を持つ兄弟要素として探す。
 */
export function StackSection({ children, rounded = true }: StackSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // state を使わず MotionValue で更新（再描画を起こさず滑らか）
  const top = useMotionValue(0);
  const progress = useMotionValue(0); // 0: 重なっていない → 1: 完全に覆われた
  const scale = useTransform(progress, [0, 1], [1, 0.94]);
  const dim = useTransform(progress, [0, 1], [0, 0.3]);

  // 貼り付く位置の計算（長いセクションは上側がはみ出す位置で貼り付く）
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => top.set(Math.min(0, window.innerHeight - el.offsetHeight));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [top]);

  // 次のカードがどれだけ重なっているか（動きを減らす設定の場合は何もしない）
  useEffect(() => {
    if (reduceMotion) return;
    const el = wrapRef.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let next = el.nextElementSibling as HTMLElement | null;
      while (next && next.dataset.stackSection !== "true") {
        next = next.nextElementSibling as HTMLElement | null;
      }
      if (!next) {
        progress.set(0);
        return;
      }
      const nextTop = next.getBoundingClientRect().top;
      progress.set(Math.min(1, Math.max(0, 1 - nextTop / window.innerHeight)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [progress, reduceMotion]);

  return (
    <motion.div ref={wrapRef} data-stack-section="true" style={{ top }} className="sticky">
      <motion.div
        style={{ scale: reduceMotion ? 1 : scale }}
        className={`relative overflow-hidden ${
          rounded ? "rounded-t-[2.5rem] shadow-[0_-14px_40px_rgb(107_68_35/0.2)]" : ""
        }`}
      >
        {children}
        {/* 覆われるにつれて暗くなる膜 */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: reduceMotion ? 0 : dim }}
          className="pointer-events-none absolute inset-0 z-30 bg-acorn-900"
        />
      </motion.div>
    </motion.div>
  );
}
