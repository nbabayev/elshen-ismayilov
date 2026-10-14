import { connectDB } from "@/@lib/api/db";
import contactService from "@/services/contact.service";

export async function GET() {
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
