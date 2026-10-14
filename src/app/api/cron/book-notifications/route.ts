import { connectDB } from "@/@lib/api/db";
import bookNotificationService from "@/services/bookNotification.service";

export const maxDuration = 60;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const result = await bookNotificationService.processPendingNotifications();

    return Response.json({ success: true, ...result });
  } catch (error) {
    console.error("Book notification cron failed:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
