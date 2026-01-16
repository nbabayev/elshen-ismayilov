import { getById, update, remove } from "@/services/miniSlider.service";
import cloudinary from "@/@lib/api/cloudinary";
import { connectDB } from "@/@lib/api/db";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const result = await getById(id);

    if (!result) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ data: result });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await req.formData();

    const existing = await getById(id);
    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const file = formData.get("ImageUrl");
    let uploadedImage = existing.ImageUrl;

    if (file && file.size > 0) {
      // Delete old image from Cloudinary
      if (existing.ImageUrl) {
        try {
          const publicId = existing.ImageUrl.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`elshan_media/${publicId}`);
        } catch (e) {
          console.error("Cloudinary delete error:", e);
        }
      }

      // Upload new image
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
      Title: formData.get("Title") || existing.Title,
      ImageUrl: uploadedImage,
      Link: formData.get("Link") || existing.Link,
      ListingNumber: parseInt(formData.get("ListingNumber")) || existing.ListingNumber,
    };

    const updated = await update(id, payload);
    return Response.json({ data: updated });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const result = await remove(id);
    if (!result) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(result);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
