import { connectDB } from "@/@lib/api/db";
import { getStringField } from "@/app/utils/getStringField";
import { getAll, create } from "@/services/video.service";

// CONTENT PAGE in Public & ADMIN CONTENT TABLE route
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || "0"; // "0" | "1" | ...
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || ""; // Search query
  const selectedOnly = searchParams.get("selectedOnly") === "true";

  // categoryIds=1,2,3  (və ya categoryIds=1&categoryIds=2)
  const categoryIds = searchParams
    .getAll("categoryIds")
    .map(Number)
    .filter(Number.isFinite);

  const result = await getAll({
    selectedOnly,
    type: type !== null ? parseInt(type) : undefined,
    categoryIds: categoryIds.length ? categoryIds : undefined,
    limit,
    page,
    search: search || undefined,
  });

  return Response.json({ success: true, ...result });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const contentType = req.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      payload = {
        Title: formData.get("Title"),
        Thumb_img: formData.get("Thumb_img"), // File object
        Selected_Thumb_img: formData.get("Selected_Thumb_img"),
        Link: formData.get("Link"),
        NonEmbedLink: formData.get("NonEmbedLink"),
        Type: parseInt(getStringField(formData, "Type", "0")),
        CategoryIds: JSON.parse(getStringField(formData, "CategoryIds", "[]")),
      };
    } else {
      payload = await req.json();
    }

    const data = await create(payload);
    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
