import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/@lib/auth/constants";
import { verifyAdminSessionToken } from "@/@lib/auth/session";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }

  const session = await verifyAdminSessionToken(token);
  if (!session) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    email: session.email,
  });
}
