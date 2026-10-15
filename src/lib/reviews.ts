import type { Review } from "@/types";
import { loadReviews } from "@/lib/store";

/**
 * 口コミ一覧を取得（作成日時降順）
 */
export async function getReviews(): Promise<Review[]> {
  try {
    const reviews = await loadReviews();
    return reviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error("[getReviews error]", err);
    return [];
  }
}
