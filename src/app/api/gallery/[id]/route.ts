// app/api/gallery/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import galleryService from "@/services/gallery.service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const gallery = await galleryService.getGalleryById(parseInt(params.id));

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const gallery = await galleryService.updateGallery(
      parseInt(params.id),
      body
    );

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const result = await galleryService.deleteGallery(parseInt(params.id));

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
