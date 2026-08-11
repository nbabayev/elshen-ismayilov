import { Slider } from "@/models";
import { Op } from "sequelize";
import cloudinary from "@/@lib/api/cloudinary";

export async function getAll({
  limit,
  page,
  search,
}: {
  limit?: number;
  page?: number;
  search?: string;
}) {
  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;

  const where: any = { isDeleted: false };

  if (search) {
    where.Title = { [Op.like]: `%${search}%` };
  }

  const { count, rows } = await Slider.findAndCountAll({
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
    order: [["CreatedDate", "DESC"]],
  });

  return rows;
}

export async function getById(id: number) {
  return Slider.findOne({
    where: { Id: id, isDeleted: false },
  });
}

export async function createSlide(payload: any) {
  return Slider.create({
    ...payload,
    CreatedDate: new Date(),
  });
}

export async function updateSlide(id: number, payload: any) {
  payload.LastUpdate = new Date();
  await Slider.update(payload, { where: { Id: id } });
  return Slider.findByPk(id);
}

export async function removeSlide(id: number) {
  const slide = await Slider.findByPk(id);
  if (!slide) return null;

  if (slide.Image) {
    const publicId = slide.Image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`elshan_media/${publicId}`);
  }

  return Slider.update(
    { isDeleted: true, LastUpdate: new Date() },
    { where: { Id: id } }
  );
}
