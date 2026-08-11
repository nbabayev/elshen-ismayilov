import { connectDB } from "@/@lib/api/db";
import { getAll, create } from "@/services/video.service";

// CONTENT PAGE in Publix & ADMIN CONTENT TABLE route
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type"); // "0" | "1" | ...
  const limit = searchParams.get("limit"); // "10"
  const page = searchParams.get("page"); // "1"
  const search = searchParams.get("search") || ""; // Search query
  const selectedOnly = searchParams.get("selectedOnly") || ""; // Search query

  // categoryIds=1,2,3  (və ya categoryIds=1&categoryIds=2)
  const categoryIds = [
    ...searchParams
      .getAll("categoryIds")
      .flatMap((v) => v.split(","))
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter(Number.isFinite),
  ]
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n));

  const result = await getAll({
    selectedOnly,
    type: type !== null ? type : undefined,
    categoryIds: categoryIds.length ? categoryIds : undefined,
    limit,
    page,
    search: search || undefined,
  });

  return Response.json({ success: true, ...result });
}

export async function POST(req) {
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
        Type: parseInt(formData.get("Type") || "0"),
        CategoryIds: JSON.parse(formData.get("CategoryIds") || "[]"),
      };
    } else {
      payload = await req.json();
    }

    const data = await create(payload);
    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
