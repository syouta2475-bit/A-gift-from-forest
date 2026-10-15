"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { compressReviewPhoto } from "@/lib/compress-image";
import type { Review } from "@/types";

type ReviewFormValues = {
  nickname: string;
  comment: string;
};

type ReviewFormProps = {
  onPosted: (review: Review) => void;
};

export function ReviewForm({ onPosted }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({ defaultValues: { nickname: "", comment: "" } });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // 1. ハニーポット（人間には見えずボットだけが入力するダミーフィールド）
  const [honeypot, setHoneypot] = useState("");

  // 2. フォーム表示時刻（2秒未満の機械的送信を検知）
  const [mountedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openCamera = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onPickPhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setSubmitError(null);
    setCompressing(true);
    try {
      const compressed = await compressReviewPhoto(file);
      setPhotoFile(compressed);
      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return URL.createObjectURL(compressed);
      });
    } catch {
      setSubmitError("写真の準備に失敗しました。もう一度お試しください。");
    } finally {
      setCompressing(false);
    }
  }, []);

  const clearPhoto = useCallback(() => {
    setPhotoFile(null);
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitMessage(null);

    const form = new FormData();
    form.set("nickname", values.nickname.trim());
    form.set("comment", values.comment.trim());
    form.set("website_url", honeypot); // ハニーポット
    form.set("formRenderTime", String(mountedAt)); // フォーム表示時刻
    if (photoFile) form.set("photo", photoFile, photoFile.name || "photo.jpg");

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: form });
      const data = (await res.json()) as {
        success?: boolean;
        review?: Review;
        error?: string;
        message?: string;
      };

      if (!res.ok || !data.success || !data.review) {
        setSubmitError(data.error ?? "送信に失敗しました。時間をおいて再度お試しください。");
        return;
      }

      onPosted(data.review);
      reset();
      clearPhoto();
      setHoneypot("");
      setSubmitMessage(data.message ?? "温かいメッセージをありがとうございました！");
    } catch {
      setSubmitError("通信エラーが発生しました。ネットワークを確認してください。");
    }
  });

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass mt-12 rounded-[2.5rem] px-6 py-8 sm:px-10 sm:py-10 border border-stone-200/60 shadow-xs relative"
      aria-labelledby="review-form-title"
    >
      <h3 id="review-form-title" className="font-klee text-xl font-semibold text-acorn-900 sm:text-2xl">
        感想を送る
      </h3>
      <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-acorn-800/85">
        マルシェで迎えてくださった作品の写真や、ひとことメッセージをお寄せください（ニックネームのみ公開されます）。
      </p>

      {/* ── ハニーポット（ボット排除ダミーフィールド：人間には不可視） ── */}
      <div
        className="opacity-0 absolute -z-10 pointer-events-none h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website_url">Web Site</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="review-nickname" className="font-klee text-base font-semibold text-acorn-800">
            お名前（ニックネーム）
          </label>
          <input
            id="review-nickname"
            autoComplete="nickname"
            className="mt-2 w-full rounded-2xl border border-beige-300 bg-white px-4 py-3 font-sans text-base text-acorn-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500"
            placeholder="例：どんぐりさん"
            {...register("nickname", {
              required: "お名前を入力してください",
              minLength: { value: 2, message: "2文字以上で入力してください" },
              maxLength: { value: 20, message: "20文字以内で入力してください" },
              validate: (val) => {
                const trimmed = val.trim();
                if (trimmed.length < 2) return "お名前を2文字以上で入力してください";
                const allowed = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z0-9０-９ａ-ｚＡ-Ｚー〜\s]+$/;
                if (!allowed.test(trimmed)) {
                  return "漢字・ひらがな・カタカナ・英数字のみ使用できます（記号やURLは使えません）";
                }
                return true;
              },
            })}
          />
          {errors.nickname ? (
            <p className="mt-2 text-sm font-semibold text-[#b5483f]" role="alert">
              {errors.nickname.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="review-comment" className="font-klee text-base font-semibold text-acorn-800">
            メッセージ
          </label>
          <textarea
            id="review-comment"
            rows={4}
            className="mt-2 w-full resize-y rounded-2xl border border-beige-300 bg-white px-4 py-3 font-sans text-base leading-relaxed text-acorn-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500"
            placeholder="作品の感想や、マルシェでの思い出など（256文字以内）"
            {...register("comment", {
              required: "メッセージを入力してください",
              minLength: { value: 2, message: "2文字以上で入力してください" },
              maxLength: { value: 256, message: "256文字以内で入力してください" },
              validate: (val) => {
                const trimmed = val.trim();
                if (trimmed.length < 2) return "メッセージを2文字以上で入力してください";
                if (/<[a-z/][\s\S]*>/i.test(trimmed) || /javascript:/i.test(trimmed)) {
                  return "HTMLタグやスクリプトを含む文章は投稿できません";
                }
                if (/https?:\/\/|www\./i.test(trimmed)) {
                  return "URLリンクを含む文章は投稿できません";
                }
                return true;
              },
            })}
          />
          {errors.comment ? (
            <p className="mt-2 text-sm font-semibold text-[#b5483f]" role="alert">
              {errors.comment.message}
            </p>
          ) : null}
        </div>

        <div>
          <p className="font-klee text-base font-semibold text-acorn-800">写真（任意）</p>
          <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-acorn-700/80">
            カメラでの撮影、または写真アルバムから選択できます。送信前に端末内で位置情報（GPS等のEXIF情報）を100%自動消去して安全に送信されます。
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPickPhoto}
            aria-label="作品の写真を撮る、または選ぶ"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openCamera}
              disabled={compressing}
              className="inline-flex min-h-11 items-center rounded-full bg-cream-100 px-5 font-sans text-sm font-bold text-acorn-800 transition hover:bg-cream-200 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500 border border-acorn-200/60"
            >
              {compressing ? "写真を準備中…" : "写真を撮る／選ぶ"}
            </button>
            {previewUrl ? (
              <button
                type="button"
                onClick={clearPhoto}
                className="font-sans text-sm font-bold text-acorn-600 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acorn-500"
              >
                写真を取り消す
              </button>
            ) : null}
          </div>
          {previewUrl ? (
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border-2 border-white shadow-xs max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="選択した写真のプレビュー" className="max-h-56 w-full object-cover" />
            </div>
          ) : null}
        </div>

        {submitError ? (
          <p className="font-sans text-sm font-bold text-[#b5483f]" role="alert">
            {submitError}
          </p>
        ) : null}
        {submitMessage ? (
          <p className="rounded-2xl bg-honey-200 px-4 py-3 font-sans text-sm font-bold text-acorn-900" role="status">
            {submitMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || compressing}
          className="flex min-h-13 w-full items-center justify-center rounded-full bg-forest-600 font-sans text-base font-bold text-cream-50 shadow-sm transition hover:bg-forest-700 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-700 cursor-pointer"
        >
          {isSubmitting ? "送信中…" : "感想を送る"}
        </button>
      </div>
    </motion.form>
  );
}
