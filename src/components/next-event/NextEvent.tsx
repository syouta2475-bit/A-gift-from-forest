import { getEvents, pickNextEvent } from "@/lib/events";
import { loadSettings } from "@/lib/store";
import { NextEventCard } from "./NextEventCard";
import { Reveal } from "@/components/ui/Reveal";
import { OwlIllust, ChalkWavyLine } from "@/components/ui/Icons";

/**
 * Next Event セクション（サーバーコンポーネント）。
 * データ取得と一番近い出店情報の選出を行い、NextEventCard に渡す。
 * 予定がない場合も黒板デザインを維持して未定UIを表示（文言は管理画面の設定と連動）。
 */
export async function NextEvent() {
  const [events, settings] = await Promise.all([
    getEvents(),
    loadSettings(),
  ]);
  const next = pickNextEvent(events, new Date());

  return (
    <section
      id="next-event"
      aria-labelledby="next-event-title"
      className="relative overflow-hidden bg-cream-100/60 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12">
          <div className="flex items-center gap-2">
            <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-2">
              Next Marché
            </span>
            <OwlIllust className="w-12 sm:w-14 h-auto drop-shadow-xs" />
          </div>
          <h2
            id="next-event-title"
            className="mt-1 font-klee text-3xl sm:text-4xl lg:text-5xl font-semibold text-acorn-900"
          >
            つぎに会える場所
          </h2>
          <ChalkWavyLine className="w-36 h-3 text-acorn-400 mt-2" />
          <p className="mt-3 text-base sm:text-lg text-acorn-800/85">
            直近のマルシェ出店情報です。お近くの方はぜひ遊びにいらしてください。
          </p>
        </Reveal>

        <div>
          <NextEventCard
            event={next}
            emptyTitle={settings.emptyBoardTitle}
            emptyMessage={settings.emptyBoardMessage}
          />
        </div>
      </div>
    </section>
  );
}
