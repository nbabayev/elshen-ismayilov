import { connectDB } from "@/@lib/api/db";
import subscriptionService from "@/services/subscription.service";

export async function POST(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    let token = url.searchParams.get("token");

    if (!token && req.headers.get("content-type")?.includes("application/json")) {
      const body = await req.json();
      token = body.token;
    }

    if (!token) {
      return Response.json(
        { success: false, message: "Abunəlik tokeni tələb olunur" },
        { status: 400 }
      );
    }

    const result = await subscriptionService.unsubscribe(token);
    return Response.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Token yanlışdır",
      },
      { status: 400 }
    );
  }
}
