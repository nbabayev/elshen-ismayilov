import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/@lib/api/db";
import * as articleService from "@/services/article.service";
import path from "path";
import { uploadImage } from "@/@lib/api/cloudinary";
export const maxDuration = 60;
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
    const body = await req.json();

    const article = await articleService.findBySlug(id);
    if (!article) {
      return NextResponse.json({ error: "Məqalə tapılmadı" }, { status: 404 });
    }

    const updatedArticle = await articleService.update(article.Id, body);
    revalidateTag("articles");
    return NextResponse.json(updatedArticle);
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
