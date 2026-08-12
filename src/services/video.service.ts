import { Op } from "sequelize";
import { Video, Category, VideoCategory, SelectedVideos } from "@/models";
import { uploadImage } from "@/@lib/api/cloudinary";
import {
  ContentProps,
  GetSelectedResult,
  SelectedVideoWithVideo,
  SelectVideos,
} from "@/app/types";

// Helper function to get all descendant category IDs
async function getAllDescendantCategoryIds(
  categoryIds: number[]
): Promise<number[]> {
  if (!categoryIds || categoryIds.length === 0) return [];

  const allIds = new Set(categoryIds);
  const toProcess = [...categoryIds];

  while (toProcess.length > 0) {
    const currentIds = toProcess.splice(0, 100); // Process in batches
    console.log(currentIds, "current");
    const children = await Category.findAll({
      where: {
        ParentId: { [Op.in]: currentIds },
        isDeleted: 0,
      },
      attributes: ["Id"],
      raw: true,
    });

    children.forEach((child: any) => {
      if (!allIds.has(child.Id)) {
        allIds.add(child.Id);
        toProcess.push(child.Id);
      }
    });
  }

  return Array.from(allIds);
}
// content page
export async function getAll({
  type,
  categoryIds,
  limit,
  page,
  search,
  selectedOnly,
}: ContentProps) {
  const where: any = { isDeleted: 0 };
  if (type !== undefined && type !== null) {
    where.Type = Number(type);
  }

  if (search && search.trim()) {
    where.Title = { [Op.like]: `%${search.trim()}%` };
  }

  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;

  let expandedCategoryIds = categoryIds;
  if (categoryIds && categoryIds.length > 0) {
    expandedCategoryIds = await getAllDescendantCategoryIds(categoryIds);
  }

  const options: any = {
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
    order: [["CreatedDate", "DESC"]],
  };
  const selected_options: any = {
    where,
    order: [["CreatedDate", "DESC"]],
  };
  const isUmumi =
    !expandedCategoryIds?.length || expandedCategoryIds.includes(9999);

  if (!isUmumi) {
    const includeConfig = {
      model: Category,
      as: "categories",
      where: { Id: { [Op.in]: expandedCategoryIds }, isDeleted: 0 },
      through: { where: { isDeleted: 0 } },
      required: true,
    };

    options.include = [includeConfig];
  }
  let videos = await Video.findAll(selectedOnly ? selected_options : options);
  let total = await Video.count({ ...options, distinct: true });

  const selectedVideos = await SelectedVideos.findAll({
    where: {
      isDeleted: false,
    },
    attributes: ["ObjectId"],
    raw: true,
  });

  const selectedIds = new Set(selectedVideos.map((s: any) => s.ObjectId));

  let results: (SelectVideos & { isSelected: boolean })[] = videos.map(
    (video: any) => ({
      ...(video.toJSON() as SelectVideos), // .toJSON() nəticənii SelectVideos-ə çevirir
      isSelected: selectedIds.has(video.Id),
    })
  );

  if (selectedOnly) {
    results = results.filter((v: any) => selectedIds.has(v.Id));
  }

  return { data: results, total };
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

interface Model {}
//for home
export async function getSelectedVideos(
  type?: number
): Promise<GetSelectedResult> {
  const whereCondition: any = { isDeleted: false };

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
    // limit,
    // offset,
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
    data: selectedVideos.rows.map((item: SelectedVideoWithVideo) => ({
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

// // for admin
// export async function getAllVideosWithSelection(
//   limit?: number,
//   offset?: number,
//   search: string = "",
//   selectedOnly: boolean = false,
//   type?: number
// ) {
//   console.log("selectedVideos", "selectedVideos");
//   const whereCondition: any = { isDeleted: false };
//   if (search) {
//     whereCondition.Title = { [Op.like]: `%${search}%` };
//   }

//   if (type !== undefined && type !== null) {
//     whereCondition.Type = type;
//   }

//   let pagination = { limit, offset };

//   // if (selectedOnly) {
//   //   pagination = { limit: undefined, offset: undefined };
//   // }
//   const videos = await Video.findAndCountAll({
//     where: whereCondition,
//     ...pagination, // ← offset 0
//     order: [["CreatedDate", "DESC"]],
//     raw: true,
//   });

//   const selectedVideos = await SelectedVideos.findAll({
//     where: {
//       isDeleted: false,
//       // ObjectId: { [Op.in]: videos.rows.map((v: any) => v.Id) },
//     },
//     attributes: ["ObjectId"],
//   });

//   const selectedIds = new Set(selectedVideos.map((s: any) => s.ObjectId));
//   let results = videos.rows.map((video: SelectVideos) => ({
//     ...video,
//     isSelected: selectedIds.has(video.Id),
//   }));

//   // Filter et

//   if (selectedOnly) {
//     results = results.filter((v: any) => selectedIds.has(v.Id));
//   }

//   return {
//     count: selectedOnly
//       ? videos.rows.filter((v: any) => selectedIds.has(v.Id)).length // ← Düzgün count
//       : videos.count,
//     data: results,
//   };
// }
