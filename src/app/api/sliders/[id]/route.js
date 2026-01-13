import { getById, updateSlide, removeSlide } from "@/services/slider.service";
import { uploadImage } from "@/@lib/api/cloudinary";

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

export async function PATCH(req, { params }) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("Image");

    const payload = {
      Title: formData.get("Title"),
      Subtitle: formData.get("Subtitle"),
      isVideo: formData.get("isVideo") === "true",
      isContent: formData.get("isContent") === "true",
      Signature: formData.get("Signature") === "true",
      isDeleted: false,
    };

    if (imageFile && imageFile.size > 0) {
      payload.Image = await uploadImage(imageFile);
    }

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
