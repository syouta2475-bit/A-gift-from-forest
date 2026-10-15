"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLogo } from "@/components/ui/Icons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ログインに失敗しました。");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-lg border border-[#E6DEC8]/80">
      <div className="flex flex-col items-center text-center mb-6">
        <MainLogo className="w-48 h-auto mb-2 drop-shadow-2xs" />
        <h1 className="font-klee text-2xl font-bold text-acorn-900 mt-2">
          店主管理画面
        </h1>
        <p className="font-sans text-xs sm:text-sm text-acorn-700 mt-1">
          出店予定・作品・口コミの管理
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-[#FCECE8] border border-[#E8A89A] text-xs sm:text-sm text-[#b5483f] font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <div>
          <label htmlFor="admin-password" className="block text-sm font-bold text-acorn-800 mb-1">
            管理パスワード
          </label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            className="w-full rounded-2xl border border-beige-300 bg-[#FAF7F2] px-4 py-3 text-base text-acorn-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-12 rounded-2xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-bold text-base transition shadow-md active:scale-98 disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "ログインする"}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-stone-100 text-center">
        <a
          href="/"
          className="text-xs sm:text-sm text-acorn-600 hover:text-acorn-900 underline font-sans"
        >
          ← サイトのトップページへ戻る
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="font-klee text-[#7D6B5D]">読み込み中...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
