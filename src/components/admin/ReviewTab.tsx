"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Review } from "@/types";
import { CommunicationIllust, AcornIllust } from "@/components/ui/Icons";

export function ReviewTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unreplied" | "replied">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("口コミの取得に失敗しました。");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "口コミの読み込みに失敗しました。";
      setStatusMsg({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 返信編集開始
  const startEditReply = (review: Review) => {
    setEditingId(review.id);
    setReplyText(review.ownerReply || "");
  };

  // 返信保存
  const handleSaveReply = async (id: string) => {
    try {
      setSavingId(id);
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ownerReply: replyText }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "返信の保存に失敗しました。");
      }
      setStatusMsg({ text: "店主からの返信を更新しました。", type: "success" });
      setEditingId(null);
      await fetchReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "返信の保存に失敗しました。";
      setStatusMsg({ text: msg, type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!window.confirm("この口コミを完全に削除してもよろしいですか？（元に戻せません）")) {
      return;
    }
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "削除に失敗しました。");
      }
      setStatusMsg({ text: "口コミを削除しました。", type: "success" });
      await fetchReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "口コミの削除に失敗しました。";
      setStatusMsg({ text: msg, type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "unreplied") return !r.ownerReply;
    if (filter === "replied") return Boolean(r.ownerReply);
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 画面見出し */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8C7B5]">
        <div>
          <div className="flex items-center gap-2">
            <CommunicationIllust className="w-8 h-auto text-[#788C5D]" />
            <h2 className="font-klee text-2xl font-bold text-[#4A3B32]">お客様の声・返信管理</h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#7D6B5D]">
            届いた口コミの確認、店主からの返信作成、不適切な投稿の削除が行えます。
          </p>
        </div>

        {/* 絞り込みフィルター */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF6EE] rounded-xl border border-[#D8C7B5]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-klee font-bold transition-all ${
              filter === "all" ? "bg-[#4A3B32] text-white shadow-xs" : "text-[#7D6B5D] hover:bg-white"
            }`}
          >
            すべて ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unreplied")}
            className={`px-3 py-1.5 rounded-lg text-xs font-klee font-bold transition-all ${
              filter === "unreplied" ? "bg-[#C46851] text-white shadow-xs" : "text-[#7D6B5D] hover:bg-white"
            }`}
          >
            未返信 ({reviews.filter((r) => !r.ownerReply).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("replied")}
            className={`px-3 py-1.5 rounded-lg text-xs font-klee font-bold transition-all ${
              filter === "replied" ? "bg-[#788C5D] text-white shadow-xs" : "text-[#7D6B5D] hover:bg-white"
            }`}
          >
            返信済み ({reviews.filter((r) => Boolean(r.ownerReply)).length})
          </button>
        </div>
      </div>

      {/* ステータスメッセージ */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between border ${
            statusMsg.type === "success"
              ? "bg-[#E6F2E4] text-[#344E41] border-[#B5D6B2]"
              : "bg-[#FDE8E8] text-[#9B2C2C] border-[#F8B4B4]"
          }`}
        >
          <span>{statusMsg.text}</span>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-60 hover:opacity-100 ml-4 underline"
          >
            閉じる
          </button>
        </div>
      )}

      {/* 口コミ一覧 */}
      {loading ? (
        <div className="py-20 text-center text-sm font-klee text-[#7D6B5D]">
          口コミを読み込んでいます...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#D8C7B5] p-8">
          <AcornIllust className="w-10 h-10 mx-auto text-[#C8B9A6] mb-3 opacity-60" />
          <p className="font-klee text-base text-[#7D6B5D]">該当する口コミはありません</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => {
            const isEditing = editingId === review.id;
            const isSaving = savingId === review.id;
            const isDeleting = deletingId === review.id;
            const isDataImg = review.userImage?.url?.startsWith("data:");

            return (
              <div
                key={review.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D8C7B5] shadow-xs space-y-4 hover:border-[#B5A898] transition-all"
              >
                {/* ヘッダー情報 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#D8C7B5] flex items-center justify-center text-[#788C5D]">
                      <AcornIllust className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-klee text-base font-bold text-[#4A3B32]">
                        {review.nickname} <span className="text-xs font-normal text-[#7D6B5D]">さん</span>
                      </h3>
                      <time className="text-xs text-[#9E8E81]">
                        {new Date(review.createdAt).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* ステータスバッジ */}
                    {review.ownerReply ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-klee font-bold bg-[#E6F2E4] text-[#344E41] border border-[#B5D6B2]">
                        返信済み
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-klee font-bold bg-[#FAF0E6] text-[#C46851] border border-[#E9C4B4]">
                        未返信
                      </span>
                    )}

                    {/* 削除ボタン */}
                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 rounded-lg text-xs font-klee font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? "削除中..." : "削除"}
                    </button>
                  </div>
                </div>

                {/* 口コミ本文 & 添付画像 */}
                <div className="space-y-3">
                  <p className="whitespace-pre-wrap break-words font-sans text-sm sm:text-base leading-relaxed text-[#4A3B32]">
                    {review.comment}
                  </p>

                  {review.userImage?.url && (
                    <div className="w-28 sm:w-36 aspect-square rounded-2xl overflow-hidden border border-[#D8C7B5] bg-[#FAF6EE] relative">
                      {isDataImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.userImage.url}
                          alt="投稿写真"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={review.userImage.url}
                          alt="投稿写真"
                          fill
                          sizes="150px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* 店主からの返信エリア */}
                <div className="mt-4 pt-3 border-t border-[#F0EBE1]">
                  {isEditing ? (
                    <div className="space-y-3 bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-[#D8C7B5]">
                      <div className="flex items-center justify-between">
                        <label className="font-klee text-sm font-bold text-[#344E41]">
                          店主からの返信を編集
                        </label>
                        <span className="text-xs text-[#7D6B5D]">
                          ※空欄にして保存すると返信を削除できます
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="温かい感謝のメッセージを入力してください..."
                        className="w-full px-4 py-3 rounded-xl border border-[#D8C7B5] bg-white font-sans text-sm focus:outline-hidden focus:ring-2 focus:ring-[#788C5D] text-[#4A3B32] resize-y"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          disabled={isSaving}
                          className="px-4 py-2 rounded-xl text-xs font-klee font-bold text-[#7D6B5D] bg-white hover:bg-[#F0EBE1] border border-[#D8C7B5] transition-colors"
                        >
                          キャンセル
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveReply(review.id)}
                          disabled={isSaving}
                          className="px-5 py-2 rounded-xl text-xs font-klee font-bold text-white bg-[#788C5D] hover:bg-[#687C4F] shadow-xs transition-colors disabled:opacity-50"
                        >
                          {isSaving ? "保存中..." : "返信を保存する"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {review.ownerReply ? (
                        <div className="rounded-2xl border border-[#B5D6B2] bg-[#E6F2E4]/60 px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <span className="font-klee text-xs sm:text-sm font-bold text-[#344E41] flex items-center gap-1.5">
                              店主より
                            </span>
                            <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#4A3B32] whitespace-pre-wrap break-words">
                              {review.ownerReply}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => startEditReply(review)}
                            className="self-end sm:self-start px-3 py-1.5 rounded-lg text-xs font-klee font-bold text-[#344E41] bg-white hover:bg-[#D5E6D3] border border-[#B5D6B2] shadow-2xs transition-colors"
                          >
                            返信を編集
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#9E8E81] italic">
                            まだ店主からの返信はありません
                          </span>
                          <button
                            type="button"
                            onClick={() => startEditReply(review)}
                            className="px-4 py-1.5 rounded-xl text-xs font-klee font-bold text-white bg-[#788C5D] hover:bg-[#687C4F] shadow-2xs transition-colors"
                          >
                            店主として返信する
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
