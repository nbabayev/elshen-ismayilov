import { getById, updateSlide, removeSlide } from "@/services/slider.service";
import cloudinary, { uploadImage } from "@/@lib/api/cloudinary";

async function uploadToCloudinary(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
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

export async function GET(req, { params }) {
  try {
    let resolvedParams = await params;
    const data = await getById(resolvedParams.id);
    if (!data) {
      return Response.json({ error: "Slayd tapılmadı" }, { status: 404 });
    }
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    let resolvedParams = await params;
    const formData = await req.formData();
    const imageFile = formData.get("Image");
    const mobileFile = formData.get("MobileImage");

    const payload = {
      Title: formData.get("Title"),
      Link: formData.get("Link"),
      isVideo: formData.get("isVideo") === "true",
      isContent: formData.get("isContent") === "true",
      Signature: formData.get("Signature") === "true",
      isDeleted: false,
    };

    if (imageFile && imageFile.size > 0) {
      payload.Image = await uploadImage(imageFile);
    }

    if (mobileFile && mobileFile.size > 0) {
      payload.MobileImage = await uploadToCloudinary(mobileFile);
    }

    const updated = await updateSlide(resolvedParams.id, payload);

    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    let resolvedParams = await params;
    await removeSlide(resolvedParams.id);
    return Response.json({ message: "Slayd silindi" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
