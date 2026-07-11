// app/api/gallery/[id]/route.ts
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  let { id } = await params;
  try {
    const gallery = await galleryService.getGalleryById(parseInt(id));
    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Qalereya tapılmadı" ? 404 : 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const rawImages = formData.getAll("images");
      body = {
        title: parseFormDataValue(formData.get("title")),
        thumbImg: formData.get("thumbImg"),
        viewDate: parseFormDataValue(formData.get("viewDate")),
        images: rawImages,
        videos: parseVideosField(formData.get("videos")),
      };
    } else {
      body = await request.json();
    }

    const payload: any = {};
    if (body.title !== undefined) payload.title = body.title;
    if (body.viewDate !== undefined) payload.viewDate = body.viewDate;
    if (body.thumbImg !== undefined) {
      if (body.thumbImg instanceof File) {
        payload.thumbImg = await uploadImage(body.thumbImg);
      } else {
        payload.thumbImg = body.thumbImg;
      }
    }

    if (Array.isArray(body.images)) {
      payload.images = await Promise.all(
        body.images.map(async (image: any) => {
          if (image instanceof File) {
            return await uploadImage(image);
          }
          return image?.toString?.();
        })
      );
    }

    if (Array.isArray(body.videos)) {
      payload.videos = body.videos;
    }

    const gallery = await galleryService.updateGallery(parseInt(id), payload);

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  try {
    const result = await galleryService.deleteGallery(parseInt(id));

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
