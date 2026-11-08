import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_SESSION_COOKIE = "admin_session";

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET ən azı 32 simvol olmalıdır");
  }
  return new TextEncoder().encode(secret);
}

async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

async function getAdminSession(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isPublicApi(method: string, pathname: string): boolean {
  const path = normalizePath(pathname);
  const m = method.toUpperCase();

  if (path === "/api/auth/login" && m === "POST") return true;
  if (path === "/api/auth/logout" && m === "POST") return true;
  if (path === "/api/auth/me" && m === "GET") return true;
  if (path.startsWith("/api/cron/")) return true;

  if (path === "/api/subscription" && m === "POST") return true;
  if (path === "/api/subscription/verify" && m === "POST") return true;
  if (path === "/api/subscription/unsubscribe" && m === "POST") return true;
  if (path === "/api/contacts" && m === "POST") return true;
  if (path.startsWith("/api/articles/view/") && m === "POST") return true;

  if (
    path === "/api/contacts" ||
    path.startsWith("/api/contacts/") ||
    path === "/api/subscription" ||
    (path.startsWith("/api/subscription/") &&
      path !== "/api/subscription/verify" &&
      path !== "/api/subscription/unsubscribe")
  ) {
    return false;
  }

  if (m === "GET") {
    const prefixes = [
      "/api/articles",
      "/api/videos",
      "/api/books",
      "/api/gallery",
      "/api/categories",
      "/api/sliders",
      "/api/mini-sliders",
      "/api/settings",
      "/api/search",
      "/api/about",
    ];
    return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
  }

  return false;
}

function applyCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("x-admin-auth", "1");
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return applyCors(new NextResponse(null, { status: 204 }));
  }

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    let session = null;
    try {
      session = await getAdminSession(req);
    } catch {
      session = null;
    }

    if (!isLogin && !session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLogin && session) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (isPublicApi(req.method, pathname)) {
      return applyCors(NextResponse.next());
    }

    let session = null;
    try {
      session = await getAdminSession(req);
    } catch {
      session = null;
    }

    if (!session) {
      return applyCors(
        NextResponse.json(
          { success: false, message: "İcazə yoxdur" },
          { status: 401 }
        )
      );
    }

    return applyCors(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
