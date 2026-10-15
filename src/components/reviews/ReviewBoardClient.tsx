"use client";

import { useCallback, useEffect, useState } from "react";
import type { Review } from "@/types";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { ReviewListSkeleton } from "./ReviewListSkeleton";

type ReviewBoardClientProps = {
  initialReviews: Review[];
};

/**
 * 口コミ一覧：初回はクライアントで再取得しスケルトンを見せ、以降は楽観的更新。
 */
export function ReviewBoardClient({ initialReviews }: ReviewBoardClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) return;
        const data = (await res.json()) as { reviews?: Review[] };
        if (!cancelled && data.reviews) setReviews(data.reviews);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onPosted = useCallback((review: Review) => {
    setReviews((prev) => [review, ...prev]);
  }, []);

  return (
    <>
      {loading ? (
        <ReviewListSkeleton />
      ) : (
        <ul className="mt-10 flex flex-col gap-5">
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}

      <ReviewForm onPosted={onPosted} />
    </>
  );
}
