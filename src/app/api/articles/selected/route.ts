import { getSelectedArticles } from "@/services/article.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const result = await getSelectedArticles();
    return NextResponse.json({
      success: true,
      total: result.total,
      count: result.count,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Xəta baş verdi",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
