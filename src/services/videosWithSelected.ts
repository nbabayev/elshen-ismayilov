// app/api/videos/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { getAllVideosWithSelection } from "@/services/video.service";
//
import { SelectedVideos, Video } from "@/models";
import { Op } from "sequelize";
import { Model } from "sequelize";

interface GetSelectedVideosResult {
  count: number;
  rows: any[];
}

interface SelectedVideoAttributes {
  Id: number;
  ObjectId: number;
  isDeleted: boolean;
  CreatedDate: Date;
  LastUpdate: Date | null;
}

export interface SelectVideos {
  Id: number;
  Title: string;
  Thumb_img: string;
  Selected_Thumb_img: string | null;
  Link: string;
  NonEmbedLink: string | null;
  Type: number;
  CreatedDate: Date | null;
}

export interface SelectedVideoWithVideo extends Model<SelectedVideoAttributes> {
  Id: number;
  ObjectId: number;
  isDeleted: boolean;
  CreatedDate: Date;
  LastUpdate: Date | null;
  video: {
    Id: number;
    Title: string;
    Thumb_img: string;
    Selected_Thumb_img: string | null;
    Link: string;
    NonEmbedLink: string | null;
    Type: number;
    CreatedDate: Date | null;
  };
}
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const limit = parseInt(searchParams.get("limit") || "10");
//   const page = parseInt(searchParams.get("page") || "1");

//   const result = await getAllVideosWithSelection(limit, (page - 1) * limit);

//   return NextResponse.json({
//     success: true,
//     total: result.count,
//     videos: result.videos,
//   });
// }

// admin
export async function getAllVideosWithSelection(
  limit: number,
  offset: number,
  search: string = "",
  selectedOnly: boolean = false,
  type?: number
) {
  const whereCondition: any = { isDeleted: false };

  if (search) {
    whereCondition.Title = { [Op.like]: `%${search}%` };
  }

  if (type !== undefined && type !== null) {
    whereCondition.Type = type;
  }

  const videos = await Video.findAndCountAll({
    where: whereCondition,
    limit: selectedOnly ? 9999 : limit, // ← selectedOnly olarsa hamsını götür
    offset: selectedOnly ? 0 : offset, // ← offset 0
    order: [["CreatedDate", "DESC"]],
  });

  const selectedVideos = await SelectedVideos.findAll({
    where: {
      isDeleted: false,
      ObjectId: { [Op.in]: videos.rows.map((v: any) => v.Id) },
    },
    attributes: ["ObjectId"],
  });

  const selectedIds = new Set(selectedVideos.map((s: any) => s.ObjectId));

  let results = videos.rows.map((video: SelectVideos) => ({
    Id: video.Id,
    Title: video.Title,
    thumbnail: video.Thumb_img,
    Link: video.Link,
    type: video.Type,
    createdDate: video.CreatedDate,
    isSelected: selectedIds.has(video.Id),
  }));

  // Filter et
  if (selectedOnly) {
    results = results.filter((v: any) => v.isSelected);

    // İndi pagination et
    const start = offset;
    const end = offset + limit;
    results = results.slice(start, end);
  }

  return {
    count: selectedOnly
      ? videos.rows.filter((v: any) => selectedIds.has(v.Id)).length // ← Düzgün count
      : videos.count,
    data: results,
  };
}

// home
export async function getSelectedVideos(
  limit: number,
  offset: number,
  type?: number
): Promise<GetSelectedVideosResult> {
  const whereCondition: any = { isDeleted: false };

  // if (type !== undefined && type !== null) {
  //   whereCondition.Type = type;
  // }
  console.log(type, "type");
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
        where: { Type: type },
      },
    ],
    limit,
    offset,
    order: [["CreatedDate", "DESC"]],
    distinct: true,
  });

  return {
    count: selectedVideos.count,
    rows: selectedVideos.rows.map((item: SelectedVideoWithVideo) => ({
      selectionId: item.Id,
      selectedDate: item.CreatedDate,
      video: {
        id: item.video.Id,
        title: item.video.Title,
        thumbnail: item.video.Thumb_img,
        selectedThumbnail: item.video.Selected_Thumb_img,
        link: item.video.Link,
        nonEmbedLink: item.video.NonEmbedLink,
        type: item.video.Type,
        createdDate: item.video.CreatedDate,
      },
    })),
  };
}

// server/services/selectedVideoService.ts

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

// export async function getSelectedVideos(limit: number) {
//   const selectedVideos = await SelectedVideos.findAll({
//     where: { isDeleted: false },
//     include: [
//       {
//         model: Video,
//         as: "video",
//         required: true,
//         where: { isDeleted: false },
//       },
//     ],
//     limit,
//     order: [["CreatedDate", "DESC"]],
//   });

//   return selectedVideos.map((item: SelectedVideoWithVideo) => ({
//     id: item.video.Id,
//     title: item.video.Title,
//     thumbnail: item.video.Thumb_img,
//     link: item.video.Link,
//     type: item.video.Type,
//     selectedDate: item.CreatedDate,
//   }));
// }
