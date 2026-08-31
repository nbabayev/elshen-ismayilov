import { api } from "@/@lib/api/interceptor";
type GetArticleParams = {
  limit?: number;
  page?: number;
  categoryIds?: number[];
  search?: string;
  selectedOnly?: boolean;
};
export const getArticle = (id: number | string) =>
  api.get(`/articles?id=${id}`).then((res) => res.data);

export const getArticles = (payload: GetArticleParams) => {
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== false
    ) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach((id) => params.append(key, String(id)));
        }
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
  });

  return api.get(`/articles`, { params }).then((res) => res.data);
};

export const getArticleById = (id: number | string) =>
  api.get(`/articles/${id}`).then((res) => res.data);

export const createArticle = (data: any) => {
  const hasFile = data?.Image instanceof File;
  const formData = new FormData();

  if (hasFile) {
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === null) return;
      if (key === "CategoryIds" && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    // return api.post("/articles", formData).then((res) => res.data);
  }

  return api
    .post("/articles", hasFile ? formData : data)
    .then((res) => res.data);
};

export const updateArticle = (slug: string, data: any) =>
  api.patch(`/articles/${slug}`, data).then((res) => res.data);

export const deleteArticle = (id: number) =>
  api.delete(`/articles/${id}`).then((res) => res.data);

export const similarArticles = (id: number, limit = 4) =>
  api.get(`/articles/similar?id=${id}&limit=${limit}`).then((res) => res.data); // helelki birbasa fetchert terefinden service isleyir deye bura cagirilmir

export const toggleArticleSelection = (articleId: number) =>
  api.post(`/articles/toggle`, { articleId }).then((res) => res.data);
