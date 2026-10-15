import React from 'react';

// 1. 共通チョークフィルター定義（レイアウトのルートまたはHeader内に1つ配置）
export const ChalkFilterDefs = () => (
  <svg width="0" height="0" className="absolute pointer-events-none">
    <defs>
      <filter id="chalk-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="5" result="wobble"/>
        <feDisplacementMap in="SourceGraphic" in2="wobble" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="wobbled"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="2" result="grain"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 -1.25 1.45" in="grain" result="mask"/>
        <feComposite in="wobbled" in2="mask" operator="in"/>
      </filter>
      <filter id="chalk-rough" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="8" result="wobble"/>
        <feDisplacementMap in="SourceGraphic" in2="wobble" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="wobbled"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="4" result="grain"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 -1.2 1.4" in="grain" result="mask"/>
        <feComposite in="wobbled" in2="mask" operator="in"/>
      </filter>
    </defs>
  </svg>
);

// 2. メインロゴ（Heroセクションの中央メインタイトル＆フッター等に大きく配置）
export const MainLogo = ({ className = "w-80 md:w-96 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 340 245" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(192, 92)">
        <path d="M -38 -14 C -40 -52, 40 -52, 42 -12 C 44 10, 47 24, 37 32 C 30 37, 22 31, 25 25" fill="#FAF7F2"/>
        <path d="M -38 -14 C -42 8, -44 22, -35 30 C -28 35, -21 29, -24 23"/>
        <path d="M -29 -6 C -30 23, 28 23, 29 -6" fill="#FAF7F2"/>
        <path d="M -36 -12 C -26 -2, -12 -4, -10 -15 C -10 -20, -16 -20, -15 -13 C -14 -2, 4 -2, 8 -14 C 9 -19, 3 -19, 4 -12 C 6 -2, 24 -2, 38 -12"/>
        <circle cx="-12" cy="4" r="2.4" fill="#5A4030" stroke="none"/>
        <circle cx="12" cy="4" r="2.4" fill="#5A4030" stroke="none"/>
        <path d="M -5 13 C -2 17, 4 17, 7 13" strokeWidth="2.8"/>
        <circle cx="-19" cy="10" r="5.5" fill="#E6A99A" opacity="0.55" stroke="none"/>
        <circle cx="19" cy="10" r="5.5" fill="#E6A99A" opacity="0.55" stroke="none"/>
        <ellipse cx="-16" cy="30" rx="7" ry="4.5" fill="#FAF7F2" strokeWidth="2.8"/>
        <ellipse cx="16" cy="30" rx="7" ry="4.5" fill="#FAF7F2" strokeWidth="2.8"/>
      </g>
      <g transform="translate(98, 96)">
        <path d="M -22 4 L 0 -28 L 22 4" fill="#FAF7F2" strokeWidth="3"/>
        <path d="M -10 -12 C -5 -6, 0 -6, 0 -12 C 0 -6, 5 -6, 10 -12" strokeWidth="2.4"/>
        <path d="M -16 -2 C -10 4, -5 4, 0 -2 C 5 4, 10 4, 16 -2" strokeWidth="2.4"/>
        <path d="M -16 4 L -16 26 M 16 4 L 16 26" strokeWidth="2.8"/>
        <path d="M -4 26 L -4 15 C -4 10, 4 10, 4 15 L 4 26" strokeWidth="2.4"/>
        <g transform="translate(40, 4) rotate(8) scale(0.85)">
          <path d="M 0 -26 L -14 -14 L -7 -12 L -20 0 L -10 2 L -22 14 L -8 22 L 8 22 L 22 14 L 10 2 L 20 0 L 7 -12 L 14 -14 Z" fill="#EFE6D8" stroke="none"/>
          <path d="M -3 -20 L 0 -28 L 3 -20" strokeWidth="2.8"/>
          <path d="M -3 -16 L -15 -14 L -10 -7 L -2 -9" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M 3 -16 L 15 -14 L 10 -7 L 2 -9" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M -6 -13 L 0 -19 L 6 -13 L 0 -8 Z" fill="#FAF7F2" strokeWidth="2.6"/>
          <path d="M -6 -6 L -21 -2 L -15 6 L -3 2" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M 6 -6 L 21 -2 L 15 6 L 3 2" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M -8 -2 L 0 -8 L 8 -2 L 0 5 Z" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M -7 6 L -22 12 L -14 19 L -3 14" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M 7 6 L 22 12 L 14 19 L 3 14" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M -8 10 L 0 4 L 8 10 L 0 17 Z" fill="#FAF7F2" strokeWidth="2.8"/>
          <path d="M -12 18 Q -6 24 0 21 Q 6 24 12 18" strokeWidth="2.8"/>
        </g>
      </g>
      <path d="M 52 122 L 142 122 M 198 122 L 288 122" strokeWidth="2.6"/>
      <path d="M 52 122 C 38 118, 38 106, 50 112 Z" fill="#FAF7F2" strokeWidth="2.3"/>
      <path d="M 288 122 C 302 118, 302 106, 290 112 Z" fill="#FAF7F2" strokeWidth="2.3"/>
      <g transform="translate(170, 162)">
        <text x="0" y="0" textAnchor="middle" fontSize="27" fill="#5A4030" stroke="#5A4030" strokeWidth="0.4" letterSpacing="4" style={{ fontFamily: "var(--font-klee), 'Klee One', cursive", fontWeight: 600 }}>森からのおくりもの</text>
        <text x="0" y="32" textAnchor="middle" fontSize="18.5" fill="#6E523F" stroke="none" letterSpacing="2" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive" }}>~ A gift from the forest ~</text>
        <path d="M -45 46 L -12 46 M 12 46 L 45 46" strokeWidth="2"/>
        <circle cx="0" cy="46" r="3" fill="#5A4030" stroke="none"/>
      </g>
    </g>
  </svg>
);

// 3. 北欧風の細長い家（ムーミンハウス風）：Conceptセクションのメイン挿絵、および背景の大きな透かしイラスト
export const NordicHouseIllust = ({ className = "w-36 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 200 220" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(100, 115)">
        <path d="M -28 -22 L -32 72 Q 0 76 32 72 L 28 -22 Z" fill="#FAF7F2"/>
        <path d="M -31 20 Q 0 24 31 20" strokeWidth="2.8"/>
        <path d="M -31 25 Q 0 29 31 25" strokeWidth="2.4"/>
        <path d="M 0 -92 C -12 -64, -24 -38, -38 -22 Q 0 -16 38 -22 C 24 -38, 12 -64, 0 -92 Z" fill="#EFE6D8"/>
        <circle cx="0" cy="-95" r="4" fill="#5A4030"/>
        <path d="M -9 -68 Q 0 -60 9 -68" strokeWidth="2.5"/>
        <path d="M -16 -53 Q -8 -45 0 -53 Q 8 -45 16 -53" strokeWidth="2.5"/>
        <path d="M -23 -38 Q -12 -29 0 -38 Q 12 -29 23 -38" strokeWidth="2.6"/>
        <path d="M -30 -25 Q -18 -16 -9 -25 Q 0 -16 9 -25 Q 18 -16 30 -25" strokeWidth="2.6"/>
        <path d="M -13 4 L -13 -6 A 13 13 0 0 1 13 -6 L 13 4 Z" fill="#E6C280" fillOpacity="0.45" strokeWidth="2.7"/>
        <path d="M 0 -16 L 0 -12 M -4 -6 L 4 -6 L 2 -12 L -2 -12 Z" strokeWidth="2"/>
        <path d="M -10 73 L -10 46 A 10 10 0 0 1 10 46 L 10 73" fill="#D4B595" fillOpacity="0.4" strokeWidth="2.8"/>
        <path d="M 0 36 L 0 73" strokeWidth="2"/>
        <circle cx="4" cy="58" r="1.5" fill="#5A4030"/>
        <rect x="-24" y="34" width="9" height="9" rx="1.5" fill="#E6C280" fillOpacity="0.4" strokeWidth="2.2"/>
        <rect x="15" y="34" width="9" height="9" rx="1.5" fill="#E6C280" fillOpacity="0.4" strokeWidth="2.2"/>
        <g transform="translate(-46, 56)">
          <path d="M 0 -22 L -12 12 L 12 12 Z" fill="#8FA389" fillOpacity="0.35" strokeWidth="2.6"/>
          <path d="M -6 -6 Q 0 0 6 -6 M -9 4 Q 0 10 9 4" strokeWidth="2.2"/>
          <path d="M -3 12 L -3 17 L 3 17 L 3 12" strokeWidth="2.2"/>
        </g>
        <path d="M -66 73 Q 0 70 62 74" strokeWidth="2.6"/>
      </g>
    </g>
  </svg>
);

// 4. カサが開いた大きな松ぼっくり＆小さな松ぼっくり：大切にしていること(01)の挿絵、および背景の透かし配置
export const PineconeIllust = ({ className = "w-32 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 220 220" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(86, 112)">
        <polygon points="0,-78 -24,-50 -36,-15 -42,35 -28,64 28,64 42,35 36,-15 24,-50" fill="#D4B595" fillOpacity="0.35" stroke="none"/>
        <path d="M -3 -68 L 0 -82 L 3 -68" fill="#FAF7F2"/>
        <path d="M -6 -58 L -14 -72 L -6 -74 L 0 -62" fill="#FAF7F2"/>
        <path d="M 6 -58 L 14 -72 L 6 -74 L 0 -62" fill="#FAF7F2"/>
        <path d="M -8 -48 L -26 -56 L -22 -44 L -6 -38" fill="#FAF7F2"/>
        <path d="M 8 -48 L 26 -56 L 22 -44 L 6 -38" fill="#FAF7F2"/>
        <path d="M -11 -48 L 0 -58 L 11 -48 L 0 -41 Z" fill="#EFE6D8"/>
        <path d="M -10 -32 L -34 -38 L -28 -25 L -8 -20" fill="#FAF7F2"/>
        <path d="M 10 -32 L 34 -38 L 28 -25 L 8 -20" fill="#FAF7F2"/>
        <path d="M -14 -31 L -4 -40 L 4 -31 L -4 -24 Z" fill="#FAF7F2"/>
        <path d="M -4 -31 L 6 -40 L 14 -31 L 6 -24 Z" fill="#FAF7F2"/>
        <path d="M -12 -14 L -40 -18 L -34 -4 L -10 0" fill="#FAF7F2"/>
        <path d="M 12 -14 L 40 -18 L 34 -4 L 10 0" fill="#FAF7F2"/>
        <path d="M -18 -13 L -8 -22 L 2 -13 L -8 -5 Z" fill="#EFE6D8"/>
        <path d="M -2 -13 L 8 -22 L 18 -13 L 8 -5 Z" fill="#EFE6D8"/>
        <path d="M -14 5 L -44 4 L -37 18 L -10 18" fill="#FAF7F2"/>
        <path d="M 14 5 L 44 4 L 37 18 L 10 18" fill="#FAF7F2"/>
        <path d="M -20 6 L -10 -3 L 0 6 L -10 14 Z" fill="#FAF7F2"/>
        <path d="M 0 6 L 10 -3 L 20 6 L 10 14 Z" fill="#FAF7F2"/>
        <path d="M -10 0 L 0 -9 L 10 0 L 0 8 Z" fill="#EFE6D8"/>
        <path d="M -14 24 L -44 26 L -35 39 L -10 35" fill="#FAF7F2"/>
        <path d="M 14 24 L 44 26 L 35 39 L 10 35" fill="#FAF7F2"/>
        <path d="M -19 25 L -9 16 L 1 25 L -9 33 Z" fill="#EFE6D8"/>
        <path d="M -1 25 L 9 16 L 19 25 L 9 33 Z" fill="#EFE6D8"/>
        <path d="M -16 38 L -38 52 L -26 60 L -10 46" fill="#FAF7F2"/>
        <path d="M 16 38 L 38 52 L 26 60 L 10 46" fill="#FAF7F2"/>
        <path d="M -16 42 L -18 63 L -4 65 L -2 44" fill="#FAF7F2"/>
        <path d="M 16 42 L 18 63 L 4 65 L 2 44" fill="#FAF7F2"/>
        <path d="M -7 40 L -8 66 L 8 66 L 7 40 Z" fill="#EFE6D8"/>
      </g>
      <g transform="translate(166, 154) rotate(6)">
        <path d="M 0 -22 L 0 -30" strokeWidth="3.2"/>
        <path d="M -4 -16 L -18 -22 L -14 -10 L -3 -8" fill="#FAF7F2"/>
        <path d="M 4 -16 L 18 -22 L 14 -10 L 3 -8" fill="#FAF7F2"/>
        <path d="M -6 -6 L -24 -6 L -18 6 L -4 4" fill="#FAF7F2"/>
        <path d="M 6 -6 L 24 -6 L 18 6 L 4 4" fill="#FAF7F2"/>
        <path d="M -6 6 L -20 16 L -10 22 L -2 12" fill="#FAF7F2"/>
        <path d="M 6 6 L 20 16 L 10 22 L 2 12" fill="#FAF7F2"/>
        <path d="M -8 -10 L 0 -18 L 8 -10 L 0 -2 Z" fill="#EFE6D8"/>
        <path d="M -9 3 L 0 -5 L 9 3 L 0 11 Z" fill="#FAF7F2"/>
        <path d="M -6 12 L 0 24 L 6 12" fill="#EFE6D8"/>
      </g>
    </g>
  </svg>
);

// 5. 寄り添う2つのどんぐりと葉っぱ：見出し横のワンポイント、余白のあしらい
export const AcornIllust = ({ className = "w-24 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(80, 108) rotate(-14)">
        <path d="M -22 -6 C -24 24, -10 40, 0 44 C 10 40, 24 24, 22 -6 Z" fill="#FAF7F2"/>
        <path d="M -27 -6 C -28 -26, 28 -26, 27 -6 Q 0 0 -27 -6 Z" fill="#D4B595" fillOpacity="0.45"/>
        <path d="M -16 -18 L -8 -5 M -4 -21 L 4 -4 M 10 -19 L 17 -6" strokeWidth="2.2"/>
        <path d="M -18 -8 L -8 -19 M -4 -4 L 6 -20 M 10 -5 L 18 -16" strokeWidth="2.2"/>
        <path d="M 0 -21 C 1 -30, 6 -34, 10 -32" strokeWidth="3.2"/>
      </g>
      <g transform="translate(132, 122) rotate(18) scale(0.82)">
        <path d="M -22 -6 C -24 24, -10 40, 0 44 C 10 40, 24 24, 22 -6 Z" fill="#FAF7F2"/>
        <path d="M -27 -6 C -28 -26, 28 -26, 27 -6 Q 0 0 -27 -6 Z" fill="#D4B595" fillOpacity="0.45"/>
        <path d="M -14 -17 L -6 -5 M 2 -20 L 10 -5 M -12 -6 L -2 -19 M 4 -5 L 14 -17" strokeWidth="2.4"/>
        <path d="M 0 -21 L 2 -31" strokeWidth="3.2"/>
      </g>
      <g transform="translate(65, 68) rotate(-35)">
        <path d="M 0 0 C 10 -12, 22 -4, 18 6 C 28 2, 36 12, 26 20 C 34 22, 32 34, 20 32 C 12 40, -2 34, 2 22 C -8 20, -6 8, 0 0 Z" fill="#8FA389" fillOpacity="0.25" strokeWidth="2.6"/>
        <path d="M -4 36 L 22 10" strokeWidth="2.2"/>
      </g>
    </g>
  </svg>
);

// 6. 木の実とシダーローズの贅沢リース：Gallery（作品紹介）の見出し上部、または背景の装飾
export const WreathIllust = ({ className = "w-28 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 220 220" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(110, 114)">
        <path d="M -8 -66 C -12 -86, 12 -86, 8 -66" strokeWidth="2.4" strokeDasharray="3 2"/>
        <circle cx="0" cy="0" r="56" strokeWidth="3.5" opacity="0.4"/>
        <circle cx="0" cy="0" r="36" strokeWidth="2.5" opacity="0.4"/>
        <g transform="translate(-42, -26)"><circle cx="0" cy="0" r="16" fill="#FAF7F2"/><path d="M -6 -4 C 0 -10, 8 -4, 4 4 C -2 10, -10 4, -6 -4 M -11 -8 Q 0 -16 11 -8 M -12 6 Q 0 16 12 6 M -14 -2 Q -16 6 -8 12" strokeWidth="2.4"/></g>
        <g transform="translate(44, -18)"><circle cx="0" cy="0" r="15" fill="#FAF7F2"/><path d="M -5 -4 C 0 -9, 7 -4, 4 4 C -2 9, -9 4, -5 -4 M -10 -7 Q 0 -15 10 -7 M -11 6 Q 0 15 11 6" strokeWidth="2.4"/></g>
        <g transform="translate(-24, 44)"><circle cx="0" cy="0" r="15" fill="#FAF7F2"/><path d="M -5 -4 C 0 -9, 7 -4, 4 4 C -2 9, -9 4, -5 -4 M -10 -7 Q 0 -15 10 -7 M -11 6 Q 0 15 11 6" strokeWidth="2.4"/></g>
        <g transform="translate(32, 38)"><circle cx="0" cy="0" r="16" fill="#FAF7F2"/><path d="M -6 -4 C 0 -10, 8 -4, 4 4 C -2 10, -10 4, -6 -4 M -11 -8 Q 0 -16 11 -8 M -12 6 Q 0 16 12 6" strokeWidth="2.4"/></g>
        <g transform="translate(0, -52) scale(0.65)"><path d="M -18 0 L -8 -16 L 0 -6 L 8 -16 L 18 0 L 10 14 L -10 14 Z" fill="#EFE6D8" strokeWidth="3.5"/><path d="M -12 -4 L 0 -14 L 12 -4 M -10 6 L 0 -4 L 10 6" strokeWidth="3.5"/></g>
        <g transform="translate(-52, 12) rotate(-75) scale(0.65)"><path d="M -18 0 L -8 -16 L 0 -6 L 8 -16 L 18 0 L 10 14 L -10 14 Z" fill="#EFE6D8" strokeWidth="3.5"/><path d="M -12 -4 L 0 -14 L 12 -4 M -10 6 L 0 -4 L 10 6" strokeWidth="3.5"/></g>
        <g transform="translate(52, 12) rotate(75) scale(0.65)"><path d="M -18 0 L -8 -16 L 0 -6 L 8 -16 L 18 0 L 10 14 L -10 14 Z" fill="#EFE6D8" strokeWidth="3.5"/><path d="M -12 -4 L 0 -14 L 12 -4 M -10 6 L 0 -4 L 10 6" strokeWidth="3.5"/></g>
        <g transform="translate(4, 52) scale(0.65)"><path d="M -18 0 L -8 -16 L 0 -6 L 8 -16 L 18 0 L 10 14 L -10 14 Z" fill="#EFE6D8" strokeWidth="3.5"/><path d="M -12 -4 L 0 -14 L 12 -4 M -10 6 L 0 -4 L 10 6" strokeWidth="3.5"/></g>
        <path d="M -26 -52 C -36 -66, -22 -72, -16 -56" fill="#8FA389" fillOpacity="0.3"/>
        <path d="M 28 -50 C 40 -64, 50 -54, 36 -42" fill="#8FA389" fillOpacity="0.3"/>
        <path d="M -64 -6 C -78 -12, -76 4, -62 6" fill="#8FA389" fillOpacity="0.3"/>
        <path d="M 64 -4 C 78 -10, 76 6, 62 8" fill="#8FA389" fillOpacity="0.3"/>
        <circle cx="-22" cy="-42" r="4.5" fill="#E6A99A"/>
        <circle cx="24" cy="-38" r="4.5" fill="#E6A99A"/>
        <circle cx="-42" cy="30" r="4.5" fill="#E6A99A"/>
        <circle cx="44" cy="-36" r="4" fill="#E6C280"/>
      </g>
    </g>
  </svg>
);

// 7. 木の実のボタニカルツリー＆緑の松ぼっくりミニツリー：大切にしていること(02)の挿絵や背景あしらい
export const BotanicalTreeIllust = ({ className = "w-32 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 210 220" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(86, 115)">
        <ellipse cx="0" cy="68" rx="44" ry="8" fill="#FAF7F2" strokeDasharray="4 3"/>
        <path d="M 0 -78 L -38 62 Q 0 70 38 62 Z" fill="#EFE6D8"/>
        <circle cx="-8" cy="12" r="12" fill="#FAF7F2"/><path d="M -12 10 Q -8 6 -4 10 Q -8 16 -12 10" strokeWidth="2.2"/>
        <circle cx="12" cy="26" r="13" fill="#FAF7F2"/><path d="M 7 24 Q 12 19 17 24 Q 12 31 7 24" strokeWidth="2.2"/>
        <circle cx="-12" cy="44" r="11" fill="#FAF7F2"/><path d="M -16 42 Q -12 38 -8 42 Q -12 47 -16 42" strokeWidth="2.2"/>
        <path d="M -8 -52 L 0 -44 L 8 -52" strokeWidth="2.5"/>
        <path d="M -14 -34 L -6 -26 L 0 -34 L 6 -26 L 14 -34" strokeWidth="2.5"/>
        <path d="M -20 -16 L -10 -8 L 0 -16 L 10 -8 L 20 -16" strokeWidth="2.5"/>
        <path d="M 4 -2 L 14 6 L 24 -2" strokeWidth="2.5"/>
        <path d="M -28 24 L -18 32 L -8 24" strokeWidth="2.5"/>
        <path d="M 2 48 L 14 56 L 28 48" strokeWidth="2.5"/>
        <circle cx="4" cy="-22" r="3.5" fill="#FAF7F2"/><circle cx="-16" cy="2" r="3.5" fill="#FAF7F2"/><circle cx="20" cy="42" r="3.5" fill="#FAF7F2"/>
      </g>
      <g transform="translate(154, 152)">
        <rect x="-12" y="20" width="24" height="9" rx="2" fill="#D4B595" fillOpacity="0.5"/>
        <path d="M 0 -34 L -16 -14 L -8 -14 L -22 4 L -12 4 L -24 20 L 24 20 L 12 4 L 22 4 L 8 -14 L 16 -14 Z" fill="#8FA389" fillOpacity="0.45" strokeWidth="2.8"/>
        <path d="M -8 -14 L 0 -8 L 8 -14 M -12 4 L 0 10 L 12 4" strokeWidth="2.4"/>
        <circle cx="-10" cy="-4" r="2" fill="#FAF7F2" stroke="none"/><circle cx="10" cy="12" r="2" fill="#FAF7F2" stroke="none"/>
      </g>
    </g>
  </svg>
);

// 8. 松ぼっくりで作ったハリネズミと赤いキノコ：写真の角やテキストブロックの足元に配置
export const HedgehogIllust = ({ className = "w-28 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 220 190" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(115, 108)">
        <path d="M -22 -24 L -6 -38 L -2 -26 L 16 -38 L 18 -24 L 38 -34 L 36 -18 L 56 -22 L 48 -6 L 64 4 L 46 14 L 54 26 L 32 26 L 28 32 L -20 28 Z" fill="#EFE6D8"/>
        <path d="M -8 -14 L 8 -22 L 4 -6 L -8 -2"/><path d="M -6 6 L 10 0 L 6 16 L -8 16"/>
        <path d="M 12 -12 L 28 -18 L 24 -2 L 10 0"/><path d="M 14 8 L 30 4 L 26 18 L 12 18"/><path d="M 30 -6 L 44 -10 L 40 6 L 28 6"/>
        <path d="M -20 -24 C -42 -18, -62 -4, -66 6 C -62 18, -40 26, -20 26 C -12 10, -12 -10, -20 -24 Z" fill="#FAF7F2"/>
        <circle cx="-66" cy="5" r="4.5" fill="#5A4030" stroke="none"/><circle cx="-42" cy="-2" r="2.6" fill="#5A4030" stroke="none"/>
        <circle cx="-36" cy="8" r="5" fill="#E6A99A" opacity="0.55" stroke="none"/>
        <path d="M -52 12 C -48 16, -42 15, -40 11" strokeWidth="2.5"/>
        <path d="M -26 -16 C -30 -28, -16 -30, -16 -18" fill="#FAF7F2" strokeWidth="2.8"/>
        <ellipse cx="-32" cy="28" rx="8" ry="5" fill="#FAF7F2" strokeWidth="2.8"/><ellipse cx="18" cy="29" rx="8" ry="5" fill="#FAF7F2" strokeWidth="2.8"/>
        <g transform="translate(-76, 18) rotate(-12)">
          <path d="M -4 0 L -5 14 L 5 14 L 4 0" fill="#FAF7F2" strokeWidth="2.5"/>
          <path d="M -16 2 C -16 -14, 16 -14, 16 2 Z" fill="#E6A99A" strokeWidth="2.6"/>
          <circle cx="-6" cy="-5" r="2" fill="#FAF7F2" stroke="none"/><circle cx="5" cy="-3" r="1.8" fill="#FAF7F2" stroke="none"/>
        </g>
      </g>
    </g>
  </svg>
);

// 9. 小枝の巣に乗ったどんぐりフクロウ：見出しの上や、フッター・Scheduleセクションのワンポイントにひょっこり配置
export const OwlIllust = ({ className = "w-24 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(100, 102)">
        <path d="M -30 -12 C -36 22, -22 46, 0 46 C 22 46, 36 22, 30 -12 Z" fill="#D4B595" fillOpacity="0.4"/>
        <path d="M -20 6 C -22 28, -12 44, 0 44 C 12 44, 22 28, 20 6 C 12 0, -12 0, -20 6 Z" fill="#FAF7F2"/>
        <path d="M -8 18 Q -4 23 0 18 Q 4 23 8 18" strokeWidth="2.2"/><path d="M -11 28 Q -5 33 0 28 Q 5 33 11 28" strokeWidth="2.2"/>
        <path d="M -34 -12 C -34 -36, 34 -36, 34 -12 Q 0 -6 -34 -12 Z" fill="#EFE6D8"/>
        <path d="M -18 -26 L -8 -11 M 0 -29 L 8 -10 M 16 -25 L 22 -12 M -14 -11 L -4 -28 M 6 -10 L 16 -26" strokeWidth="2.2"/>
        <path d="M 0 -30 L 3 -40" strokeWidth="3.2"/>
        <circle cx="-11" cy="-2" r="9.5" fill="#FAF7F2" strokeWidth="2.8"/><circle cx="11" cy="-2" r="9.5" fill="#FAF7F2" strokeWidth="2.8"/>
        <circle cx="-10" cy="-2" r="3.2" fill="#5A4030" stroke="none"/><circle cx="10" cy="-2" r="3.2" fill="#5A4030" stroke="none"/>
        <polygon points="-4,2 4,2 0,9" fill="#E6C280" strokeWidth="2.2"/>
        <path d="M -30 0 C -44 10, -42 28, -28 26" fill="#EFE6D8"/><path d="M 30 0 C 44 10, 42 28, 28 26" fill="#EFE6D8"/>
        <g transform="translate(0, 48)">
          <path d="M -46 -4 Q 0 12 46 -4" strokeWidth="3.4"/><path d="M -42 4 Q 0 18 42 4" strokeWidth="3"/><path d="M -34 11 Q 0 22 34 11" strokeWidth="2.8"/>
          <path d="M 42 0 C 54 -6, 56 -18, 44 -12" fill="#8FA389" fillOpacity="0.3" strokeWidth="2.4"/>
        </g>
      </g>
    </g>
  </svg>
);

// 10. 屋根＆旗つきマルシェテントのデフォルメアイコン：Next Event（出店スケジュール・カレンダー）セクションのシンボル
export const MarcheBoothIllust = ({ className = "w-36 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 240 220" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(120, 118)">
        <path d="M 0 -64 L 0 -86" strokeWidth="3.2"/>
        <path d="M 0 -86 L 22 -78 L 0 -70 Z" fill="#E6A99A" strokeWidth="2.8"/>
        <path d="M -64 -16 L -64 46" strokeWidth="3.2"/><path d="M 64 -16 L 64 46" strokeWidth="3.2"/>
        <circle cx="-40" cy="4" r="11" fill="#EFE6D8" strokeWidth="2.8"/><circle cx="-40" cy="4" r="4.5" fill="#FAF7F2" strokeWidth="2.2"/>
        <path d="M -40 -18 L -40 -7" strokeWidth="2.2"/>
        <g transform="translate(26, 16) scale(0.62)">
          <path d="M -34 -12 C -36 -46, 36 -46, 38 -10 C 40 10, 42 22, 32 30" fill="#FAF7F2" strokeWidth="4.2"/>
          <path d="M -34 -12 C -38 8, -40 20, -30 28" strokeWidth="4.2"/>
          <path d="M -26 -5 C -27 20, 25 20, 26 -5" fill="#FAF7F2" strokeWidth="4"/>
          <path d="M -32 -10 C -18 -2, -6 -4, -6 -12 C -4 -2, 8 -2, 12 -11 C 14 -2, 24 -2, 34 -10" strokeWidth="4"/>
          <circle cx="-10" cy="4" r="3" fill="#5A4030" stroke="none"/><circle cx="10" cy="4" r="3" fill="#5A4030" stroke="none"/>
          <path d="M -4 12 Q 0 16 5 12" strokeWidth="3.8"/>
          <path d="M -18 22 L -22 46 L 22 46 L 18 22" fill="#FAF7F2" strokeWidth="4"/>
        </g>
        <polygon points="-22,12 -34,44 -10,44" fill="#8FA389" fillOpacity="0.45" strokeWidth="2.8"/>
        <path d="M -27 26 Q -22 30 -17 26 M -30 36 Q -22 40 -14 36" strokeWidth="2.2"/>
        <rect x="-6" y="24" width="22" height="20" fill="#FAF7F2" strokeWidth="2.8"/>
        <polygon points="5,6 -10,24 20,24" fill="#EFE6D8" strokeWidth="2.8"/>
        <path d="M 2 44 V 35 A 3 3 0 0 1 8 35 V 44" strokeWidth="2.4"/>
        <path d="M -54 -56 L 54 -56 L 78 -20 L -78 -20 Z" fill="#FAF7F2" strokeWidth="3.2"/>
        <path d="M -28 -56 L -39 -20" strokeWidth="2.8"/><path d="M 0 -56 L 0 -20" strokeWidth="2.8"/><path d="M 28 -56 L 39 -20" strokeWidth="2.8"/>
        <polygon points="-54,-56 -28,-56 -39,-20 -78,-20" fill="#8FA389" fillOpacity="0.35" stroke="none"/>
        <polygon points="0,-56 28,-56 39,-20 0,-20" fill="#8FA389" fillOpacity="0.35" stroke="none"/>
        <path d="M -78 -20 C -78 -4, -39 -4, -39 -20 C -39 -4, 0 -4, 0 -20 C 0 -4, 39 -4, 39 -20 C 39 -4, 78 -4, 78 -20 Z" fill="#FAF7F2" strokeWidth="3.2"/>
        <rect x="-72" y="44" width="144" height="30" rx="6" fill="#8FA389" fillOpacity="0.38" strokeWidth="3.2"/>
        <path d="M -68 54 Q 0 64 68 54" strokeWidth="2.4" opacity="0.7"/>
      </g>
    </g>
  </svg>
);

// 11. マルシェでのお客様との温かい交流：「大切にしている3つのこと（03 マルシェでのちいさな出会い）」のメイン挿絵
export const CommunicationIllust = ({ className = "w-44 h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 280 220" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" stroke="#5A4030" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(74, 96)">
        <path d="M -32 -12 C -34 -46, 34 -46, 36 -10 C 38 10, 40 22, 31 29" fill="#FAF7F2"/>
        <path d="M -32 -12 C -36 8, -38 20, -29 28 C -23 32, -17 26, -20 21"/>
        <path d="M -25 -5 C -26 20, 24 20, 25 -5" fill="#FAF7F2"/>
        <path d="M -30 -10 C -20 -2, -8 -3, -7 -12 C -6 -2, 6 -2, 9 -11 C 11 -2, 22 -2, 32 -10"/>
        <path d="M -6 3 Q -2 7 2 3" strokeWidth="2.6"/><path d="M 10 3 Q 14 7 18 3" strokeWidth="2.6"/>
        <path d="M 2 12 C 5 16, 10 16, 12 12" strokeWidth="2.6"/>
        <circle cx="-10" cy="9" r="5" fill="#E6A99A" opacity="0.55" stroke="none"/><circle cx="20" cy="9" r="5" fill="#E6A99A" opacity="0.55" stroke="none"/>
        <path d="M -18 22 L -22 62 L 22 62 L 18 22" fill="#8FA389" fillOpacity="0.25"/>
        <path d="M 12 34 C 26 38, 36 36, 44 30" strokeWidth="3"/>
      </g>
      <g transform="translate(206, 98)">
        <circle cx="18" cy="-34" r="11" fill="#FAF7F2"/>
        <path d="M -30 -10 C -32 -44, 32 -44, 30 -10 C 30 8, 26 20, 18 24" fill="#FAF7F2"/>
        <path d="M -24 -4 C -25 20, 23 20, 24 -4" fill="#FAF7F2"/>
        <path d="M -26 -10 C -14 -2, 6 -2, 24 -12"/>
        <circle cx="-12" cy="3" r="2.3" fill="#5A4030" stroke="none"/><circle cx="4" cy="3" r="2.3" fill="#5A4030" stroke="none"/>
        <path d="M -10 12 C -7 16, -2 16, 1 12" strokeWidth="2.6"/>
        <circle cx="-17" cy="9" r="5" fill="#E6A99A" opacity="0.55" stroke="none"/><circle cx="11" cy="9" r="5" fill="#E6A99A" opacity="0.55" stroke="none"/>
        <path d="M -16 22 L -20 60 L 20 60 L 16 22" fill="#FAF7F2"/>
        <path d="M -12 34 C -26 36, -32 28, -26 22" strokeWidth="3"/>
      </g>
      <g transform="translate(140, 142)">
        <path d="M -95 16 L 95 16" strokeWidth="3.2"/>
        <rect x="-14" y="-8" width="24" height="24" fill="#FAF7F2"/>
        <polygon points="-2,-32 -20,-8 16,-8" fill="#EFE6D8"/>
        <path d="M -10 -18 Q -2 -12 6 -18" strokeWidth="2.2"/>
        <path d="M -6 16 V 6 A 4 4 0 0 1 2 6 V 16"/>
        <path d="M 22 -6 L 14 2 L 18 4 L 12 12 L 32 12 L 26 4 L 30 2 Z" fill="#FAF7F2" strokeWidth="2.4"/>
      </g>
      <g transform="translate(140, 54)">
        <path d="M 0 12 C -4 4, -16 4, -16 14 C -16 22, 0 30, 0 34 C 0 30, 16 22, 16 14 C 16 4, 4 4, 0 12 Z" fill="#E6A99A" fillOpacity="0.45" strokeWidth="2.6"/>
        <path d="M -28 24 L -22 28 M -28 14 L -21 16" strokeWidth="2.4"/><path d="M 28 24 L 22 28 M 28 14 L 21 16" strokeWidth="2.4"/>
      </g>
    </g>
  </svg>
);

// 12. カレンダー・日付マス用のコンパクトなマルシェテント（16〜24pxサイズに最適化）
export const MarcheTent = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 屋根 */}
    <path d="M3 10L12 3L21 10" />
    <path d="M3 10C3 11.5 5 12 6 11C7 12 9 12 10 11C11 12 13 12 14 11C15 12 17 12 18 11C19 12 21 11.5 21 10" />
    <path d="M8 7L8 11" />
    <path d="M12 3L12 11" />
    <path d="M16 7L16 11" />
    {/* 支柱 */}
    <path d="M5 12V21" />
    <path d="M19 12V21" />
    {/* カウンター・台 */}
    <path d="M3 21H21" />
    {/* てっぺんの小さな旗 */}
    <path d="M12 3V1L15 2L12 3" fill="currentColor" />
  </svg>
);

// 13. たまランド風の手描き波線（見出しの下などに添える）
export const ChalkWavyLine = ({ className = "w-28 h-3 text-acorn-400" }: { className?: string }) => (
  <svg viewBox="0 0 120 12" fill="none" stroke="currentColor" className={className} preserveAspectRatio="none">
    <path
      d="M 2 6 Q 12 1, 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 118 6"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

// 14. 黒板最下部用の4色チョークガーランド（葉っぱと木の実）
export const ChalkGarlandBottom = ({ className = "w-full h-7" }: { className?: string }) => (
  <svg viewBox="0 0 300 24" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M 6 8 Q 75 18 150 12 Q 225 6 294 12" stroke="#9BB894" strokeWidth="1.8" />
      {/* 4色の葉っぱと木の実 */}
      <path d="M 40 12 C 34 20, 48 20, 46 12 Z" fill="#9BB894" stroke="#9BB894" strokeWidth="1" />
      <circle cx="65" cy="16" r="2.4" fill="#E8A89A" />
      <path d="M 98 12 C 104 20, 92 20, 95 13 Z" fill="#F3D79B" stroke="#F3D79B" strokeWidth="1" />
      <circle cx="120" cy="16" r="2.6" fill="#99B8C6" />
      <path d="M 148 12 C 142 20, 154 20, 150 12 Z" fill="#9BB894" stroke="#9BB894" strokeWidth="1" />
      <circle cx="178" cy="15" r="2.5" fill="#F3D79B" />
      <path d="M 205 10 C 199 18, 212 18, 209 11 Z" fill="#E8A89A" stroke="#E8A89A" strokeWidth="1" />
      <circle cx="232" cy="16" r="2.6" fill="#9BB894" />
      <path d="M 258 11 C 265 19, 252 20, 254 12 Z" fill="#F3D79B" stroke="#F3D79B" strokeWidth="1" />
      <circle cx="278" cy="15" r="2.4" fill="#99B8C6" />
    </g>
  </svg>
);

// 15. ボタン右端からひょっこり顔を覗かせるハリネズミ
export const PeekingHedgehogIllust = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 54 44" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" strokeLinecap="round" strokeLinejoin="round">
      {/* 背中のトゲ針 */}
      <path d="M 10 38 Q 6 20 18 10 Q 30 2 42 12 Q 50 20 48 38" fill="#7C563D" stroke="#FAF7F2" strokeWidth="1.6" />
      <path d="M 16 12 L 12 5 M 24 6 L 24 1 M 34 8 L 38 3 M 44 14 L 50 10 M 46 22 L 53 20" stroke="#FAF7F2" strokeWidth="1.6" />
      {/* 顔 */}
      <path d="M 18 38 C 18 24, 38 24, 38 38 Z" fill="#EEDFC9" stroke="#5A4030" strokeWidth="1.6" />
      {/* 耳 */}
      <circle cx="19" cy="24" r="3.2" fill="#E5B299" stroke="#5A4030" strokeWidth="1.4" />
      <circle cx="37" cy="24" r="3.2" fill="#E5B299" stroke="#5A4030" strokeWidth="1.4" />
      {/* つぶらな目 */}
      <circle cx="23" cy="29" r="1.8" fill="#3B2E26" stroke="none" />
      <circle cx="33" cy="29" r="1.8" fill="#3B2E26" stroke="none" />
      {/* 鼻 */}
      <circle cx="28" cy="32" r="2.2" fill="#3B2E26" stroke="none" />
      {/* ほっぺ */}
      <circle cx="20" cy="32" r="2.2" fill="#F4A9A0" opacity="0.6" stroke="none" />
      <circle cx="36" cy="32" r="2.2" fill="#F4A9A0" opacity="0.6" stroke="none" />
      {/* ボタンのへりに置いた小さな手 */}
      <ellipse cx="20" cy="38" rx="2.8" ry="2" fill="#EEDFC9" stroke="#5A4030" strokeWidth="1.3" />
      <ellipse cx="36" cy="38" rx="2.8" ry="2" fill="#EEDFC9" stroke="#5A4030" strokeWidth="1.3" />
    </g>
  </svg>
);

// 16. 「私たちの想い」ボタンの左上に重なる双葉と木の実のチョークイラスト
export const SproutBerryIllust = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} overflow="visible">
    <g filter="url(#chalk-soft)" strokeLinecap="round" strokeLinejoin="round">
      {/* 双葉 */}
      <path d="M 16 26 C 16 18, 10 14, 4 16 C 4 22, 10 26, 16 26 Z" fill="#88B47E" stroke="#5A4030" strokeWidth="1.4" />
      <path d="M 16 26 C 16 16, 24 12, 28 16 C 28 22, 22 26, 16 26 Z" fill="#A8D09E" stroke="#5A4030" strokeWidth="1.4" />
      {/* 茎 */}
      <path d="M 16 26 L 16 30" stroke="#5A4030" strokeWidth="1.8" />
      {/* 小さな赤い木の実 */}
      <circle cx="22" cy="10" r="4" fill="#D96B5B" stroke="#5A4030" strokeWidth="1.4" />
      <circle cx="13" cy="8" r="3.4" fill="#E58B79" stroke="#5A4030" strokeWidth="1.4" />
    </g>
  </svg>
);

// 17. 小枝と葉っぱをモチーフにした手描き風矢印
export const TwigArrowRightIllust = ({ className = "w-5 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 28 16" className={className} overflow="visible">
    <g stroke="#5A4030" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* 小枝の軸 */}
      <path d="M 2 8 C 8 7.5, 16 8.5, 24 8" strokeWidth="2.2" />
      {/* 矢じり */}
      <path d="M 18 3 L 25 8 L 18 13" strokeWidth="2.2" />
      {/* 節と小さな若葉 */}
      <path d="M 10 8 Q 12 3 15 3 Q 14 8 10 8 Z" fill="#88B47E" stroke="#5A4030" strokeWidth="1.2" />
      <path d="M 7 8 Q 6 11 4 12" strokeWidth="1.6" />
    </g>
  </svg>
);

// 18. 手描き風マップピンSVG
export const HandDrawnPinIllust = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 24" className={className} overflow="visible">
    <g stroke="#5A4030" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 10 2 C 5 2 2 6 2 10 C 2 15 8 20 10 22 C 12 20 18 15 18 10 C 18 6 15 2 10 2 Z" fill="#F4A9A0" />
      <circle cx="10" cy="9" r="3" fill="#FAF7F2" stroke="#5A4030" strokeWidth="1.5" />
    </g>
  </svg>
);

