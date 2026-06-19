import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body?.email?.toString().trim();
  const password = body?.password?.toString().trim();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email və şifrə tələb olunur." },
      { status: 400 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json(
      { message: "Yanlış email və ya şifrə." },
      { status: 401 }
    );
  }

  const token = process.env.ADMIN_TOKEN || "admin-token";

  return NextResponse.json({
    success: true,
    token,
    message: "Giriş uğurludur.",
  });
}
