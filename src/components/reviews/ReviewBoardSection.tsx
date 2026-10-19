import { getReviews } from "@/lib/reviews";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewBoardClient } from "./ReviewBoardClient";
import { ChalkWavyLine } from "@/components/ui/Icons";
import { MozSilhouette } from "@/components/ui/MozSilhouette";
import { ForestIcon } from "@/components/ui/ForestIcon";

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

      {/* ── 背景のMOZ風大型シルエット（左下: どんぐりウサギ、右上: 松ぼっくりネズミ） ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 bottom-6 opacity-35 select-none z-0"
      >
        <MozSilhouette variant="rabbit" className="w-64 sm:w-80 h-auto" color="#C8AD90" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-10 opacity-35 select-none z-0"
      >
        <MozSilhouette variant="mouse" className="w-64 sm:w-80 h-auto rotate-6" color="#C8AD90" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 z-10">
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-2">
            <ForestIcon name="message" size={26} color="#6B4423" />
            <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-2 inline-block">
              Voice &amp; Message
            </span>
          </div>
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
