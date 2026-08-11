import { api } from "@/@lib/api/interceptor";

export const getArticle = (id) =>
  api.get(`/articles?id=${id}`).then((res) => res.data);

export const getArticles = (
  limit,
  page,
  categoryIds = [],
  { search, selectedOnly } = {}
) => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  });
  // if (categoryIds.length > 0) {
  //   params.append("categoryIds", JSON.stringify(categoryIds));
  // }
  if (categoryIds?.length) {
    categoryIds.forEach((id) => params.append("categoryIds", String(id)));
  }
  if (search) {
    params.append("search", search);
  }
  if (selectedOnly) {
    params.append("selectedOnly", "true");
  }
  return api.get(`/articles?${params.toString()}`).then((res) => res.data);
};

export const getArticleById = (id) =>
  api.get(`/articles/${id}`).then((res) => res.data);

export const createArticle = (data) => {
  const hasFile = data?.Image instanceof File;

  if (hasFile) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === null) return;
      if (key === "CategoryIds" && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    return api.post("/articles", formData).then((res) => res.data);
  }

  return api.post("/articles", data).then((res) => res.data);
};

export const updateArticle = (id, data) =>
  api.patch(`/articles/${id}`, data).then((res) => res.data);

export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`).then((res) => res.data);

export const similarArticles = (id, limit = 4) =>
  api.get(`/articles/similar?id=${id}&limit=${limit}`).then(res);

export const toggleArticleSelection = (articleId) =>
  api.post(`/articles/toggle`, { articleId }).then((res) => res.data);
