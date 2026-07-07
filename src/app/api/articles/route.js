import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import * as articleService from "@/services/article.service";
import { uploadImage } from "@/@lib/api/cloudinary";
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const categoryIdsRaw = searchParams.getAll("categoryIds");
    if (categoryIdsRaw.length) {
      const categoryIds = categoryIdsRaw
        .flatMap((value) => {
          if (!value) return [];
          const trimmed = value.trim();
          try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed)
              ? parsed.map((item) => Number(item))
              : [Number(parsed)];
          } catch {
            if (trimmed.includes(",")) {
              return trimmed.split(",").map((item) => Number(item.trim()));
            }
            return [Number(trimmed)];
          }
        })
        .filter((id) => Number.isFinite(id));

      if (categoryIds.length) {
        query.categoryIds = categoryIds;
      } else {
        delete query.categoryIds;
      }
    }

    const result = await articleService.getAll(query);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";
    let body;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const imageFile = formData.get("Image");
      let imageUrl = "";

      if (
        imageFile &&
        typeof imageFile === "object" &&
        typeof imageFile.arrayBuffer === "function"
      ) {
        imageUrl = await uploadImage(imageFile);
      }

      body = {
        Title: formData.get("Title"),
        ShortDescription: formData.get("ShortDescription"),
        Content: formData.get("Content"),
        Image: imageUrl,
        ViewDate: formData.get("ViewDate"),
        ReadMinute: formData.get("ReadMinute"),
        NotifyUsers:
          formData.get("NotifyUsers") === "true" ||
          formData.get("NotifyUsers") === "on",
      };
    } else {
      body = await req.json();
    }

    const payload = {
      ...body,
      Slug: body?.Title?.toLowerCase().replace(/ /g, "-") || "",
    };

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
