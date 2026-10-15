"use client";

import { useState, useEffect, useCallback } from "react";
import type { SiteSettings, EmptyBoardPreset } from "@/types";
import { NextEventCard } from "@/components/next-event/NextEventCard";

export function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // フォームステート
  const [lineNotifyEnabled, setLineNotifyEnabled] = useState(true);
  const [emptyBoardTitle, setEmptyBoardTitle] = useState("");
  const [emptyBoardMessage, setEmptyBoardMessage] = useState("");
  const [emptyBoardHistory, setEmptyBoardHistory] = useState<EmptyBoardPreset[]>([]);

  // 設定取得
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const s: SiteSettings = data.settings;
        setLineNotifyEnabled(Boolean(s.lineNotifyEnabled));
        setEmptyBoardTitle(s.emptyBoardTitle || "");
        setEmptyBoardMessage(s.emptyBoardMessage || "");
        setEmptyBoardHistory(Array.isArray(s.emptyBoardHistory) ? s.emptyBoardHistory : []);
      } else {
        setFeedback({ type: "error", text: "設定データの取得に失敗しました。" });
      }
    } catch (err) {
      console.error("fetchSettings error:", err);
      setFeedback({ type: "error", text: "通信エラーが発生しました。" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // 設定保存
  const handleSave = async (customHistory?: EmptyBoardPreset[]) => {
    try {
      setSaving(true);
      setFeedback(null);

      const payload = {
        lineNotifyEnabled,
        emptyBoardTitle,
        emptyBoardMessage,
        emptyBoardHistory: customHistory ?? emptyBoardHistory,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "保存に失敗しました。");
      }

      const data = await res.json();
      const updated: SiteSettings = data.settings;
      setLineNotifyEnabled(Boolean(updated.lineNotifyEnabled));
      setEmptyBoardTitle(updated.emptyBoardTitle || "");
      setEmptyBoardMessage(updated.emptyBoardMessage || "");
      setEmptyBoardHistory(updated.emptyBoardHistory || []);

      setFeedback({
        type: "success",
        text: "設定を保存しました。公開サイトへ即座に反映されました。",
      });

      // 5秒後にメッセージを自動消去
      setTimeout(() => {
        setFeedback(null);
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "保存処理中にエラーが発生しました。";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  // 履歴から文言をセット
  const handleApplyPreset = (preset: EmptyBoardPreset) => {
    setEmptyBoardTitle(preset.title);
    setEmptyBoardMessage(preset.message);
    setFeedback({
      type: "success",
      text: `「${preset.title}」を入力欄にセットしました。「設定を保存する」を押して反映してください。`,
    });
  };

  // 履歴を削除
  const handleDeletePreset = async (id: string, title: string) => {
    if (!window.confirm(`履歴「${title}」を削除してもよろしいですか？`)) return;

    const filtered = emptyBoardHistory.filter((item) => item.id !== id);
    setEmptyBoardHistory(filtered);
    await handleSave(filtered);
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-klee text-[#7D6B5D]">
        設定を読み込んでいます...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* ページタイトルヘッダー */}
      <div>
        <h2 className="font-klee text-2xl font-bold text-[#4A3B32]">
          サイト設定 &amp; お知らせ管理
        </h2>
        <p className="mt-1 text-sm text-[#7D6B5D] font-klee">
          LINE通知のON/OFF切り替えや、出店予定がない時期にトップページ黒板に表示するメッセージを管理します。
        </p>
      </div>

      {/* 通知フィードバック */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-sm font-bold font-klee flex items-center justify-between shadow-2xs transition-all ${
            feedback.type === "success"
              ? "bg-[#E6F2E4] text-[#3D6938] border border-[#B5D6B2]"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs px-2 py-1 rounded-md opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 1. LINE通知設定カード ── */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8C7B5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#06C755]/10 flex items-center justify-center text-[#06C755] font-bold text-lg">
                💬
              </span>
              <h3 className="font-klee text-lg sm:text-xl font-bold text-[#4A3B32]">
                LINE通知（お客様の声・口コミ）
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#7D6B5D] font-klee leading-relaxed">
              新しい口コミが投稿された際に、店主のLINEアカウントへ即座に通知メッセージを送信します。
            </p>
          </div>

          {/* トグルスイッチ */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`text-xs sm:text-sm font-bold font-klee ${
                lineNotifyEnabled ? "text-[#06C755]" : "text-[#9E8E81]"
              }`}
            >
              {lineNotifyEnabled ? "通知 ON" : "通知 OFF"}
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={lineNotifyEnabled}
              onClick={() => setLineNotifyEnabled(!lineNotifyEnabled)}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                lineNotifyEnabled ? "bg-[#06C755]" : "bg-gray-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  lineNotifyEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {!lineNotifyEnabled && (
          <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-800 font-klee">
            ⚠️ 現在「LINE通知 OFF」になっています。お客様からの投稿はデータベースに通常通り保存されますが、LINEへのプッシュ通知は行われません。
          </div>
        )}
      </section>

      {/* ── 2. 出店予定なし時の黒板メッセージ編集 ── */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8C7B5] shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#C46851] font-bold text-lg">
              🪵
            </span>
            <h3 className="font-klee text-lg sm:text-xl font-bold text-[#4A3B32]">
              出店予定なし時の「黒板メッセージ」編集
            </h3>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#7D6B5D] font-klee leading-relaxed">
            直近の出店スケジュールが0件のときに、トップページの木枠黒板に表示される全文を編集できます。
            制作期間中や休業期間のお知らせなど、温かいメッセージをお届けできます。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <div className="space-y-5">
            <div>
              <label
                htmlFor="empty-board-title"
                className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider font-klee mb-1.5"
              >
                黒板タイトル <span className="text-red-500">*</span>
              </label>
              <input
                id="empty-board-title"
                type="text"
                value={emptyBoardTitle}
                onChange={(e) => setEmptyBoardTitle(e.target.value)}
                placeholder="例: 森の工房より / 次回の出店準備中 / 冬期休業のおしらせ"
                maxLength={40}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B5] focus:outline-hidden focus:ring-2 focus:ring-[#788C5D] font-klee text-sm text-[#4A3B32] bg-[#FAF8F5]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="empty-board-message"
                  className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider font-klee"
                >
                  黒板メッセージ本文（改行対応） <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#9E8E81] font-klee">
                  {emptyBoardMessage.length} 文字
                </span>
              </div>
              <textarea
                id="empty-board-message"
                rows={6}
                value={emptyBoardMessage}
                onChange={(e) => setEmptyBoardMessage(e.target.value)}
                placeholder="例: つぎの季節のマルシェに向けて、木の実を拾いながら少しずつ作品を準備しています。日程が決まり次第、この黒板でお知らせしますね。"
                maxLength={400}
                className="w-full px-4 py-3 rounded-xl border border-[#D8C7B5] focus:outline-hidden focus:ring-2 focus:ring-[#788C5D] font-klee text-sm text-[#4A3B32] bg-[#FAF8F5] leading-relaxed resize-y"
              />
              <p className="mt-1 text-[11px] text-[#9E8E81] font-klee">
                ※ 改行はそのままトップページの黒板に反映されます。
              </p>
            </div>

            {/* 保存ボタン */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving || !emptyBoardTitle.trim() || !emptyBoardMessage.trim()}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl font-klee font-bold text-white bg-[#788C5D] hover:bg-[#687C4D] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>設定を保存中...</span>
                  </>
                ) : (
                  <>
                    <span>✨ 設定を保存する</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* リアルタイム黒板プレビュー */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#7D6B5D] uppercase tracking-wider font-klee block">
              リアルタイム黒板プレビュー
            </span>
            <div className="p-4 bg-[#F2EDE4] rounded-2xl border border-[#D8C7B5]/60 overflow-hidden">
              <NextEventCard
                event={null}
                preview={true}
                emptyTitle={emptyBoardTitle || "森の工房より"}
                emptyMessage={
                  emptyBoardMessage ||
                  "つぎの季節のマルシェに向けて、木の実を拾いながら少しずつ作品を準備しています。"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 過去の文言履歴（プリセット） ── */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8C7B5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-klee text-lg sm:text-xl font-bold text-[#4A3B32] flex items-center gap-2">
              <span>📜 過去の文言履歴（プリセット）</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF0E6] text-[#C46851] border border-[#C46851]/20 font-bold">
                {emptyBoardHistory.length} 件 / 最大10件
              </span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#7D6B5D] font-klee">
              過去に保存したメッセージをワンクリックで再利用できます。季節の変わり目などに便利です。
            </p>
          </div>
        </div>

        {emptyBoardHistory.length === 0 ? (
          <div className="py-12 text-center text-sm font-klee text-[#9E8E81] bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D8C7B5]">
            過去の文言履歴はまだありません。「設定を保存する」と自動的にここに履歴として蓄積されます。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {emptyBoardHistory.map((preset) => {
              const dateStr = preset.createdAt || preset.savedAt;
              const formattedDate = dateStr
                ? new Date(dateStr).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "日時不明";

              const isCurrent =
                preset.title === emptyBoardTitle && preset.message === emptyBoardMessage;

              return (
                <div
                  key={preset.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? "bg-[#FAF0E6]/60 border-[#C46851] shadow-2xs"
                      : "bg-[#FAF8F5] border-[#D8C7B5] hover:border-[#788C5D]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-klee font-bold text-sm text-[#4A3B32] line-clamp-1">
                        {preset.title}
                      </h4>
                      {isCurrent && (
                        <span className="shrink-0 text-[10px] font-klee font-bold px-1.5 py-0.5 rounded-md bg-[#C46851] text-white">
                          現在セット中
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs font-klee text-[#7D6B5D] leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {preset.message}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EBE3D5] flex items-center justify-between text-[11px] font-klee text-[#9E8E81]">
                    <span>{formattedDate}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#D8C7B5] hover:bg-[#788C5D] hover:text-white hover:border-[#788C5D] font-bold text-[#4A3B32] transition-colors"
                      >
                        セットする
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePreset(preset.id, preset.title)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="履歴から削除"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
