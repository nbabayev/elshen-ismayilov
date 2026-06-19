import { SelectedVideos, Video } from "@/models";
import { Op } from "sequelize";
import { Model } from "sequelize";

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

// admin
export async function getAllVideosWithSelection(
  limit?: number,
  offset?: number,
  search: string = "",
  selectedOnly: boolean = false,
  type?: number,
  isadmin?: boolean
) {
  const whereCondition: any = { isDeleted: false };
  if (search) {
    whereCondition.Title = { [Op.like]: `%${search}%` };
  }

  if (type !== undefined && type !== null) {
    whereCondition.Type = type;
  }

  let pagination = { limit, offset };

  if (selectedOnly) {
    pagination = { limit: undefined, offset: undefined };
  }
  const videos = await Video.findAndCountAll({
    where: whereCondition,
    ...pagination, // ← offset 0
    order: [["CreatedDate", "DESC"]],
    raw: true,
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
    ...video,
    isSelected: selectedIds.has(video.Id),
  }));

  // Filter et

  if (selectedOnly) {
    results = results.filter((v: any) => selectedIds.has(v.Id));
  }

  return {
    count: selectedOnly
      ? videos.rows.filter((v: any) => selectedIds.has(v.Id)).length // ← Düzgün count
      : videos.count,
    data: results,
  };
}
