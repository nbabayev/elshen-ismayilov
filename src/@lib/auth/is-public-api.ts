/**
 * Public (auth tələb etməyən) API qaydaları.
 * Middleware bu siyahıya uyğun olmayan /api sorğularını admin session ilə qoruyur.
 */

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function isPublicApiRequest(method: string, pathname: string): boolean {
  const path = normalizePath(pathname);
  const m = method.toUpperCase();

  // Auth endpoints
  if (path === "/api/auth/login" && m === "POST") return true;
  if (path === "/api/auth/logout" && m === "POST") return true;
  if (path === "/api/auth/me" && m === "GET") return true;

  // Cron — öz route-larında CRON_SECRET yoxlanır
  if (path.startsWith("/api/cron/")) return true;

  // Public write endpoints
  if (path === "/api/subscription" && m === "POST") return true;
  if (path === "/api/subscription/verify" && m === "POST") return true;
  if (path === "/api/subscription/unsubscribe" && m === "POST") return true;
  if (path === "/api/contacts" && m === "POST") return true;
  if (path.startsWith("/api/articles/view/") && m === "POST") return true;

  // Public reads
  if (m === "GET") {
    const publicGetPrefixes = [
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

    // Admin-only GET-lər (contacts, subscription list)
    if (path === "/api/contacts" || path.startsWith("/api/contacts/")) {
      return false;
    }
    if (path === "/api/subscription" || path.startsWith("/api/subscription/")) {
      // verify/unsubscribe artıq yuxarıda POST kimi icazə verilib
      return false;
    }

    return publicGetPrefixes.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`)
    );
  }

  return false;
}
