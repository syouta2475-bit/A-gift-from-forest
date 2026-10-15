import { NextResponse } from "next/server";
import { createAdminToken, getAdminCookieOptions, getAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const expected = getAdminPassword();
    if (!password || password !== expected) {
      return NextResponse.json(
        { error: "パスワードが正しくありません。" },
        { status: 401 }
      );
    }

    const token = await createAdminToken();
    const cookieOpts = getAdminCookieOptions();

    const response = NextResponse.json({ success: true, message: "ログインに成功しました。" });
    response.cookies.set(cookieOpts.name, token, cookieOpts);

    return response;
  } catch (err) {
    console.error("[Login API error]", err);
    return NextResponse.json({ error: "ログイン処理中にエラーが発生しました。" }, { status: 500 });
  }
}
