import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/@lib/auth/constants";

export type AdminSessionPayload = {
  role: "admin";
  email: string;
};

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET ən azı 32 simvoldan ibarət olmalıdır (openssl rand -base64 48)"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(
  email: string
): Promise<string> {
  return new SignJWT({
    role: "admin",
    email,
  } satisfies AdminSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .setSubject("admin")
    .sign(getAuthSecret());
}

export async function verifyAdminSessionToken(
  token: string
): Promise<(AdminSessionPayload & JWTPayload) | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }

    return payload as AdminSessionPayload & JWTPayload;
  } catch {
    return null;
  }
}

export function getSessionTokenFromCookieHeader(
  cookieHeader: string | null
): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq);
    if (name === ADMIN_SESSION_COOKIE) {
      return decodeURIComponent(part.slice(eq + 1));
    }
  }
  return null;
}
