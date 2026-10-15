"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 表示開始までの待ち時間（秒）。並べた要素を順番に出したいときに使う */
  delay?: number;
  /** 下から浮かび上がる距離（px） */
  y?: number;
};

/**
 * Scroll Reveal：画面に入ったとき、下からスッと浮かび上がる。
 * 動きを減らす設定のユーザーには、位置は動かさずフェードのみ。
 */
export function Reveal({ children, className, delay = 0, y = 48 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
