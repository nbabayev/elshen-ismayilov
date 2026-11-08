import { connectDB } from "@/@lib/api/db";
import { requireAdmin } from "@/@lib/auth/require-admin";
import contactService from "@/services/contact.service";

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const body = await req.json();
    const email = String(body.email ?? "");

    if (!email.trim()) {
      return Response.json(
        { success: false, message: "Email tələb olunur" },
        { status: 400 }
      );
    }

    const result = await contactService.markThreadRead(email);
    return Response.json(result);
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
