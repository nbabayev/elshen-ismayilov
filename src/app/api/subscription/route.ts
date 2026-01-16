import { connectDB } from "@/@lib/api/db";
import subscriptionService from "@/services/subscription.service";
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
