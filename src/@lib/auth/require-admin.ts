import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/@lib/auth/constants";
import {
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from "@/@lib/auth/session";

export type RequireAdminResult =
  | { ok: true; session: AdminSessionPayload }
  | { ok: false; response: Response };

/**
 * Route handler-lərdə admin session yoxlaması.
 * Cookie yoxdursa / etibarsızdırsa 401 qaytarır.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return {
      ok: false,
      response: Response.json(
        { success: false, message: "İcazə yoxdur" },
        { status: 401 }
      ),
    };
  }

  const session = await verifyAdminSessionToken(token);
  if (!session) {
    return {
      ok: false,
      response: Response.json(
        { success: false, message: "Sessiya bitib və ya etibarsızdır" },
        { status: 401 }
      ),
    };
  }

  return {
    ok: true,
    session: { role: "admin", email: session.email },
  };
}
