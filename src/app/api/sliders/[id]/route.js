import { getById, updateSlide, removeSlide } from "@/services/slider.service";
import { uploadImage } from "@/@lib/api/cloudinary";

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
