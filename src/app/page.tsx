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

// 1時間ごとに再生成（管理画面更新後もオンデマンドで即時反映）
export const revalidate = 3600;

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
