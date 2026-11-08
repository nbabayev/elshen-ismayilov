import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import { requireAdmin } from "@/@lib/auth/require-admin";
import { toggleArticleVisibility } from "@/services/article.service";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    await connectDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Məqalə ID tələb olunur" },
        { status: 400 }
      );
    }

    const result = await toggleArticleVisibility(Number(id));
    revalidateTag("articles", "max");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Görünürlük yenilənmədi",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
