import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_COOKIE_OPTIONS } from "@/@lib/auth/constants";
import { safeEqualString, verifyAdminPassword } from "@/@lib/auth/password";
import {
  checkLoginRateLimit,
  clearLoginRateLimit,
  getClientIp,
} from "@/@lib/auth/rate-limit";
import { createAdminSessionToken } from "@/@lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkLoginRateLimit(`login:${ip}`);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Çox sayda uğursuz cəhd. ${rate.retryAfterSeconds} saniyə sonra yenidən yoxlayın.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const email = body?.email?.toString().trim().toLowerCase() ?? "";
    const password = body?.password?.toString() ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email və şifrə tələb olunur." },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

    if (!adminEmail || !passwordHash) {
      console.error(
        "ADMIN_EMAIL və ADMIN_PASSWORD_HASH environment dəyişənləri təyin olunmalıdır"
      );
      return NextResponse.json(
        { success: false, message: "Server konfiqurasiya xətası." },
        { status: 500 }
      );
    }

    const emailOk = safeEqualString(email, adminEmail);
    const passwordOk = await verifyAdminPassword(password, passwordHash);

    if (!emailOk || !passwordOk) {
      return NextResponse.json(
        { success: false, message: "Yanlış email və ya şifrə." },
        { status: 401 }
      );
    }

    clearLoginRateLimit(`login:${ip}`);

    const token = await createAdminSessionToken(adminEmail);
    const response = NextResponse.json({
      success: true,
      message: "Giriş uğurludur.",
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      token,
      ADMIN_SESSION_COOKIE_OPTIONS
    );

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Giriş alınmadı." },
      { status: 500 }
    );
  }
}
