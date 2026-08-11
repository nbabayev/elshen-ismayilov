// app/api/articles/toggle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import { toggleArticleSelection } from "@/services/article.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { message: "Məqalə ID tələb olunur" },
        { status: 400 }
      );
    }

    const result = await toggleArticleSelection(articleId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Toggle xətası:", error);
    return NextResponse.json(
      {
        message: "Xəta baş verdi",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
