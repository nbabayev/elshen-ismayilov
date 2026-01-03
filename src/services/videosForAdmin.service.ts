// server/services/selectedVideoService.ts
import { SelectedVideos, Video } from "@/models";
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

// FOR ADMIN
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
  };
}

export async function getSelectedVideos(
  limit: number,
  offset: number
): Promise<GetSelectedVideosResult> {
  const selectedVideos = await SelectedVideos.findAndCountAll({
    where: { isDeleted: false },
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
        ],
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
      },
    })),
  };
}
