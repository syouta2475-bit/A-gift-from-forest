import { getReviews } from "@/lib/reviews";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewBoardClient } from "./ReviewBoardClient";
import { ChalkWavyLine, AcornIllust } from "@/components/ui/Icons";

/** 口コミボード（Review Board）セクション */
export async function ReviewBoardSection() {
  const reviews = await getReviews();

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative overflow-hidden bg-cream-50 py-20 sm:py-28"
    >
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      {/* ── 背景の透かしどんぐり ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -bottom-10 opacity-[0.09] select-none"
      >
        <AcornIllust className="w-64 h-auto" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-2 inline-block">
            Voice & Message
          </span>
          <h2
            id="reviews-title"
            className="mt-1 font-klee text-3xl font-semibold text-acorn-900 sm:text-4xl"
          >
            お客様の声
          </h2>
          <div className="flex justify-center mt-2">
            <ChalkWavyLine className="w-32 h-3 text-acorn-400" />
          </div>
          <p className="mt-3 text-base text-acorn-800/85 sm:text-lg">
            マルシェでお会いした方から、温かいメッセージをいただいています。
          </p>
        </Reveal>

        <ReviewBoardClient initialReviews={reviews} />
      </div>
    </section>
  );
}
