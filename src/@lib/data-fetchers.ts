import { unstable_cache as cache } from "next/cache";

import { connectDB } from "@/@lib/api/db";
import {
  getSelectedArticles as getAllArticles,
  getById,
  getSimilar,
} from "@/services/article.service";
import { getAll as getAllSliders } from "@/services/slider.service";
import { getSelectedVideos } from "@/services/video.service";

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
    console.log(`Fetching similar articles for ID: ${slug}`);
    await connectDB();
    const articles = await getSimilar(slug, limit);
    return JSON.parse(JSON.stringify(articles));
  },
  ["getSimilarArticles"]
);

export const getArticles = async () => {
  await connectDB();
  const articles = await getAllArticles();

  return JSON.parse(JSON.stringify(articles));
};

export const getArticle = cache(
  async (slug: string) => {
    console.log(`Fetching article with slug: ${slug} from API service`);
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
export const getVideoContent = async (type: number) => {
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
