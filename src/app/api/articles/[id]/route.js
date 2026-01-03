import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import * as articleService from "@/services/article.service";
import path from "path";
import { uploadImage } from "@/@lib/api/cloudinary";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const article = await articleService.getById(id);
    if (!article) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // const body = await req.json();

    const formData = await req.formData();

    // Body məlumatlarını çıxart
    const body = {
      Link: formData.get("Link") || null,
      Title: formData.get("Title"),
      ShortDescription: formData.get("ShortDescription"),
      ReadMinute: formData.get("ReadMinute")
        ? Number(formData.get("ReadMinute"))
        : 0,
      Content: formData.get("Content"),
      Thumb_img: formData.get("Thumb_img"),
    };

    const imageFile = formData.get("Image");
    if (imageFile && imageFile.size > 0) {
      // Fayl adı yarat
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Unikal fayl adı
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );

      // Faylı saxla
      // await writeFile(uploadPath, buffer);

      if (imageFile && imageFile.size > 0) {
        body.Image = await uploadImage(imageFile);
      }
    }

    const article = await articleService.update(id, body);

    return NextResponse.json(article);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await articleService.remove(id);
    return NextResponse.json({ message: "Məqalə silindi" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
