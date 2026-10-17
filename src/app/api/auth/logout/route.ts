import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/@lib/auth/constants";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Çıxış edildi.",
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
