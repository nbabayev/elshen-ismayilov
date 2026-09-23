import { connectDB } from "@/@lib/api/db";
import subscriptionService from "@/services/subscription.service";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const subscriberId = Number(id);

    if (!Number.isInteger(subscriberId) || subscriberId <= 0) {
      return Response.json(
        { success: false, error: "Yanlış abunəçi ID-si" },
        { status: 400 }
      );
    }

    const result = await subscriptionService.deleteSubscriber(subscriberId);

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
