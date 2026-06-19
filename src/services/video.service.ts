import { Op } from "sequelize";
import { Video, Category, VideoCategory, SelectedVideos } from "@/models";
import { uploadImage } from "@/@lib/api/cloudinary";
import { SelectedVideoWithVideo } from "@/services/videosWithSelected";

interface GetSelectedVideosResult {
  count: number;
  total: number;
  rows: any[];
}

interface GetAllParams {
  type?: number;
  categoryIds?: number[];
  limit?: number;
  page?: number;
  search?: string;
}
export async function getAll({
  type,
  categoryIds,
  limit,
  page,
  search,
}: GetAllParams) {
  const where: any = { isDeleted: 0 };

  if (type !== undefined && type !== null) {
    where.Type = Number(type);
  }

  if (search && search.trim()) {
    where.Title = { [Op.like]: `%${search.trim()}%` };
  }

  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;

  // Sənin dediyin tək options obyekti
  const options: any = {
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
    order: [["CreatedDate", "DESC"]],
  };

  const isUmumi = !categoryIds?.length || categoryIds.includes(9999);

  if (!isUmumi) {
    const includeConfig = {
      model: Category,
      as: "categories",
      where: { Id: categoryIds, isDeleted: 0 },
      through: { where: { isDeleted: 0 } },
      required: true,
    };

    options.include = [includeConfig];
  }

  // Sənin iddian: count üçün eyni options-a distinct: true atıb birbaşa sayırıq
  const total = await Video.count({
    ...options,
    distinct: true,
  });

  const data = await Video.findAll(options);

  return { data, total };
}
export function getById(id: number) {
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

export async function create(payload: any) {
  let thumbUrl = payload.Thumb_img;
  let selectedThumbUrl = payload.Selected_Thumb_img;

  // Handle file uploads if present
  if (payload.Thumb_img instanceof File) {
    thumbUrl = await uploadImage(payload.Thumb_img);
  }

  if (payload.Selected_Thumb_img instanceof File) {
    selectedThumbUrl = await uploadImage(payload.Selected_Thumb_img);
  }

  const video = await Video.create({
    Title: payload.Title,
    Thumb_img: thumbUrl,
    Selected_Thumb_img: selectedThumbUrl ?? null,
    Link: payload.Link,
    NonEmbedLink: payload.NonEmbedLink ?? null,
    Type: payload.Type ?? 0,
    isDeleted: 0,
  });

  if (payload.CategoryIds?.length) {
    await VideoCategory.bulkCreate(
      payload.CategoryIds.map((cid: number) => ({
        ModelId: video.Id,
        CategoryId: cid,
      }))
    );
  }

  return getById(video.Id);
}

export async function update(id: number, payload: any) {
  let thumbUrl = payload.Thumb_img;
  let selectedThumbUrl = payload.Selected_Thumb_img;

  // Handle file uploads if present
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
      Selected_Thumb_img: selectedThumbUrl ?? null,
      Link: payload.Link,
      NonEmbedLink: payload.NonEmbedLink ?? null,
      Type: payload.Type,
    },
    { where: { Id: id } }
  );

  if (payload.CategoryIds) {
    await VideoCategory.destroy({ where: { ModelId: id } });
    await VideoCategory.bulkCreate(
      payload.CategoryIds.map((cid: number) => ({
        ModelId: id,
        CategoryId: cid,
      }))
    );
  }

  return getById(id);
}

export async function remove(id: number) {
  await Video.update({ isDeleted: 1 }, { where: { Id: id } });
  await VideoCategory.update({ isDeleted: 1 }, { where: { ModelId: id } });
  return { ok: true };
}

export async function attachCategory(id: number, categoryId: number) {
  return VideoCategory.create({
    ModelId: id,
    CategoryId: categoryId,
  });
}

export async function detachCategory(id: number, categoryId: number) {
  return VideoCategory.destroy({
    where: { ModelId: id, CategoryId: categoryId },
  });
}

//for home
export async function getSelectedVideos(
  limit: number,
  offset: number,
  type?: number
): Promise<GetSelectedVideosResult> {
  const whereCondition: any = { isDeleted: false };

  // if (type !== undefined && type !== null) {
  //   whereCondition.Type = type;
  // }
  const videoWhere: any = {};

  if (type !== undefined && type !== null) {
    videoWhere.Type = type;
  }

  const selectedVideos = await SelectedVideos.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: Video,
        as: "video",
        required: true,
        attributes: [
          "Id",
          "Title",
          "Thumb_img",
          "Selected_Thumb_img",
          "Link",
          "NonEmbedLink",
          "Type",
          "CreatedDate",
        ],
        where: videoWhere,
      },
    ],
    limit,
    offset,
    order: [["CreatedDate", "DESC"]],
    distinct: true,
  });

  const total = await Video.count({
    where: {
      isDeleted: 0,
      Type: type,
    },
    distinct: true,
  });

  return {
    count: selectedVideos.count,
    total,
    rows: selectedVideos.rows.map((item: SelectedVideoWithVideo) => ({
      selectionId: item.Id,
      selectedDate: item.CreatedDate,
      video: {
        Id: item.video.Id,
        Title: item.video.Title,
        Thumb_img: item.video.Thumb_img,
        selectedThumbnail: item.video.Selected_Thumb_img,
        Link: item.video.Link,
        NonEmbedLink: item.video.NonEmbedLink,
        type: item.video.Type,
        CreatedDate: item.video.CreatedDate,
      },
    })),
  };
}

export async function toggleVideoSelection(videoId: number) {
  // 1. Yoxla: seçilibmi?
  const existing = await SelectedVideos.findOne({
    where: { ObjectId: videoId, isDeleted: false },
  });

  if (existing) {
    // 2. Var → Soft delete
    await existing.update({
      isDeleted: true,
      LastUpdate: new Date(),
    });

    return {
      success: true,
      message: "Video seçimdən çıxarıldı",
      action: "removed",
    };
  } else {
    // 3. Yox → Yarat və ya yenilə
    const deleted = await SelectedVideos.findOne({
      where: { ObjectId: videoId, isDeleted: true },
    });

    if (deleted) {
      // Əvvəl silinibsə, yenilə
      await deleted.update({
        isDeleted: false,
        LastUpdate: new Date(),
      });
    } else {
      // Heç olmayıbsa, yarat
      await SelectedVideos.create({
        ObjectId: videoId,
        isDeleted: false,
        CreatedDate: new Date(),
      });
    }

    return {
      success: true,
      message: "Video seçildi",
      action: "added",
    };
  }
}
