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

    // const body = await req.json();

    const formData = await req.formData();

    const body = {
      Link: formData.get("Link") || null,
      Title: formData.get("Title"),
      ShortDescription: formData.get("ShortDescription"),
      ReadMinute: formData.get("ReadMinute")
        ? Number(formData.get("ReadMinute"))
        : 0,
      Content: formData.get("Content"),
      Thumb_img: formData.get("Thumb_img"),
      ViewDate: new Date(),
      Slug: formData.get("Title")?.toLowerCase().replace(/ /g, "-") || "",
    };

    const imageFile = formData.get("Image");
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );

      await writeFile(uploadPath, buffer);

      const imageFile = formData.get("Image");
      if (imageFile && imageFile.size > 0) {
        body.Image = await uploadImage(imageFile);
      }

      // body.Image = `/uploads/${fileName}`;
    }

    const article = await articleService.create(body);

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
