import { getAll, create } from "@/services/miniSlider.service";
import cloudinary from "@/@lib/api/cloudinary";
import { connectDB } from "@/@lib/api/db";

export async function GET(req) {
  try {
    await connectDB();
    const result = await getAll();
    return Response.json({ data: result });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const file = formData.get("ImageUrl");
    let uploadedImage = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "elshan_media" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });
    }

    const payload = {
      Title: formData.get("Title") || "",
      ImageUrl: uploadedImage,
      Link: formData.get("Link") || "",
      ListingNumber: parseInt(formData.get("ListingNumber")) || 0,
    };

    if (!payload.ImageUrl) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    const slide = await create(payload);
    return Response.json({ data: slide }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
