import { moveCategory } from "@/services/category.service";

export async function POST(req) {
  try {
    const body = await req.json();

    const id = body.id;
    const parentId = body.parent_id ?? null;

    const data = await moveCategory(id, parentId);

    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}
