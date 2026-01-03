import { getById, updateSlide, removeSlide } from "@/services/SliderService";
import { v2 as cloudinary } from "cloudinary";

export async function GET(req, { params }) {
  try {
    const data = await getById(params.id);
    if (!data) {
      return Response.json({ error: "Slayd tapılmadı" }, { status: 404 });
    }
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    let uploadedImage = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "elshan_media",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });
    }

    const payload = {
      Title: formData.get("Title"),
      Subtitle: formData.get("Subtitle"),
      ButtonText: formData.get("ButtonText"),
      ButtonLink: formData.get("ButtonLink"),
      ...(uploadedImage && { Image: uploadedImage }),
      isVideo: formData.get("isVideo") === "true",
      isContent: formData.get("isContent") === "true",
      Signature: formData.get("Signature") === "true",
      isDeleted: false,
    };

    const updated = await updateSlide(params.id, payload);

    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await removeSlide(params.id);
    return Response.json({ message: "Slayd silindi" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
