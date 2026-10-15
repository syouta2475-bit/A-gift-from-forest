"use client";

import { useState } from "react";
import type { MarcheEvent } from "@/types";
import { NextEventCard } from "@/components/next-event/NextEventCard";
import { pickNextEvent, formatEventDateRange } from "@/lib/events-utils";

type EventTabProps = {
  events: MarcheEvent[];
  onRefresh: () => void;
};

export function EventTab({ events, onRefresh }: EventTabProps) {
  // 編集中のイベント（新規時は null）
  const [editingId, setEditingId] = useState<string | null>(null);

  // フォームステート（新規作成時は空から開始）
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("10:00〜16:00");
  const [location, setLocation] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [publishAt, setPublishAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 現在黒板に選出されているイベント
  const currentNextEvent = pickNextEvent(events, new Date());
  const currentNextId = currentNextEvent?.id;

  // フォームに入力中の日付があるか判定（未入力・リセット後の空文字ガード）
  const hasFormDate = Boolean(startDate && startDate.trim().length > 0);

  // リアルタイムプレビュー用のイベントオブジェクト（未入力時は現在登録済みの直近イベント、または null）
  const previewEvent: MarcheEvent | null = hasFormDate
    ? {
        id: editingId || "preview-id",
        startDate: startDate.trim(),
        endDate: (endDate || startDate).trim(),
        time: time || "10:00〜16:00",
        location: location || "出店会場名",
        mapUrl: mapUrl && mapUrl.trim() !== "" ? mapUrl.trim() : undefined,
        title: title || "マルシェ出店タイトル",
        description: description || "出店の見どころやご紹介メッセージを入力してください。",
        highlights: highlights.filter(Boolean),
        publishAt: publishAt ? new Date(publishAt).toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    : (currentNextEvent ?? null);

  // 編集開始
  const handleEdit = (ev: MarcheEvent) => {
    setEditingId(ev.id);
    setStartDate(ev.startDate);
    setEndDate(ev.endDate);
    setTime(ev.time);
    setLocation(ev.location);
    setMapUrl(ev.mapUrl || "");
    setTitle(ev.title);
    setDescription(ev.description);
    setHighlights(ev.highlights && Array.isArray(ev.highlights) ? [...ev.highlights] : []);
    setPublishAt(ev.publishAt ? ev.publishAt.slice(0, 16) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 新規作成にリセット（完全に空にする）
  const handleReset = () => {
    setEditingId(null);
    setStartDate("");
    setEndDate("");
    setTime("10:00〜16:00");
    setLocation("");
    setMapUrl("");
    setTitle("");
    setDescription("");
    setHighlights([]);
    setPublishAt("");
  };

  // ハイライト項目の追加・更新・削除
  const updateHighlight = (index: number, val: string) => {
    const next = [...highlights];
    next[index] = val;
    setHighlights(next);
  };
  const addHighlight = () => {
    if (highlights.length < 4) setHighlights([...highlights, ""]);
  };
  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // 保存（新規または更新）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      startDate: startDate.trim(),
      endDate: (endDate || startDate).trim(),
      time: time.trim(),
      location: location.trim(),
      mapUrl: mapUrl && mapUrl.trim() !== "" ? mapUrl.trim() : null,
      title: title.trim(),
      description: description.trim(),
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      publishAt: publishAt ? new Date(publishAt).toISOString() : null,
    };

    try {
      const url = editingId ? `/api/admin/events/${editingId}` : "/api/admin/events";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存に失敗しました。");
      }

      setMessage(editingId ? "予定を更新しました！" : "新しい予定を登録しました！");
      handleReset();
      onRefresh();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "エラーが発生しました。";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // 削除
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」の出店予定を削除しますか？\n（カレンダーと黒板からも削除されます）`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました。");
      onRefresh();
      if (editingId === id) handleReset();
    } catch {
      alert("削除中にエラーが発生しました。");
    }
  };

  return (
    <div className="space-y-12">
      {/* ── 登録・編集フォーム ＆ リアルタイム黒板プレビュー ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左側：入力フォーム */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC8] shadow-sm font-sans">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
            <h2 className="font-klee text-xl sm:text-2xl font-bold text-acorn-900">
              {editingId ? "出店予定の編集" : "新しい出店予定の登録"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs sm:text-sm text-acorn-600 hover:text-acorn-900 font-bold underline"
              >
                新規登録に戻る
              </button>
            )}
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-[#E6F2DD] border border-[#9BB894] text-xs sm:text-sm text-forest-700 font-bold">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* 開催期間（開始日〜終了日） */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-acorn-800 mb-1">
                  開始日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (!endDate || endDate < e.target.value) setEndDate(e.target.value);
                  }}
                  className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-acorn-800 mb-1">
                  終了日 <span className="text-stone-400 font-normal">（1日開催は同日）</span>
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
                />
              </div>
            </div>

            {/* 時間 ＆ 会場 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-acorn-800 mb-1">
                  開催時間 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: 10:00〜16:00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-acorn-800 mb-1">
                  会場名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: さくら公園 中央広場"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
                />
              </div>
            </div>

            {/* Google マップ URL */}
            <div>
              <label className="block font-bold text-acorn-800 mb-0.5">
                GoogleマップURL <span className="text-stone-400 font-normal">（任意）</span>
              </label>
              <p className="text-2xs sm:text-xs text-acorn-600 mb-1.5">
                ※GoogleマップのURLが入力された場合のみ、公開サイトに「地図を開く」ボタンが表示されます
              </p>
              <input
                type="url"
                placeholder="https://maps.app.goo.gl/..."
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
              />
            </div>

            {/* マルシェ名（黒板見出し） */}
            <div>
              <label className="block font-bold text-acorn-800 mb-1">
                マルシェ名・出店タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="例: もりのマルシェ 秋のどんぐりまつり"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
              />
            </div>

            {/* 黒板紹介文 */}
            <div>
              <label className="block font-bold text-acorn-800 mb-1">
                黒板の手書きメッセージ（紹介文） <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="黒板の中央にチョーク文字で表示されるメッセージです（改行もそのまま黒板に反映されます）"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none leading-relaxed"
              />
            </div>

            {/* 箇条書きハイライト（0〜4項目） */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-acorn-800">
                  黒板の箇条書きハイライト <span className="text-stone-400 font-normal">（任意・最大4項目）</span>
                </label>
                {highlights.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHighlights([])}
                    className="text-2xs text-stone-500 hover:text-red-600 underline"
                  >
                    すべて消去
                  </button>
                )}
              </div>
              <p className="text-2xs text-acorn-600 mb-2">
                ※すべて消去すると、黒板上で箇条書きリスト（✽マーク）は非表示になります
              </p>

              {highlights.length === 0 ? (
                <div className="p-3 rounded-xl border border-dashed border-beige-300 bg-[#FAF7F2]/60 text-xs text-acorn-600 flex items-center justify-between">
                  <span>箇条書きは未設定です（なしでも登録できます）</span>
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-2.5 py-1 rounded-lg bg-forest-600 text-cream-50 font-bold text-xs hover:bg-forest-700 transition"
                  >
                    ＋ 箇条書きを追加
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-forest-600 font-bold shrink-0">✽</span>
                      <input
                        type="text"
                        placeholder={`ポイント ${i + 1}（例: 秋の新作チャーム）`}
                        value={h}
                        onChange={(e) => updateHighlight(i, e.target.value)}
                        className="flex-1 rounded-xl border border-beige-300 p-2 bg-[#FAF7F2] text-acorn-900 text-sm focus:ring-2 focus:ring-forest-600 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(i)}
                        className="text-stone-400 hover:text-red-500 text-sm p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="この項目を削除"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {highlights.length > 0 && highlights.length < 4 && (
                <button
                  type="button"
                  onClick={addHighlight}
                  className="mt-2 text-xs font-bold text-forest-700 hover:text-forest-800"
                >
                  ＋ 項目を追加する（残り{4 - highlights.length}件）
                </button>
              )}
            </div>

            {/* 予約公開日時 */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block font-bold text-acorn-800 mb-1">
                予約公開日時 <span className="text-stone-400 font-normal">（未指定時は今すぐ公開）</span>
              </label>
              <input
                type="datetime-local"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-beige-300 p-2.5 bg-[#FAF7F2] text-acorn-900 focus:ring-2 focus:ring-forest-600 outline-none"
              />
              <p className="mt-1 text-xs text-acorn-600">
                未来の日時を指定すると、その日時になるまで一般のサイト（カレンダー・黒板）には非表示になります。
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 min-h-12 rounded-2xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-bold text-base transition shadow-md disabled:opacity-50"
            >
              {submitting ? "保存中..." : editingId ? "変更を更新する" : "出店予定を登録する"}
            </button>
          </form>
        </div>

        {/* 右側：リアルタイム黒板プレビュー */}
        <div className="lg:col-span-6">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3 px-2">
              <p className="font-klee text-lg font-bold text-acorn-900 flex items-center gap-2">
                <span>🎨 リアルタイム黒板プレビュー</span>
              </p>
              <span className="text-xs bg-cream-200/90 text-acorn-800 font-bold px-3 py-1 rounded-full">
                {hasFormDate ? "入力内容を即時反映中" : "現在選出中の黒板"}
              </span>
            </div>

            {/* 黒板コンポーネントプレビュー */}
            <div className="pointer-events-none transform scale-[0.95] origin-top">
              <NextEventCard event={previewEvent} preview />
            </div>
          </div>
        </div>
      </div>

      {/* ── 登録済み出店予定一覧 ── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC8] shadow-sm font-sans">
        <h3 className="font-klee text-xl sm:text-2xl font-bold text-acorn-900 mb-6 pb-3 border-b border-stone-100 flex items-center justify-between">
          <span>登録済みの出店予定一覧（{events.length}件）</span>
        </h3>

        {events.length === 0 ? (
          <p className="py-8 text-center text-stone-500 text-sm">
            出店予定がまだ登録されていません。上のフォームから登録してください。
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => {
              const isSelectedForBlackboard = ev.id === currentNextId;
              const dateRange = formatEventDateRange(ev.startDate, ev.endDate);
              const isFuture = ev.endDate >= new Date().toISOString().slice(0, 10);
              const isScheduled = ev.publishAt && new Date(ev.publishAt) > new Date();

              return (
                <div
                  key={ev.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSelectedForBlackboard
                      ? "bg-honey-100/60 border-honey-400 ring-2 ring-honey-300"
                      : "bg-[#FAF7F2] border-[#E6DEC8]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        {isSelectedForBlackboard && (
                          <span className="px-3 py-0.5 rounded-full bg-forest-600 text-white font-bold text-xs shadow-2xs">
                            ★ 現在黒板に表示中
                          </span>
                        )}
                        {isScheduled && (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                            予約公開中 ({new Date(ev.publishAt!).toLocaleDateString("ja-JP")})
                          </span>
                        )}
                        {!isFuture && (
                          <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-600 font-medium text-xs">
                            終了
                          </span>
                        )}
                        <h4 className="font-klee text-lg sm:text-xl font-bold text-acorn-900">
                          {ev.title}
                        </h4>
                      </div>

                      <p className="text-sm font-bold text-acorn-700">
                        {dateRange.displayDate} ({ev.time})
                      </p>
                      <p className="text-xs text-acorn-600">会場: {ev.location}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(ev)}
                        className="px-4 py-2 rounded-xl bg-white border border-acorn-200 text-acorn-800 hover:bg-cream-100 font-bold text-xs sm:text-sm shadow-2xs transition"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs sm:text-sm shadow-2xs transition"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
