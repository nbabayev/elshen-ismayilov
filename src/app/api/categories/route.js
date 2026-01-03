// src/app/api/categories/route.js
import { connectDB } from "@/@lib/api/db";
import { getTree, createCategory } from "@/services/category.service";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const typeRaw = searchParams.get("type");

    const type =
      typeRaw !== null && !Number.isNaN(Number(typeRaw))
        ? Number(typeRaw)
        : undefined;

    const data = await getTree(type);

    return Response.json({ success: true, data });
  } catch (e) {
    console.error("GET /api/categories error:", e);
    return Response.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const data = await createCategory(body);

    return Response.json({ success: true, data }, { status: 201 });
  } catch (e) {
    console.error("POST /api/categories error:", e);
    return Response.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}
