// app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import galleryService from "@/services/gallery.service";

export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") as "image" | "video" | undefined;

    const result = await galleryService.getAllGalleries(page, limit, type);
    // console.log(NextResponse.json({ ...result }));
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

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();

    // Validate type
    if (!body.type || (body.type !== "image" && body.type !== "video")) {
      return NextResponse.json(
        { success: false, error: "Type 'image' və ya 'video' olmalıdır" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Başlıq tələb olunur" },
        { status: 400 }
      );
    }

    if (!body.thumbImg) {
      return NextResponse.json(
        { success: false, error: "Üz qabığı tələb olunur" },
        { status: 400 }
      );
    }

    if (!body.viewDate) {
      return NextResponse.json(
        { success: false, error: "Tarix tələb olunur" },
        { status: 400 }
      );
    }

    // Validate type-specific requirements
    if (body.type === "image") {
      if (
        !body.images ||
        !Array.isArray(body.images) ||
        body.images.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Ən azı bir şəkil əlavə olunmalıdır",
          },
          { status: 400 }
        );
      }
    }

    if (body.type === "video") {
      if (
        !body.videos ||
        !Array.isArray(body.videos) ||
        body.videos.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Ən azı bir video əlavə olunmalıdır",
          },
          { status: 400 }
        );
      }
    }

    // Create gallery based on type
    let data;
    if (body.type === "image") {
      data = await galleryService.createImageGallery({
        title: body.title,
        thumbImg: body.thumbImg,
        viewDate: body.viewDate,
        images: body.images,
      });
    } else {
      data = await galleryService.createVideoGallery({
        title: body.title,
        thumbImg: body.thumbImg,
        viewDate: body.viewDate,
        videos: body.videos,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gallery creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

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

//     const gallery = await galleryService.createGallery(body);

//     return NextResponse.json(
//       {
//         success: true,
//         data: gallery,
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
