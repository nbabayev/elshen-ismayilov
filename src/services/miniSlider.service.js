import { MiniSlider } from "@/models";
import cloudinary from "@/@lib/api/cloudinary";

export async function getAll() {
  return MiniSlider.findAll({
    where: { isDeleted: false },
    order: [["ListingNumber", "ASC"]],
  });
}

export async function getById(id) {
  return MiniSlider.findOne({
    where: { Id: id, isDeleted: false },
  });
}

export async function create(payload) {
  return MiniSlider.create({
    ...payload,
    CreatedDate: new Date(),
  });
}

export async function update(id, payload) {
  payload.LastUpdate = new Date();
  await MiniSlider.update(payload, { where: { Id: id } });
  return MiniSlider.findByPk(id);
}

export async function remove(id) {
  const item = await MiniSlider.findByPk(id);
  if (!item) return null;

  // Delete image from Cloudinary
  if (item.ImageUrl) {
    try {
      const publicId = item.ImageUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`elshan_media/${publicId}`);
    } catch (e) {
      console.error("Cloudinary delete error:", e);
    }
  }

  await MiniSlider.update(
    { isDeleted: true, LastUpdate: new Date() },
    { where: { Id: id } }
  );

  return { message: "MiniSlider silindi" };
}
