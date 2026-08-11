"use server";

import { Article } from "@/models";

/**
 * Məqalənin baxış sayını bir vahid artırır.
 * Bu funksiya yalnız serverdə işləyir.
 */
export async function incrementArticleView(articleId: number) {
  if (!articleId) return;

  try {
    // Sequelize-nin `increment` metodundan istifadə edərək atomik şəkildə artırırıq.
    await Article.increment("ViewCount", { by: 1, where: { Id: articleId } });
  } catch (error) {
    console.error("Failed to increment article view count:", error);
  }
}
