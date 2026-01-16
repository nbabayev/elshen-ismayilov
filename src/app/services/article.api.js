import { api } from "@/@lib/api/interceptor";

export const getArticle = (id) =>
  api.get(`/articles?id=${id}`).then((res) => res.data);

export const getArticles = (limit, page, categoryIds = []) => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  });
  if (categoryIds.length > 0) {
    params.append("categoryIds", JSON.stringify(categoryIds));
  }
  return api.get(`/articles?${params.toString()}`).then((res) => res.data);
};

export const getArticleById = (id) =>
  api.get(`/articles/${id}`).then((res) => res.data);

export const createArticle = (data) =>
  api.post("/articles", data).then((res) => res.data);

export const updateArticle = (id, data) =>
  api.patch(`/articles/${id}`, data).then((res) => res.data);

export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`).then((res) => res.data);
