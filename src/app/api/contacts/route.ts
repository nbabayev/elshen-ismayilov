import { connectDB } from "@/@lib/api/db";
import contactService from "@/services/contact.service";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const email = searchParams.get("email");

    if (email) {
      const thread = await contactService.getThread(email);
      if (!thread.success) {
        return Response.json(thread, { status: 400 });
      }
      return Response.json({ success: true, data: thread.data });
    }

    const conversations = await contactService.getConversations(search);
    return Response.json({ success: true, data: conversations });
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

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const result = await contactService.create({
      name: String(body.name ?? ""),
      lastName: String(body.lastName ?? body.lastname ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      message: String(body.message ?? ""),
    });

    return Response.json(result, { status: result.success ? 201 : 400 });
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
