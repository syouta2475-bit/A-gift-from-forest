import { Suspense } from "react";
import { FirstView } from "@/components/FirstView";
import { CalendarSection } from "@/components/calendar/CalendarSection";
import { Concept } from "@/components/concept/Concept";
import { Gallery } from "@/components/gallery/Gallery";
import { NextEvent } from "@/components/next-event/NextEvent";
import { ReviewBoardSection } from "@/components/reviews/ReviewBoardSection";
import { ReviewListSkeleton } from "@/components/reviews/ReviewListSkeleton";
import { Footer } from "@/components/Footer";
import { MozSilhouette } from "@/components/ui/MozSilhouette";
import { getGalleryWorks } from "@/lib/gallery";

// 管理画面からの更新や出店日の日時計算を即座にリアルタイム反映
export const dynamic = "force-dynamic";

export default async function Home() {
  const galleryWorks = await getGalleryWorks();

  return (
    <main className="relative overflow-x-hidden">
      <FirstView />

      <Concept />

      {/* セクション間の区切り帯：MOZ風 森の風ストリーム */}
      <div aria-hidden="true" className="w-full overflow-hidden pointer-events-none select-none py-2 bg-cream-50 flex justify-center">
        <MozSilhouette
          variant="wind-stream"
          className="w-full max-w-6xl h-auto opacity-35 px-4"
          color="#C8AD90"
        />
      </div>

      <Gallery works={galleryWorks} />
      <NextEvent />
      <CalendarSection />

      {/* セクション間の区切り帯：MOZ風 森の風ストリーム（反転配置） */}
      <div aria-hidden="true" className="w-full overflow-hidden pointer-events-none select-none py-2 bg-cream-50 flex justify-center scale-x-[-1]">
        <MozSilhouette
          variant="wind-stream"
          className="w-full max-w-6xl h-auto opacity-30 px-4"
          color="#C8AD90"
        />
      </div>

      <Suspense fallback={<ReviewListSkeleton embedded />}>
        <ReviewBoardSection />
      </Suspense>

      <Footer />
    </main>
  );
}
