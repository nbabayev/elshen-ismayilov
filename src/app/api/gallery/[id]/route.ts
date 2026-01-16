// app/api/gallery/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import galleryService from "@/services/gallery.service";

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
    const body = await request.json();
    console.log(body);
    const gallery = await galleryService.updateGallery(parseInt(id), body);

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
