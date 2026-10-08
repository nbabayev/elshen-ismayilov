import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/@lib/api/db";
import * as bookService from "@/services/book.service";
import { uploadFile, uploadImage } from "@/@lib/api/cloudinary";

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as File).arrayBuffer === "function" &&
    (value as File).size > 0
  );
}

async function parseBookBody(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return req.json();
  }

  const formData = await req.formData();
  const imageFile = formData.get("Image");
  const pdfFile = formData.get("Pdf");

  const body: Record<string, unknown> = {
    Title: formData.get("Title"),
    Author: formData.get("Author"),
    Description: formData.get("Description"),
    SpotifyUrl: formData.get("SpotifyUrl"),
    Format: formData.get("Format"),
    Barcode: formData.get("Barcode"),
    PublishYear: formData.get("PublishYear"),
    Language: formData.get("Language"),
    Circulation: formData.get("Circulation"),
    Publisher: formData.get("Publisher"),
    PageCount: formData.get("PageCount"),
    CoverType: formData.get("CoverType"),
    Paper: formData.get("Paper"),
    Size: formData.get("Size"),
  };

  if (isUploadFile(imageFile)) {
    body.Image = await uploadImage(imageFile);
  } else if (formData.get("ImageUrl")) {
    body.Image = formData.get("ImageUrl");
  }

  if (isUploadFile(pdfFile)) {
    body.PdfUrl = await uploadFile(pdfFile, "books/pdf");
  } else if (formData.get("PdfUrl")) {
    body.PdfUrl = formData.get("PdfUrl");
  }

  return body;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const bySlug = await bookService.getBySlug(id);
    if (bySlug) return NextResponse.json(bySlug);

    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
      const byId = await bookService.getById(numericId);
      if (byId) return NextResponse.json(byId);
    }

    return NextResponse.json({ error: "Kitab tapılmadı" }, { status: 404 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await parseBookBody(req);
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Yanlış ID" }, { status: 400 });
    }
    const updated = await bookService.update(numericId, body);
    // Admin update: növbəti oxunuşda köhnə cache gözlədilməsin
    revalidateTag("books", { expire: 0 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Yanlış ID" }, { status: 400 });
    }
    await bookService.remove(numericId);
    revalidateTag("books", { expire: 0 });
    return NextResponse.json({ message: "Kitab silindi" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
