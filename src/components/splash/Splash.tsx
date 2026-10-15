"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SplashProps = {
  /** スプラッシュ演出が終わった（または「スキップ」された）ときに呼ばれる */
  onComplete: () => void;
};

const SPLASH_DURATION_MS = 5200;

const splashStyles = `
  @keyframes drawRingSlow {
    0% { stroke-dashoffset: 1100; transform: rotate(-18deg) scale(0.95); opacity: 0; }
    15% { opacity: 1; }
    100% { stroke-dashoffset: 0; transform: rotate(0deg) scale(1); opacity: 1; }
  }
  @keyframes gentleRotate {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(3deg); }
  }
  @keyframes revealSoft {
    0% { opacity: 0; transform: scale(0.92) translateY(8px); }
    70% { opacity: 1; transform: scale(1.01) translateY(-1px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes slideInTop {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInBottom {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes owlFlySmooth {
    0%   { opacity: 0; transform: translate(-170px, -130px) rotate(22deg) scale(0.55); }
    12%  { opacity: 1; }
    45%  { transform: translate(-65px, -45px) rotate(-10deg) scale(0.92); }
    78%  { transform: translate(-12px, -14px) rotate(6deg) scale(1.03); }
    92%  { transform: translate(0px, 2px) rotate(-2deg) scale(0.99); }
    100% { opacity: 1; transform: translate(0px, 0px) rotate(0deg) scale(1); }
  }
  @keyframes wingFlapL {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(38deg); }
  }
  @keyframes wingFlapR {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-38deg); }
  }
  @keyframes walkHedgehog {
    0% { opacity: 0; transform: translateX(36px); }
    30% { opacity: 1; }
    100% { opacity: 1; transform: translateX(0px); }
  }
  @keyframes fadeUpSlow {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .splash-ring-anim {
    stroke-dasharray: 1100;
    will-change: transform, stroke-dashoffset;
    animation: drawRingSlow 3.0s cubic-bezier(0.25, 1, 0.5, 1) forwards,
               gentleRotate 8s ease-in-out 3.0s infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
  .splash-center-anim {
    opacity: 0;
    will-change: transform, opacity;
    animation: revealSoft 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards;
    transform-box: fill-box;
    transform-origin: center;
  }
  .splash-top-anim {
    opacity: 0;
    will-change: transform, opacity;
    animation: slideInTop 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
  }
  .splash-bot-anim {
    opacity: 0;
    will-change: transform, opacity;
    animation: slideInBottom 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
  }
  .splash-owl-fly {
    opacity: 0;
    will-change: transform, opacity;
    animation: owlFlySmooth 2.6s cubic-bezier(0.22, 1, 0.36, 1) 1.8s forwards;
    transform-box: fill-box;
    transform-origin: center;
  }
  .splash-wing-l {
    will-change: transform;
    animation: wingFlapL 0.32s ease-in-out 1.8s 7;
    transform-box: fill-box;
    transform-origin: right center;
  }
  .splash-wing-r {
    will-change: transform;
    animation: wingFlapR 0.32s ease-in-out 1.8s 7;
    transform-box: fill-box;
    transform-origin: left center;
  }
  .splash-walk-in {
    opacity: 0;
    will-change: transform, opacity;
    animation: walkHedgehog 2.4s ease-out 1.4s forwards;
    transform-box: fill-box;
    transform-origin: center;
  }
  .splash-concept-anim {
    opacity: 0;
    animation: fadeUpSlow 1.6s ease-out 2.0s forwards;
  }
`;

export function Splash({ onComplete }: SplashProps) {
  const reduceMotion = useReducedMotion();

  // 一定時間で自動的に終了（動きを減らす設定の場合は短く）
  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 1500 : SPLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  // 演出中は背面のスクロールを止める
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-label="森からのおくりもの 読み込み中の演出"
      className="fixed inset-0 z-50 w-full max-w-[100vw] h-full overflow-hidden flex flex-col justify-between items-center select-none"
      style={{
        backgroundImage: `
          radial-gradient(#C8B9A6 1.2px, transparent 1.2px),
          linear-gradient(155deg, #FCECE8 0%, #FAF6EE 46%, #E6F2E4 100%)
        `,
        backgroundSize: "24px 24px, 100% 100%",
      }}
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
    >
      <style>{splashStyles}</style>

      {/* ── 1. 上部ガーランド（スマホ〜PC全幅で左右に美しく広がる） ── */}
      <div className="w-full flex justify-center pointer-events-none flex-shrink-0 pt-1 sm:pt-2">
        <svg
          viewBox="0 0 393 75"
          className="w-full max-w-4xl h-auto max-h-[10vh] overflow-visible flex-shrink-0"
        >
          <defs>
            <filter id="chalk-clean-top" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" result="wobble" />
              <feDisplacementMap in="SourceGraphic" in2="wobble" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* 上端ガーランド枝葉 */}
          <g className="splash-top-anim" filter="url(#chalk-clean-top)" stroke="#5A4030" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M -30 12 C 45 28, 95 62, 150 45" strokeWidth="3.2" />
            <path d="M 38 26 C 28 48, 48 54, 54 32 Z" fill="#8FA389" fillOpacity="0.55" strokeWidth="2.6" />
            <path d="M 88 46 C 80 66, 98 70, 104 50 Z" fill="#8FA389" fillOpacity="0.55" strokeWidth="2.6" />
            <path d="M 112 48 C 120 30, 136 38, 124 52 Z" fill="#FAF7F2" strokeWidth="2.6" />
            <g transform="translate(62, 64) rotate(10) scale(0.72)" strokeWidth="3.4">
              <path d="M 0 -24 L -18 -8 L -9 -6 L -22 10 L 22 10 L 9 -6 L 18 -8 Z" fill="#EFE6D8" />
              <path d="M -9 -2 L 0 -11 L 9 -2 L 0 7 Z" fill="#FAF7F2" />
            </g>
            <path d="M 423 10 C 345 30, 290 64, 240 48" strokeWidth="3.2" />
            <path d="M 352 26 C 362 48, 342 54, 336 32 Z" fill="#8FA389" fillOpacity="0.55" strokeWidth="2.6" />
            <path d="M 298 48 C 306 66, 288 70, 282 52 Z" fill="#8FA389" fillOpacity="0.55" strokeWidth="2.6" />
            <g transform="translate(328, 64) rotate(-14) scale(0.6)" strokeWidth="3.6">
              <path d="M -20 -6 C -22 22, -10 38, 0 42 C 10 38, 22 22, 20 -6 Z" fill="#FAF7F2" />
              <path d="M -25 -6 C -26 -24, 26 -24, 25 -6 Z" fill="#D4B595" />
              <path d="M 0 -20 L 3 -28" />
            </g>
            <circle cx="172" cy="58" r="4.5" fill="#E6C280" stroke="none" opacity="0.75" />
            <circle cx="222" cy="50" r="6" fill="#E6C280" stroke="none" opacity="0.55" />
          </g>
        </svg>
      </div>

      {/* ── 2. 中央エリア（スマホでは縦並び、PCでは絵本見開きの横並び） ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 my-auto flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-12 lg:gap-16 max-h-[58vh]">
        {/* 円環ロゴSVG（左側 / スマホでは上） */}
        <div className="flex justify-center items-center flex-shrink-0">
          <svg
            viewBox="0 0 393 393"
            className="w-[240px] sm:w-[275px] md:w-[310px] lg:w-[350px] max-h-[35vh] md:max-h-[46vh] h-auto overflow-visible flex-shrink-0"
          >
            <defs>
              <filter id="chalk-clean-center" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" result="wobble" />
                <feDisplacementMap in="SourceGraphic" in2="wobble" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <path id="big-ring-en" d="M -122,-74 A 142,142 0 0,1 122,-74" />
            </defs>

            {/* 中央の大円環ロゴ */}
            <g transform="translate(196.5, 196.5)" stroke="#5A4030" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle className="splash-center-anim" cx="0" cy="0" r="158" fill="#FAF7F2" opacity="0.94" stroke="none" />
              <circle className="splash-center-anim" cx="0" cy="0" r="146" fill="#EFE6D8" opacity="0.38" stroke="none" />

              <g className="splash-ring-anim">
                <circle cx="0" cy="0" r="162" strokeWidth="3.2" />
                <circle cx="0" cy="0" r="130" strokeWidth="2.2" strokeDasharray="7 5" />
                <path d="M -162 -12 C -180 -24, -176 -42, -158 -28 Z" fill="#8FA389" fillOpacity="0.6" strokeWidth="2.6" />
                <path d="M -162 14 C -180 26, -174 44, -158 30 Z" fill="#8FA389" fillOpacity="0.6" strokeWidth="2.6" />
                <circle cx="-168" cy="1" r="4.5" fill="#E6A99A" strokeWidth="2" />
                <path d="M 162 -12 C 180 -24, 176 -42, 158 -28 Z" fill="#8FA389" fillOpacity="0.6" strokeWidth="2.6" />
                <path d="M 162 14 C 180 26, 174 44, 158 30 Z" fill="#8FA389" fillOpacity="0.6" strokeWidth="2.6" />
                <circle cx="168" cy="1" r="4.5" fill="#E6C280" strokeWidth="2" />
              </g>

              <g className="splash-center-anim">
                <text
                  fontSize="16.5"
                  fill="#6E523F"
                  stroke="#6E523F"
                  strokeWidth="0.4"
                  letterSpacing="2.2"
                  style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive" }}
                >
                  <textPath href="#big-ring-en" startOffset="50%" textAnchor="middle">
                    * A gift from the forest *
                  </textPath>
                </text>
              </g>

              <g className="splash-center-anim">
                <g filter="url(#chalk-clean-center)" transform="scale(1.28)">
                  {/* 非対称の「森」作字 */}
                  <g transform="translate(0, -35)">
                    <g transform="translate(-2, -26) rotate(-3)">
                      <path d="M -28 2 C -10 -5, 12 -6, 30 -1" strokeWidth="4.2" />
                      <path d="M -1 -20 C 2 -6, 1 8, -1 18" strokeWidth="4.5" />
                      <path d="M -2 -2 C -14 1, -28 10, -32 16 C -18 19, -6 10, -2 -2 Z" fill="#8FA389" fillOpacity="0.55" strokeWidth="3" />
                      <path d="M 1 -2 C 12 4, 22 10, 28 13" strokeWidth="3.8" />
                      <circle cx="29" cy="14" r="4" fill="#E6A99A" strokeWidth="2.2" />
                      <path d="M 14 5 C 22 -2, 28 4, 18 9 Z" fill="#8FA389" fillOpacity="0.55" strokeWidth="2.4" />
                      <path d="M -1 -20 C -11 -28, -2 -35, 2 -22 Z" fill="#8FA389" fillOpacity="0.6" strokeWidth="2.4" />
                    </g>
                    <g transform="translate(-33, 20) rotate(-5)">
                      <path d="M -22 -2 C -6 -6, 8 -5, 18 -3" strokeWidth="4" />
                      <path d="M -1 -16 C -2 0, 0 12, -2 24" strokeWidth="4.2" />
                      <path d="M -2 -3 C -12 2, -22 12, -25 18 C -14 20, -4 11, -2 -3 Z" fill="#8FA389" fillOpacity="0.5" strokeWidth="2.8" />
                      <path d="M 0 -2 C 7 3, 13 8, 16 11" strokeWidth="3.6" />
                      <circle cx="-16" cy="-10" r="3.5" fill="#E6C280" strokeWidth="2" />
                    </g>
                    <g transform="translate(31, 18) rotate(4)">
                      <path d="M -18 -3 C -4 -7, 12 -6, 26 -1" strokeWidth="4.2" />
                      <path d="M 1 -18 C 0 -2, 2 12, 1 26" strokeWidth="4.4" />
                      <path d="M 0 -3 C -7 4, -13 10, -17 13" strokeWidth="3.6" />
                      <path d="M 2 -3 C 14 1, 26 10, 30 17 C 17 19, 6 10, 2 -3 Z" fill="#8FA389" fillOpacity="0.55" strokeWidth="3" />
                      <path d="M -11 -11 C -18 -19, -8 -23, -6 -13 Z" fill="#FAF7F2" strokeWidth="2.2" />
                    </g>
                  </g>

                  <text
                    x="0"
                    y="26"
                    textAnchor="middle"
                    fontSize="25"
                    fill="#5A4030"
                    stroke="#5A4030"
                    strokeWidth="0.7"
                    letterSpacing="6"
                    style={{ fontFamily: "var(--font-zen-maru), 'Zen Maru Gothic', sans-serif", fontWeight: 700 }}
                  >
                    からの
                  </text>
                  <text
                    x="0"
                    y="60"
                    textAnchor="middle"
                    fontSize="31"
                    fill="#5A4030"
                    stroke="#5A4030"
                    strokeWidth="0.7"
                    letterSpacing="3"
                    style={{ fontFamily: "var(--font-zen-maru), 'Zen Maru Gothic', sans-serif", fontWeight: 700 }}
                  >
                    おくりもの
                  </text>

                  <g transform="translate(14, 96) scale(0.62)" strokeWidth="3.8">
                    <path d="M -38 -14 C -40 -52, 40 -52, 42 -12 C 44 10, 47 24, 37 32" fill="#FAF7F2" />
                    <path d="M -38 -14 C -42 8, -44 22, -35 30" />
                    <path d="M -29 -6 C -30 23, 28 23, 29 -6" fill="#FAF7F2" />
                    <path d="M -36 -12 C -26 -2, -12 -4, -10 -15 C -14 -2, 4 -2, 8 -14 C 6 -2, 24 -2, 38 -12" />
                    <circle cx="-12" cy="4" r="3" fill="#5A4030" stroke="none" />
                    <circle cx="12" cy="4" r="3" fill="#5A4030" stroke="none" />
                    <path d="M -5 13 Q 0 18 6 13" />
                    <circle cx="-19" cy="10" r="5.5" fill="#E6A99A" opacity="0.55" stroke="none" />
                    <circle cx="19" cy="10" r="5.5" fill="#E6A99A" opacity="0.55" stroke="none" />
                    <ellipse cx="-16" cy="28" rx="7" ry="4.5" fill="#FAF7F2" />
                    <ellipse cx="16" cy="28" rx="7" ry="4.5" fill="#FAF7F2" />
                  </g>
                  <g transform="translate(-32, 98) scale(0.58)" strokeWidth="3.8">
                    <path d="M -22 4 L 0 -28 L 22 4" fill="#FAF7F2" />
                    <path d="M -16 4 L -16 24 M 16 4 L 16 24" />
                    <path d="M -4 24 V 14 A 4 4 0 0 1 4 14 V 24" />
                  </g>
                </g>
              </g>

              {/* 飛んでくるどんぐりフクロウ（入れ子ネストでtranslate上書きを防止） */}
              <g transform="translate(34, -90) scale(1.22)">
                <g className="splash-owl-fly" strokeWidth="2.8">
                  <path className="splash-wing-l" d="M -14 0 C -28 -6, -30 8, -15 12 Z" fill="#EFE6D8" />
                  <path className="splash-wing-r" d="M 14 0 C 28 -6, 30 8, 15 12 Z" fill="#EFE6D8" />
                  <path d="M -15 -6 C -18 11, -11 22, 0 22 C 11 22, 18 11, 15 -6 Z" fill="#FAF7F2" />
                  <path d="M -17 -6 C -17 -18, 17 -18, 17 -6 Q 0 -3 -17 -6 Z" fill="#D4B595" />
                  <path d="M 0 -15 L 2 -21" strokeWidth="2.8" />
                  <circle cx="-5.5" cy="-1" r="4.8" fill="#FAF7F2" strokeWidth="2.2" />
                  <circle cx="5.5" cy="-1" r="4.8" fill="#FAF7F2" strokeWidth="2.2" />
                  <circle cx="-5" cy="-1" r="1.8" fill="#5A4030" stroke="none" />
                  <circle cx="5" cy="-1" r="1.8" fill="#5A4030" stroke="none" />
                  <polygon points="-2,1 2,1 0,5" fill="#E6C280" strokeWidth="1.5" />
                  <path d="M -4 22 L -4 25 M 4 22 L 4 25" strokeWidth="2.4" />
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* コンセプト文字ブロック（右側 / スマホでは下） */}
        <div
          className="splash-concept-anim flex flex-col items-center md:items-start text-center md:text-left px-2"
          style={{ fontFamily: "var(--font-zen-maru), 'Zen Maru Gothic', sans-serif" }}
        >
          <p className="text-[17px] sm:text-[18px] md:text-[21px] lg:text-[23px] font-bold text-[#4A3325] tracking-[0.14em] mb-2 sm:mb-3 px-2 md:px-0 bg-gradient-to-t from-[#E6C280]/45 to-transparent inline-block whitespace-nowrap">
            自然の恵みを、暮らしのそばに。
          </p>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-medium leading-[2.05] md:leading-[2.2] tracking-[0.12em] text-[#5A4030]">
            森で出会った木の実たちが、<br />
            ちいさな家や仲間になって<br />
            あなたを待っています。
          </p>
        </div>
      </div>

      {/* ── 3. 足元の北欧の家・ツリー・丘を歩くハリネズミ（PCでも画面端まで美しく繋がる構造） ── */}
      <div className="w-full relative flex justify-center items-end flex-shrink-0">
        {/* PC大画面でも画面左右端まで続く丘のベースカラーグラウンド */}
        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 md:h-14 bg-[#EFE6D8]/65 pointer-events-none" />

        <svg
          viewBox="0 0 393 155"
          className="relative z-10 w-full max-w-[420px] md:max-w-xl lg:max-w-2xl h-auto max-h-[18vh] md:max-h-[22vh] overflow-visible flex-shrink-0"
        >
          <defs>
            <filter id="chalk-clean-bot" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" result="wobble" />
              <feDisplacementMap in="SourceGraphic" in2="wobble" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          <g className="splash-bot-anim" stroke="#5A4030" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* 左右端まで自然に伸びる丘の塗り */}
            <path d="M -120 105 Q 110 68 230 98 T 520 88 L 520 165 L -120 165 Z" fill="#EFE6D8" opacity="0.65" stroke="none" />
            <path d="M -120 120 Q 196.5 82 520 115 L 520 165 L -120 165 Z" fill="#8FA389" opacity="0.22" stroke="none" />
            <path d="M -120 102 Q 196.5 68 520 102" strokeWidth="3" filter="url(#chalk-clean-bot)" />

            <g filter="url(#chalk-clean-bot)">
              {/* 左側：北欧の細長い家とツリー */}
              <g transform="translate(68, 42) scale(0.76)" strokeWidth="3.4">
                <path d="M -28 -22 L -32 72 Q 0 76 32 72 L 28 -22 Z" fill="#FAF7F2" />
                <path d="M 0 -92 C -12 -64, -24 -38, -38 -22 Q 0 -16 38 -22 C 24 -38, 12 -64, 0 -92 Z" fill="#EFE6D8" />
                <circle cx="0" cy="-95" r="4" fill="#5A4030" />
                <path d="M -14 -53 Q 0 -43 14 -53 M -24 -35 Q 0 -25 24 -35" />
                <path d="M -12 4 V -6 A 12 12 0 0 1 12 -6 V 4 Z" fill="#E6C280" fillOpacity="0.55" />
                <path d="M -10 73 V 46 A 10 10 0 0 1 10 46 V 73" fill="#D4B595" fillOpacity="0.5" />
              </g>
              <g transform="translate(128, 56) scale(0.66)" strokeWidth="3.4">
                <path d="M 0 -65 L -32 52 Q 0 58 32 52 Z" fill="#8FA389" fillOpacity="0.45" />
                <circle cx="-6" cy="8" r="9" fill="#FAF7F2" />
                <circle cx="10" cy="24" r="10" fill="#FAF7F2" />
                <path d="M -12 -24 L 0 -14 L 12 -24" />
              </g>
            </g>

            {/* 右側：丘の上をトコトコ歩くハリネズミ（入れ子ネストでtranslate上書きを防止） */}
            <g transform="translate(308, 66) scale(0.72)">
              <g className="splash-walk-in" strokeWidth="3.4">
                <path d="M -22 -24 L -6 -38 L -2 -26 L 16 -38 L 18 -24 L 38 -34 L 36 -18 L 56 -22 L 48 -6 L 64 4 L 46 14 L 54 26 L 32 26 L 28 32 L -20 28 Z" fill="#EFE6D8" />
                <path d="M -8 -14 L 8 -22 L 4 -6 L -8 -2 M 12 -12 L 28 -18 L 24 -2 L 10 0" />
                <path d="M -20 -24 C -42 -18, -62 -4, -66 6 C -62 18, -40 26, -20 26 Z" fill="#FAF7F2" />
                <circle cx="-66" cy="5" r="4.5" fill="#5A4030" /><circle cx="-42" cy="-2" r="3" fill="#5A4030" />
                <ellipse cx="-32" cy="28" rx="8" ry="5" fill="#FAF7F2" /><ellipse cx="18" cy="29" rx="8" ry="5" fill="#FAF7F2" />
                <g transform="translate(-78, 16) rotate(-10)">
                  <path d="M -4 0 L -5 14 L 5 14 L 4 0" fill="#FAF7F2" />
                  <path d="M -15 2 C -15 -13, 15 -13, 15 2 Z" fill="#E6A99A" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* スキップボタン */}
      <button
        type="button"
        id="splash-skip"
        onClick={onComplete}
        className="glass absolute bottom-5 right-5 z-20 min-h-10 rounded-full px-5 py-1.5 text-sm font-bold text-acorn-700 transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500 shadow-xs"
      >
        スキップ
      </button>
    </motion.div>
  );
}
