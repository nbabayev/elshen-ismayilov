import { connectDB } from "@/@lib/api/db";
import { requireAdmin } from "@/@lib/auth/require-admin";
import contactService from "@/services/contact.service";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const count = await contactService.getUnreadCount();
    return Response.json({ success: true, count });
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
