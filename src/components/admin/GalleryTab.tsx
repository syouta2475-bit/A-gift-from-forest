"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { GalleryWork } from "@/types";

type GalleryTabProps = {
  works: GalleryWork[];
  onRefresh: () => void;
};

export function GalleryTab({ works, onRefresh }: GalleryTabProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 公開中と論理削除済みに分割
  const activeWorks = works.filter((w) => !w.isDeleted).sort((a, b) => a.sortOrder - b.sortOrder);
  const deletedWorks = works.filter((w) => w.isDeleted).sort((a, b) => a.sortOrder - b.sortOrder);

  // ファイルアップロード
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "アップロード失敗");
      setImageUrl(data.url);
    } catch {
      alert("写真のアップロードに失敗しました。");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // 作品追加
  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !caption) {
      alert("写真とひとこと紹介文を入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption, title }),
      });

      if (!res.ok) throw new Error("保存失敗");

      setImageUrl("");
      setCaption("");
      setTitle("");
      onRefresh();
    } catch {
      alert("作品の登録中にエラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  // 表示順の上下入れ替え
  const handleSwap = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= activeWorks.length) return;

    const currentId = activeWorks[index].id;
    const swapWithId = activeWorks[targetIndex].id;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentId, swapWithId }),
      });
      if (!res.ok) throw new Error("順序変更失敗");
      onRefresh();
    } catch {
      alert("並び替え中にエラーが発生しました。");
    }
  };

  // 論理削除（非表示化）または復活
  const handleToggleDelete = async (id: string, isDeleted: boolean) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDeleted }),
      });
      if (!res.ok) throw new Error("ステータス変更失敗");
      onRefresh();
    } catch {
      alert("更新中にエラーが発生しました。");
    }
  };

  // 完全削除
  const handlePermanentDelete = async (id: string, caption: string) => {
    if (!confirm(`「${caption}」を完全に削除しますか？\n（復元できなくなります）`)) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("完全削除失敗");
      onRefresh();
    } catch {
      alert("削除中にエラーが発生しました。");
    }
  };

  return (
    <div className="space-y-10 font-sans">
      {/* ── 新規作品登録フォーム ── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC8] shadow-sm">
        <h2 className="font-klee text-xl sm:text-2xl font-bold text-acorn-900 pb-3 border-b border-stone-100 mb-6">
          新しい作品の追加
        </h2>

        <form onSubmit={handleAddWork} className="space-y-4 text-sm max-w-2xl">
          {/* 写真選択（アップロードまたはURL） */}
          <div>
            <label className="block font-bold text-acorn-800 mb-1">
              作品写真 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                required
                placeholder="https://... または写真を選択"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-5 py-2.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-acorn-900 font-bold text-xs sm:text-sm shrink-0 transition"
              >
                {uploading ? "アップロード中..." : "📷 写真を選ぶ"}
              </button>
            </div>
            {imageUrl && (
              <div className="mt-3 relative w-32 h-32 rounded-2xl overflow-hidden border border-stone-200">
                <Image src={imageUrl} alt="プレビュー" fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-acorn-800 mb-1">
                ひとこと紹介文（写真の下に表示） <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="例: 木の実のチャーム"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-acorn-800 mb-1">
                作品名（詳細・任意）
              </label>
              <input
                type="text"
                placeholder="例: どんぐりのお守りストラップ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 min-h-12 px-8 rounded-2xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-bold text-base transition shadow-md disabled:opacity-50"
          >
            {submitting ? "登録中..." : "作品をギャラリーに追加する"}
          </button>
        </form>
      </div>

      {/* ── 公開中の作品一覧（並び替え・論理削除） ── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC8] shadow-sm">
        <h3 className="font-klee text-xl sm:text-2xl font-bold text-acorn-900 pb-3 border-b border-stone-100 mb-6 flex items-center justify-between">
          <span>公開中の作品一覧（{activeWorks.length}件）</span>
          <span className="text-xs text-acorn-600 font-sans font-normal">
            矢印ボタンでサイト上の表示順を入れ替えられます
          </span>
        </h3>

        {activeWorks.length === 0 ? (
          <p className="py-8 text-center text-stone-500 text-sm">現在公開中の作品はありません。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeWorks.map((work, index) => (
              <div
                key={work.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC8]"
              >
                <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                  <Image src={work.imageUrl} alt={work.caption} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-klee text-base font-bold text-acorn-900 truncate">
                    {work.caption}
                  </h4>
                  {work.title && (
                    <p className="text-xs text-acorn-700 truncate">{work.title}</p>
                  )}
                  <p className="text-2xs text-stone-400 mt-1">表示順: {index + 1}</p>
                </div>

                {/* 操作ボタン */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleSwap(index, -1)}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-300 text-xs font-bold text-acorn-800 disabled:opacity-30 hover:bg-cream-100"
                      title="前へ移動"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === activeWorks.length - 1}
                      onClick={() => handleSwap(index, 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-300 text-xs font-bold text-acorn-800 disabled:opacity-30 hover:bg-cream-100"
                      title="次へ移動"
                    >
                      ▼
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleDelete(work.id, true)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-50"
                  >
                    非表示にする
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 非表示（論理削除済み）の作品一覧 ── */}
      {deletedWorks.length > 0 && (
        <div className="bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200">
          <h3 className="font-klee text-lg sm:text-xl font-bold text-stone-700 pb-3 border-b border-stone-200 mb-4">
            非表示・アーカイブ済みの作品（{deletedWorks.length}件）
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            サイト上には表示されていません。「もう一度表示する」を押すと公開サイトへ復活します。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deletedWorks.map((work) => (
              <div
                key={work.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200 opacity-80"
              >
                <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200 grayscale">
                  <Image src={work.imageUrl} alt={work.caption} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-2xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                    非表示中
                  </span>
                  <h4 className="font-klee text-sm font-bold text-stone-800 truncate mt-1">
                    {work.caption}
                  </h4>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleDelete(work.id, false)}
                    className="px-3 py-1.5 rounded-lg bg-forest-600 text-white text-xs font-bold hover:bg-forest-700 shadow-2xs"
                  >
                    もう一度表示する
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePermanentDelete(work.id, work.caption)}
                    className="px-3 py-1 rounded-lg text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    完全削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
