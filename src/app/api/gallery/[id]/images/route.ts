// app/api/gallery/[id]/images/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import galleryService from "@/services/gallery.service";

// POST - Şəkil əlavə et
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { title, thumbImg, viewDate } = body;
//     console.log(body);

//     if (!title || !thumbImg || !viewDate) {
//       return NextResponse.json(
//         { success: false, error: "Title, thumbImg və viewDate tələb olunur" },
//         { status: 400 }
//       );
//     }

//     const imageGallery = await galleryService.createImageGallery(body);

//     return NextResponse.json(
//       {
//         success: true,
//         data: imageGallery,
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

// DELETE - Şəkil sil (imageId query parametr kimi)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "imageId tələb olunur" },
        { status: 400 }
      );
    }

    const result = await galleryService.deleteImage(parseInt(imageId));

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
