import { Model } from "sequelize";

export const slugToTab: Record<string, number> = {
  lessons: 0,
  sermons: 1,
  speeches: 2,
  trainings: 3,
  articles: 4,
  books: 5,
};

export interface SelectedArticleWithArticle {
  Id: number;
  ObjectId: number;
  isDeleted: boolean;
  CreatedDate: Date;
  article: {
    Id: number;
    Title: string;
    Slug: string;
    ShortDescription: string | null;
    Image: string | null;
    CreatedDate: Date;
    ReadMinute: number | null;
    ViewDate: Date | null;
    Content: string | null;
    ViewCount?: number;
  };
}

export interface GetSelectedResult {
  count: number;
  total: number;
  data: any[];
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

export interface ContentProps {
  type?: number;
  categoryIds?: number[];
  limit?: number;
  page?: number;
  search?: string;
  selectedOnly?: boolean;
}

export interface GetAllArticlesParams {
  search?: string;
  categoryIds?: (string | number)[] | string;
  selectedOnly?: boolean;
  limit: number;
  page: number;
}
