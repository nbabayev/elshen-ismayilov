import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import * as articleService from "@/services/article.service";
import { uploadImage } from "@/@lib/api/cloudinary";
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await articleService.getAll(query);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const payload = {
      ...body,
      Slug: body?.Title?.toLowerCase().replace(/ /g, "-") || "",
    };

    console.log(payload);

    const article = await articleService.create(payload);

    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// export async function OPTIONS(req) {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "http://localhost:3001",
//       "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     },
//   });
// }
