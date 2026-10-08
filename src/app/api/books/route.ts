import { NextResponse } from "next/server";
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

  let imageUrl = String(formData.get("ImageUrl") || "");
  let pdfUrl = String(formData.get("PdfUrl") || "");

  if (isUploadFile(imageFile)) {
    imageUrl = await uploadImage(imageFile);
  }

  if (isUploadFile(pdfFile)) {
    pdfUrl = await uploadFile(pdfFile, "books/pdf");
  }

  return {
    Title: formData.get("Title"),
    Author: formData.get("Author"),
    Description: formData.get("Description"),
    Image: imageUrl,
    PdfUrl: pdfUrl,
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
    NotifyUsers:
      formData.get("NotifyUsers") === "true" ||
      formData.get("NotifyUsers") === "on",
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const result = await bookService.getAll({ page, limit });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await parseBookBody(req);
    const { NotifyUsers: _notifyUsers, ...bookBody } = body;

    const book = await bookService.create({
      ...bookBody,
      Slug: bookBody?.Slug || bookService.slugifyTitle(bookBody?.Title || ""),
    });

    return NextResponse.json(
      {
        ...book,
        notificationQueued: false,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
