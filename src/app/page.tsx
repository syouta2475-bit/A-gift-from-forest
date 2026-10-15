import { Suspense } from "react";
import { FirstView } from "@/components/FirstView";
import { CalendarSection } from "@/components/calendar/CalendarSection";
import { Concept } from "@/components/concept/Concept";
import { Gallery } from "@/components/gallery/Gallery";
import { NextEvent } from "@/components/next-event/NextEvent";
import { ReviewBoardSection } from "@/components/reviews/ReviewBoardSection";
import { ReviewListSkeleton } from "@/components/reviews/ReviewListSkeleton";
import { Footer } from "@/components/Footer";
import { getGalleryWorks } from "@/lib/gallery";

// 管理画面からの更新や出店日の日時計算を即座にリアルタイム反映
export const dynamic = "force-dynamic";

export default async function Home() {
  const galleryWorks = await getGalleryWorks();

  return (
    <main>
      <FirstView />

      <Concept />
      <Gallery works={galleryWorks} />
      <NextEvent />
      <CalendarSection />

      <Suspense fallback={<ReviewListSkeleton embedded />}>
        <ReviewBoardSection />
      </Suspense>

      <Footer />
    </main>
  );
}
