import { connectDB } from "@/@lib/api/db";
import subscriptionService from "@/services/subscription.service";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token } = await req.json();

    if (typeof token !== "string" || !token) {
      return Response.json(
        { success: false, message: "Təsdiq tokeni tələb olunur" },
        { status: 400 }
      );
    }

    const result = await subscriptionService.verifyEmail(token);
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
