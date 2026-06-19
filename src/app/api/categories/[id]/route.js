import {
  getById,
  removeCategory,
  updateCategory,
} from "@/services/category.service";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const data = await getById(id);
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

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const { id } = await params;
    // const updatedData = {
    //   Name: body.Name || body.name,
    //   ParentId: body.ParentId !== undefined ? body.ParentId : null,
    //   Type: body.Type || body.type,
    //   isHidden: body.isHidden !== undefined ? body.isHidden : 0,
    // };
    await updateCategory(id, body);

    // 2. Yenilənmədən dərhal sonra bazadan ƏN SON və təzə datanı yenidən çəkirik!
    const freshData = await getById(id);

    return Response.json({ success: true, freshData });
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const data = await removeCategory(id);

    return Response.json({ success: true, ...data });
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}
