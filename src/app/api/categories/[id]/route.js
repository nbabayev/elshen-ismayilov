import {
  getById,
  removeCategory,
  updateCategory,
} from "@/services/category.service";

export async function GET(req, { params }) {
  try {
    const data = await getById(params.id);
    if (!data)
      return Response.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );

    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const data = await updateCategory(params.id, body);

    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const data = await removeCategory(params.id);

    return Response.json({ success: true, ...data });
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}
