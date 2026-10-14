import { connectDB } from "@/@lib/api/db";
import contactService from "@/services/contact.service";

export async function PUT(req: Request) {
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
