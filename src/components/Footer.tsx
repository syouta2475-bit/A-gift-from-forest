import { MainLogo, OwlIllust, ChalkWavyLine } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream-100/80 pt-16 pb-12 border-t border-acorn-200/60">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 text-center flex flex-col items-center">
        {/* フクロウのひょっこり配置 */}
        <div className="mb-3">
          <OwlIllust className="w-16 h-auto drop-shadow-xs" />
        </div>

        {/* メインロゴ */}
        <div className="flex justify-center -ml-2">
          <MainLogo className="w-64 sm:w-80 h-auto" />
        </div>

        <div className="mt-2 text-acorn-400">
          <ChalkWavyLine className="w-36 h-3" />
        </div>

        <p className="mt-4 font-klee text-sm sm:text-base text-acorn-800/80 max-w-md">
          北軽井沢と川越。ふたつの街の風情とともに、
          <br />
          森の恵みをお届けしています。
        </p>

        <p className="mt-8 font-caveat text-xl text-acorn-500">
          ~ Thank you for visiting ~
        </p>

        <p className="mt-4 text-xs text-acorn-600/70 font-sans tracking-wider">
          © {new Date().getFullYear()} 森からのおくりもの All rights reserved.
        </p>
      </div>
    </footer>
  );
}
