// app/api/gallery/[id]/videos/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import galleryService from "@/services/gallery.service";

// POST - Video əlavə et
// export async function POST(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await request.json();
//     const { videoUrl, title } = body;

//     if (!videoUrl) {
//       return NextResponse.json(
//         { success: false, error: "videoUrl tələb olunur" },
//         { status: 400 }
//       );
//     }

//     const video = await galleryService.createVideoGallery(body);

//     return NextResponse.json(
//       {
//         success: true,
//         data: video,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// DELETE - Video sil (videoId query parametr kimi)
export async function DELETE(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "videoId tələb olunur" },
        { status: 400 }
      );
    }

    const result = await galleryService.deleteVideo(parseInt(videoId));

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
