import { connectDB } from "@/@lib/api/db";
import { requireAdmin } from "@/@lib/auth/require-admin";
import contactService from "@/services/contact.service";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const { id } = await params;
    const contactId = Number(id);

    if (!Number.isInteger(contactId) || contactId <= 0) {
      return Response.json(
        { success: false, error: "Yanlış mesaj ID-si" },
        { status: 400 }
      );
    }

    const result = await contactService.softDelete(contactId);
    return Response.json(result, { status: result.success ? 200 : 404 });
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
