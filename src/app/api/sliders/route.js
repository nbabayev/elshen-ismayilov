import { getAll, createSlide } from "@/services/slider.service";
import cloudinary from "@/@lib/api/cloudinary";
import { connectDB } from "@/@lib/api/db";

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const result = await getAll(query);
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const uploadToCloudinary = async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "elshan_media" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });
    };

    const file = formData.get("file");
    const mobileFile = formData.get("MobileImage");

    const uploadedImage = file ? await uploadToCloudinary(file) : null;
    const uploadedMobileImage =
      mobileFile && mobileFile.size > 0
        ? await uploadToCloudinary(mobileFile)
        : null;

    const payload = {
      Title: formData.get("Title"),
      Image: uploadedImage,
      MobileImage: uploadedMobileImage,
      isVideo: formData.get("isVideo") === "true",
      isContent: formData.get("isContent") === "true",
      Signature: formData.get("Signature") === "true",
    };

    const slide = await createSlide(payload);

    return Response.json(slide, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
