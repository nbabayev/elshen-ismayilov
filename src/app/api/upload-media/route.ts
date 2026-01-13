import { uploadImage } from "@/@lib/api/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("Image") as File | null;
    let url = "";
    if (!imageFile) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }
    if (imageFile && imageFile.size > 0) {
      url = await uploadImage(imageFile);
    }

    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
