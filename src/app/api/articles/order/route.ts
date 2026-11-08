import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import { requireAdmin } from "@/@lib/auth/require-admin";
import { moveArticle } from "@/services/article.service";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    await connectDB();
    const { id, direction } = await request.json();

    if (!id || (direction !== "up" && direction !== "down")) {
      return NextResponse.json({ message: "Yanlış sorğu" }, { status: 400 });
    }

    const result = await moveArticle(Number(id), direction);
    revalidateTag("articles", "max");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Sıra yenilənmədi",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
