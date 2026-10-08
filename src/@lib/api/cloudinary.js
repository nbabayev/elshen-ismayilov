import { v2 as cloudinary } from "cloudinary";

// Configure on module load
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else resolve(result.secure_url);
      })
      .end(buffer);
  });
};

/** PDF və digər fayllar üçün (resource_type: auto) */
export const uploadFile = async (file, folder = "books") => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary file upload error:", error);
            reject(error);
          } else resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};

export default cloudinary;
