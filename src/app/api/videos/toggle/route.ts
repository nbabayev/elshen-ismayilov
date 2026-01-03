// app/api/videos/toggle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { toggleVideoSelection } from "@/services/videosWithSelected";

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { message: "Video ID tələb olunur" },
        { status: 400 }
      );
    }

    const result = await toggleVideoSelection(videoId);
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
