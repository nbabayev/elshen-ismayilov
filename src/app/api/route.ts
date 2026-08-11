import { connectDB } from "@/@lib/api/db";
import { getAll, create } from "@/services/video.service";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const type = parseInt(searchParams.get("type") || "0"); // "0" | "1" | ...
  const limit = parseInt(searchParams.get("limit") || "9"); // "10"
  const page = parseInt(searchParams.get("page") || "1"); // "1"
  const search = searchParams.get("search") || ""; // Search query

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
    type: type !== null ? type : undefined,
    categoryIds: categoryIds.length ? categoryIds : undefined,
    limit,
    page,
    search: search ?? undefined,
  });

  return Response.json({ success: true, ...result });
}
