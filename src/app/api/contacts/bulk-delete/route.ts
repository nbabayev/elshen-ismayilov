import { connectDB } from "@/@lib/api/db";
import { requireAdmin } from "@/@lib/auth/require-admin";
import contactService from "@/services/contact.service";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const body = await req.json();
    const emails = Array.isArray(body.emails)
      ? body.emails.map((e: unknown) => String(e ?? ""))
      : [];

    const result = await contactService.softDeleteConversations(emails);
    return Response.json(result, { status: result.success ? 200 : 400 });
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}
