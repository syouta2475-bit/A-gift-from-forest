import { format } from "date-fns";
import { toJst } from "@/lib/date";
import { getEvents, pickNextEvent } from "@/lib/events";
import { Reveal } from "@/components/ui/Reveal";
import { Calendar } from "./Calendar";
import { ChalkWavyLine } from "@/components/ui/Icons";

/**
 * Calendar セクション（サーバーコンポーネント）。
 * データ取得と「今日」の決定をサーバーで行い、カレンダー本体に渡す。
 */
export async function CalendarSection() {
  const events = await getEvents();
  const now = new Date();
  const next = pickNextEvent(events, now);

  const todayKey = format(toJst(now), "yyyy-MM-dd");
  const initialMonthKey = next ? next.startDate : todayKey;

  return (
    <section
      id="calendar"
      aria-labelledby="calendar-title"
      className="relative overflow-hidden bg-cream-50 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12">
          <span className="font-caveat text-2xl sm:text-3xl text-acorn-700 -rotate-2 inline-block">
            Schedule & Calendar
          </span>
          <h2
            id="calendar-title"
            className="mt-1 font-klee text-3xl sm:text-4xl lg:text-5xl font-semibold text-acorn-900"
          >
            出店カレンダー
          </h2>
          <ChalkWavyLine className="w-36 h-3 text-acorn-400 mt-2" />
          <p className="mt-3 text-base sm:text-lg text-acorn-800/85">
            テントのマークがついている日に出店しています。日付をタップすると詳細をご覧いただけます。
          </p>
        </Reveal>

        <div>
          <Calendar
            events={events}
            todayKey={todayKey}
            initialMonthKey={initialMonthKey}
          />
        </div>
      </div>
    </section>
  );
}
