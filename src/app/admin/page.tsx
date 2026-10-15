"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { MarcheEvent, GalleryWork } from "@/types";
import { EventTab } from "@/components/admin/EventTab";
import { GalleryTab } from "@/components/admin/GalleryTab";
import { ReviewTab } from "@/components/admin/ReviewTab";
import {
  PineconeIllust,
  AcornIllust,
  CommunicationIllust,
  MarcheBoothIllust,
} from "@/components/ui/Icons";

type TabType = "events" | "gallery" | "reviews";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>("events");
  const [loggingOut, setLoggingOut] = useState(false);

  // データステート
  const [events, setEvents] = useState<MarcheEvent[]>([]);
  const [works, setWorks] = useState<GalleryWork[]>([]);
  const [loading, setLoading] = useState(true);

  // イベント取得
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }, []);

  // ギャラリー作品取得
  const fetchWorks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setWorks(data.works || []);
      }
    } catch (err) {
      console.error("Failed to fetch gallery works:", err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchEvents(), fetchWorks()]);
    setLoading(false);
  }, [fetchEvents, fetchWorks]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (tabParam && (tabParam === "events" || tabParam === "gallery" || tabParam === "reviews")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.replace(`/admin?tab=${tab}`);
  };

  const handleLogout = async () => {
    if (!window.confirm("管理画面からログアウトしますか？")) return;
    try {
      setLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#4A3B32]">
      {/* 管理ヘッダー */}
      <header className="sticky top-0 z-30 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#D8C7B5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#E6F2E4] border border-[#B5D6B2] flex items-center justify-center text-[#788C5D] shadow-2xs">
              <PineconeIllust className="w-6 h-6" />
            </span>
            <div>
              <h1 className="font-klee text-lg sm:text-xl font-bold tracking-wide text-[#4A3B32]">
                森からのおくりもの
              </h1>
              <span className="text-[11px] font-sans text-[#7D6B5D] tracking-wider uppercase font-semibold">
                Admin Management Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-klee font-bold text-[#4A3B32] hover:bg-white border border-[#D8C7B5] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>サイトを確認</span>
              <svg className="w-3.5 h-3.5 text-[#7D6B5D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-klee font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
            >
              {loggingOut ? "ログアウト中..." : "ログアウト"}
            </button>
          </div>
        </div>

        {/* ナビゲーションタブ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-2 sm:space-x-4 border-t border-[#EBE3D5] pt-2" aria-label="Tabs">
            <button
              type="button"
              onClick={() => handleTabChange("events")}
              className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-klee text-sm sm:text-base font-bold border-b-2 transition-all ${
                activeTab === "events"
                  ? "border-[#C46851] text-[#C46851] bg-[#FAF0E6]/50 rounded-t-xl"
                  : "border-transparent text-[#7D6B5D] hover:text-[#4A3B32] hover:border-[#D8C7B5]"
              }`}
            >
              <MarcheBoothIllust className="w-5 h-auto shrink-0" />
              <span>出店スケジュール</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("gallery")}
              className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-klee text-sm sm:text-base font-bold border-b-2 transition-all ${
                activeTab === "gallery"
                  ? "border-[#788C5D] text-[#788C5D] bg-[#E6F2E4]/50 rounded-t-xl"
                  : "border-transparent text-[#7D6B5D] hover:text-[#4A3B32] hover:border-[#D8C7B5]"
              }`}
            >
              <AcornIllust className="w-4 h-auto shrink-0" />
              <span>作品ギャラリー</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("reviews")}
              className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-klee text-sm sm:text-base font-bold border-b-2 transition-all ${
                activeTab === "reviews"
                  ? "border-[#5E81AC] text-[#5E81AC] bg-[#ECEFF4]/50 rounded-t-xl"
                  : "border-transparent text-[#7D6B5D] hover:text-[#4A3B32] hover:border-[#D8C7B5]"
              }`}
            >
              <CommunicationIllust className="w-6 h-auto shrink-0" />
              <span>お客様の声</span>
            </button>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading && events.length === 0 && works.length === 0 ? (
          <div className="py-24 text-center font-klee text-[#7D6B5D]">
            管理データを読み込んでいます...
          </div>
        ) : (
          <>
            {activeTab === "events" && <EventTab events={events} onRefresh={fetchEvents} />}
            {activeTab === "gallery" && <GalleryTab works={works} onRefresh={fetchWorks} />}
            {activeTab === "reviews" && <ReviewTab />}
          </>
        )}
      </main>

      {/* フッター */}
      <footer className="py-8 text-center text-xs font-klee text-[#9E8E81] border-t border-[#D8C7B5]">
        森からのおくりもの 管理システム &copy; 2026
      </footer>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center font-klee text-[#7D6B5D]">
          管理画面を読み込んでいます...
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
