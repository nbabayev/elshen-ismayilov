import { unstable_cache as cache } from "next/cache";

import { connectDB } from "@/@lib/api/db";
import {
  getById,
  getSelectedArticles,
  getSimilar,
} from "@/services/article.service";
import { getAll as getAllSliders } from "@/services/slider.service";
import { getAll as getArticles } from "@/services/article.service";
import { getAll as getMiniSliders } from "@/services/miniSlider.service";
import {
  getAll as getAllVideos,
  getSelectedVideos,
} from "@/services/video.service";

import { ContentProps, GetAllArticlesParams } from "@/app/types";
import { getTree } from "@/services/category.service";

export const getSliders = async (
  params: { page?: number; limit?: number } = {}
) => {
  const { page = 1, limit = 10 } = params;
  await connectDB();
  const rows = await getAllSliders({ page, limit });
  return JSON.parse(JSON.stringify(rows));
};

export const getSimilarArticles = cache(
  async (slug: string, limit: number = 4) => {
    await connectDB();
    const articles = await getSimilar(slug, limit);
    return JSON.parse(JSON.stringify(articles));
  },
  ["getSimilarArticles"]
);
// fetcher for selected articles on home page
export const fetchSelectedArticles = async () => {
  await connectDB();
  const articles = await getSelectedArticles();

  return JSON.parse(JSON.stringify(articles));
};

export const fetchArticles = async ({
  categoryIds,
  search,
  selectedOnly,
  limit,
  page,
}: GetAllArticlesParams) => {
  await connectDB();
  const articles = await getArticles({
    categoryIds,
    search,
    selectedOnly,
    limit,
    page,
  });

  return JSON.parse(JSON.stringify(articles));
};

export const getArticle = cache(
  async (slug: string) => {
    await connectDB();
    const article = await getById(slug);
    return JSON.parse(JSON.stringify(article));
  },
  ["getArticle"],
  {
    revalidate: 3600, // Nəticəni 1 saat (3600 saniyə) keşlə
    tags: ["articles"], // Bu cache-i qruplaşdırmaq üçün tag
  }
);

// fetcher for selected videos on home page
export const getSelectedVideoContent = async (type: number) => {
  try {
    await connectDB();
    const result = await getSelectedVideos(type);
    return JSON.parse(
      JSON.stringify({
        total: result.total,
        count: result.count,
        data: result.data,
      })
    );
  } catch (error) {
    console.error(`Error fetching video content for type ${type}:`, error);
    return { total: 0, count: 0, data: [] };
  }
};

// fetcher for all video content on content route.
export const getVideoContent = async ({
  type,
  categoryIds = [],
  limit = 9,
  page = 1,
}: ContentProps) => {
  try {
    await connectDB();
    const result = await getAllVideos({
      type,
      categoryIds,
      limit,
      page,
    });
    return JSON.parse(
      JSON.stringify({
        total: result.total,
        data: result.data,
      })
    );
  } catch (error) {
    console.error(`Error fetching video content for type ${type}:`, error);
    return { total: 0, count: 0, data: [] };
  }
};

export const getCategories = async (type: number) => {
  try {
    await connectDB();
    const result = await getTree(type);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error(`Error fetching category content for type ${type}:`, error);
    return { total: 0, count: 0, data: [] };
  }
};

export const fetchMiniSliders = async () => {
  try {
    await connectDB();
    const result = await getMiniSliders();
    console.log(JSON.parse(JSON.stringify(result)), "get minisliders");
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error(`Error fetching mini slider content`, error);
    return { total: 0, count: 0, data: [] };
  }
};
