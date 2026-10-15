type ReviewListSkeletonProps = {
  /** セクション内に埋め込むときは見出しを省略 */
  embedded?: boolean;
};

/** 口コミ読み込み中のスケルトン（高齢の方にも「読み込み中」と分かる余白） */
export function ReviewListSkeleton({ embedded }: ReviewListSkeletonProps) {
  const cards = (
    <ul className="mt-10 flex flex-col gap-5" aria-busy="true" aria-label="口コミを読み込んでいます">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="animate-pulse rounded-[2rem] bg-white/70 px-6 py-6 shadow-[0_10px_24px_rgb(107_68_35/0.08)]"
        >
          <div className="flex gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-beige-200" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-32 rounded-full bg-beige-200" />
              <div className="h-4 w-full rounded-full bg-beige-200" />
              <div className="h-4 w-[85%] rounded-full bg-beige-200" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  if (embedded) {
    return (
      <section id="reviews" className="bg-cream-50 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <div className="animate-pulse space-y-3 text-center">
            <div className="mx-auto h-4 w-28 rounded-full bg-beige-200" />
            <div className="mx-auto h-10 w-64 rounded-full bg-beige-200" />
          </div>
          {cards}
        </div>
      </section>
    );
  }

  return cards;
}
