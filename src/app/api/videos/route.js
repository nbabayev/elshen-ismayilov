import { connectDB } from "@/@lib/api/db";
import { getById, update, remove, getAll } from "@/services/video.service";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  console.log(searchParams, "search");

  const type = searchParams.get("type"); // "0" | "1" | ...
  const limit = searchParams.get("limit"); // "10"
  const page = searchParams.get("page"); // "1"

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
  });

  return Response.json({ success: true, ...result });
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const data = await update(params.id, body);
  return Response.json({ success: true, data });
}

export async function DELETE(req, { params }) {
  await connectDB();
  await remove(params.id);
  return Response.json({ success: true });
}
