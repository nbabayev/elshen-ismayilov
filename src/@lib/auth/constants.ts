export const ADMIN_SESSION_COOKIE = "admin_session";

/** Session ömrü: 8 saat */
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
};
