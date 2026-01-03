import { Op } from "sequelize";
import { Video, Category, VideoCategory, SelectedVideos } from "@/models";
import { uploadImage } from "@/@lib/api/cloudinary";

export async function getAll({ type, categoryIds, limit, page }) {
  const where = { isDeleted: 0 };
  if (type !== undefined) where.Type = Number(type);

  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;

  const options = {
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
    order: [["CreatedDate", "DESC"]],
  };

  if (categoryIds?.length) {
    options.include = [
      {
        model: Category,
        as: "categories",
        where: { Id: categoryIds, isDeleted: 0 },
        through: { where: { isDeleted: 0 } },
        required: true,
      },
    ];
  }

  const total = await Video.count({
    where,
  });

  const data = await Video.findAll(options);
  return { data, total };
}

export function getById(id) {
  return Video.findOne({
    where: { Id: id, isDeleted: 0 },
    include: [
      {
        model: Category,
        as: "categories",
        through: { where: { isDeleted: 0 } },
      },
    ],
  });
}

export async function create(payload) {
  const video = await Video.create({
    Title: payload.Title,
    Thumb_img: payload.Thumb_img,
    Selected_Thumb_img: payload.Selected_Thumb_img ?? null,
    Link: payload.Link,
    NonEmbedLink: payload.NonEmbedLink ?? null,
    Type: payload.Type ?? 0,
    isDeleted: 0,
  });

  if (payload.CategoryIds?.length) {
    await VideoCategory.bulkCreate(
      payload.CategoryIds.map((cid) => ({
        ModelId: video.Id,
        CategoryId: cid,
      }))
    );
  }

  return getById(video.Id);
}

export async function update(id, payload) {
  let thumbUrl = payload.Thumb_img;
  let selectedThumbUrl = payload.Selected_Thumb_img;

  if (payload.Thumb_img instanceof File) {
    thumbUrl = await uploadImage(payload.Thumb_img);
  }

  if (payload.Selected_Thumb_img instanceof File) {
    selectedThumbUrl = await uploadImage(payload.Selected_Thumb_img);
  }

  await Video.update(
    {
      Thumb_img: thumbUrl,
      Title: payload.Title,
      Selected_Thumb_img: payload.Selected_Thumb_img ?? null,
      Link: payload.Link,
      NonEmbedLink: payload.NonEmbedLink ?? null,
      Type: payload.Type,
    },
    { where: { Id: id } }
  );

  if (payload.CategoryIds) {
    await VideoCategory.destroy({ where: { ModelId: id } });
    await VideoCategory.bulkCreate(
      payload.CategoryIds.map((cid) => ({
        ModelId: id,
        CategoryId: cid,
      }))
    );
  }

  return getById(id);
}

export async function remove(id) {
  await Video.update({ isDeleted: 1 }, { where: { Id: id } });
  await VideoCategory.update({ isDeleted: 1 }, { where: { ModelId: id } });
  return { ok: true };
}

export async function attachCategory(id, categoryId) {
  return VideoCategory.create({
    ModelId: id,
    CategoryId: categoryId,
  });
}

export async function detachCategory(id, categoryId) {
  return VideoCategory.destroy({
    where: { ModelId: id, CategoryId: categoryId },
  });
}

// export async function getSelectedVideos(limit, offset) {
//   return SelectedVideos.findAndCountAll({
//     where: { isDeleted: false },
//     include: [{ model: Video, as: "video", required: true }],
//     limit,
//     offset,
//     order: [["CreatedDate", "DESC"]],
//   });
// }
