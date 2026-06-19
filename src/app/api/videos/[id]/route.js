import { connectDB } from "@/@lib/api/db";
import { getById, update, remove } from "@/services/video.service";

export async function GET(req, { params }) {
  await connectDB();
  const data = await getById(params.id);

  if (!data) {
    return Response.json(
      { success: false, message: "Not found" },
      { status: 404 }
    );
  }

  return Response.json({ success: true, data });
}

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = await params;
  const formData = await req.formData();

  const payload = {
    Title: formData.get("Title"),
    Thumb_img: formData.get("Thumb_img"), // File object
    Selected_Thumb_img: formData.get("Selected_Thumb_img"),
    Link: formData.get("Link"),
    NonEmbedLink: formData.get("NonEmbedLink"),
    Type: parseInt(formData.get("Type")),
    CategoryIds: JSON.parse(formData.get("CategoryIds") || "[]"),
  };
  const data = await update(id, payload);
  return Response.json({ success: true, data });
}

export async function DELETE(req, { params }) {
  await connectDB();
  await remove(params.id);
  return Response.json({ success: true });
}
