import { connectDB } from "@/@lib/api/db";
import subscriptionService from "@/services/subscription.service";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
    const search = searchParams.get("search") || undefined;

    const result = await subscriptionService.getSubscribers({
      page,
      limit,
      search,
    });

    return Response.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const sub = await subscriptionService.subscribe(email);

    return Response.json(sub, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown Error" },
      { status: 500 }
    );
  }
}
