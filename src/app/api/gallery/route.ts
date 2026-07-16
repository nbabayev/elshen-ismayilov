// app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import galleryService from "@/services/gallery.service";
import { uploadImage } from "@/@lib/api/cloudinary";

function parseFormDataValue(value: FormDataEntryValue | null) {
  if (value instanceof File) return value;
  return value?.toString?.();
}

function parseVideosField(value: FormDataEntryValue | null) {
  if (!value) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") as "image" | "video" | undefined;

    const result = await galleryService.getAllGalleries(page, limit, type);
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
    const contentType = request.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      console.log(formData, "formdata");
      const rawImages = formData.getAll("images");
      body = {
        type: parseFormDataValue(formData.get("type")),
        title: parseFormDataValue(formData.get("title")),
        thumbImg: formData.get("thumbImg"),
        viewDate: parseFormDataValue(formData.get("viewDate")),
        images: rawImages,
        videos: parseVideosField(formData.get("videos")),
      };
    } else {
      body = await request.json();
    }

    if (!body.type || (body.type !== "image" && body.type !== "video")) {
      return NextResponse.json(
        { success: false, error: "Type 'image' və ya 'video' olmalıdır" },
        { status: 400 }
      );
    }

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

    let thumbImgUrl = body.thumbImg;
    if (body.thumbImg instanceof File) {
      thumbImgUrl = await uploadImage(body.thumbImg);
    }

    let imageUrls: string[] = [];
    if (body.type === "image") {
      imageUrls = await Promise.all(
        body.images.map(async (image: any) => {
          if (image instanceof File) {
            return await uploadImage(image);
          }
          return image?.toString?.();
        })
      );
    }

    let data;
    if (body.type === "image") {
      data = await galleryService.createImageGallery({
        type: body.type,
        title: body.title,
        thumbImg: thumbImgUrl,
        viewDate: body.viewDate,
        images: imageUrls,
      });
    } else {
      data = await galleryService.createVideoGallery({
        type: body.type,
        title: body.title,
        thumbImg: thumbImgUrl,
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
