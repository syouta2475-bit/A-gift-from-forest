import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toJst } from "@/lib/date";
import type { Review } from "@/types";
import { AcornIllust } from "@/components/ui/Icons";

type ReviewCardProps = {
  review: Review;
};

function formatReviewDate(iso: string): string {
  return format(toJst(new Date(iso)), "yyyy年M月d日", { locale: ja });
}

export function ReviewCard({ review }: ReviewCardProps) {
  const isDataImg = review.userImage?.url?.startsWith("data:");

  return (
    <article className="rounded-[2rem] bg-white/95 px-6 py-6 sm:px-7 sm:py-7 border border-stone-200/60 shadow-xs">
      <div className="flex flex-col gap-3">
        {/* ヘッダー：統一されたどんぐりワンポイント＋お名前＋日付 */}
        <header className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <AcornIllust className="w-5 h-auto text-acorn-600 shrink-0" />
            <h3 className="font-klee text-base sm:text-lg font-semibold text-acorn-900">
              {review.nickname} さん
            </h3>
          </div>
          <time dateTime={review.createdAt} className="font-sans text-xs sm:text-sm font-medium text-acorn-500">
            {formatReviewDate(review.createdAt)}
          </time>
        </header>

        {/* コメント本文 */}
        <p className="mt-1 whitespace-pre-wrap break-words font-sans text-base leading-relaxed text-acorn-900/90">
          {review.comment}
        </p>

        {/* ユーザー投稿の写真がある場合 */}
        {review.userImage?.url && (
          <div className="mt-2 w-32 sm:w-40 aspect-square overflow-hidden rounded-2xl border-2 border-stone-100 shadow-xs">
            {isDataImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.userImage.url} alt="" className="h-full w-full object-cover" />
            ) : (
              <Image
                src={review.userImage.url}
                alt=""
                width={review.userImage.width}
                height={review.userImage.height}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}
      </div>

      {/* 店主からの返信（絵文字なし） */}
      {review.ownerReply ? (
        <div className="mt-4 rounded-2xl border border-leaf-500/30 bg-leaf-100/60 px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="font-klee text-sm font-semibold text-forest-700">店主より</p>
          <p className="mt-1 whitespace-pre-wrap break-words font-sans text-sm sm:text-base leading-relaxed text-acorn-900/90">
            {review.ownerReply}
          </p>
        </div>
      ) : null}
    </article>
  );
}
