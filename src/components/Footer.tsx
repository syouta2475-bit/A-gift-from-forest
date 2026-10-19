import { MainLogo, ChalkWavyLine } from "@/components/ui/Icons";
import { MozSilhouette } from "@/components/ui/MozSilhouette";
import { ForestIcon } from "@/components/ui/ForestIcon";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream-100/80 pt-20 pb-12 border-t border-acorn-200/60">
      {/* ── フッター上部：MOZ風 3棟のミニチュアハウス街並みシルエット ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-35 select-none z-0"
      >
        <MozSilhouette variant="houses" className="w-80 sm:w-96 md:w-[420px] h-auto" color="#C8AD90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 text-center flex flex-col items-center z-10">
        {/* 新ロゴ準拠・フクロウアイコン */}
        <div className="mb-3 p-2 rounded-full bg-cream-50/80 border border-acorn-200/50 shadow-2xs">
          <ForestIcon name="owl" size={32} color="#6B4423" />
        </div>

        {/* メインロゴ */}
        <div className="flex justify-center -ml-2">
          <MainLogo className="w-60 sm:w-72 h-auto" />
        </div>

        <div className="mt-2 text-acorn-400">
          <ChalkWavyLine className="w-36 h-3" />
        </div>

        <p className="mt-4 font-klee text-sm sm:text-base text-acorn-800/80 max-w-md">
          北軽井沢と川越。ふたつの街の風情とともに、
          <br />
          森の恵みをお届けしています。
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <ForestIcon name="acorn" size={16} color="#A8703A" />
          <p className="font-caveat text-xl text-acorn-600">
            ~ Thank you for visiting ~
          </p>
          <ForestIcon name="pinecone" size={16} color="#A8703A" />
        </div>

        <p className="mt-4 text-xs text-acorn-600/70 font-sans tracking-wider">
          &copy; {new Date().getFullYear()} 森からのおくりもの All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
