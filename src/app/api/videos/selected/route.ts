import { getSelectedVideos } from "@/services/video.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "10";
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type") || "0";

  try {
    // service çağır
    const result = await getSelectedVideos(
      parseInt(limit),
      (parseInt(page) - 1) * parseInt(limit), // offset
      parseInt(type)
    );

    return NextResponse.json({
      success: true,
      total: result.total,
      count: result.count,
      data: result.rows,
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
