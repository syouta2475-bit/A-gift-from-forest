/**
 * 口コミ投稿通知ヘルパー（LINE Messaging API & メール通知）
 */

type ReviewNotificationPayload = {
  nickname: string;
  comment: string;
  hasPhoto?: boolean;
  createdAt: string;
};

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

/** LINE Messaging API へのプッシュ通知 */
async function notifyLine(payload: ReviewNotificationPayload): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const toUserId = process.env.LINE_ADMIN_USER_ID;

  if (!token || !toUserId) {
    return false;
  }

  const siteUrl = getSiteUrl();

  const messageText = [
    `🌲「森からのおくりもの」に新しいお客様の声が届きました！`,
    ``,
    `【お名前】`,
    `${payload.nickname} さん`,
    ``,
    `【メッセージ】`,
    payload.comment,
    ...(payload.hasPhoto ? [``, `📷 写真も添付されています`] : []),
    ``,
    `▼ 管理画面で確認・返信する`,
    `${siteUrl}/admin`,
  ].join("\n");

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: toUserId,
        messages: [{ type: "text", text: messageText }],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[Notify] LINE push error:", err);
    return false;
  }
}

/** メール通知（Resend API など） */
async function notifyEmail(payload: ReviewNotificationPayload): Promise<boolean> {
  const toEmail = process.env.NOTIFY_EMAIL_TO;
  const apiKey = process.env.RESEND_API_KEY;

  if (!toEmail || !apiKey) {
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "森からのおくりもの <onboarding@resend.dev>",
        to: [toEmail],
        subject: `【森からのおくりもの】新しい口コミ：${payload.nickname}様`,
        text: `お名前: ${payload.nickname}\n写真: ${payload.hasPhoto ? "あり" : "なし"}\n\n${payload.comment}`,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[Notify] Email error:", err);
    return false;
  }
}

/** 口コミ投稿時に非同期で管理者へ通知を送信 */
export async function notifyNewReview(payload: ReviewNotificationPayload): Promise<void> {
  console.log(`[Notification] 新しい口コミを受信: ${payload.nickname}様 "${payload.comment}"`);

  // LINE 通知とメール通知を並行実行（片方または両方が未設定でもエラーを起こさない）
  const [lineSent, emailSent] = await Promise.all([
    notifyLine(payload),
    notifyEmail(payload),
  ]);

  if (!lineSent && !emailSent) {
    console.log(
      "[Notification] LINE / メール通知は環境変数が未設定のためスキップされました（開発モード正常動作）。"
    );
  } else {
    console.log(`[Notification] 通知結果: LINE=${lineSent ? "成功" : "スキップ/失敗"}, Email=${emailSent ? "成功" : "スキップ/失敗"}`);
  }
}
