import { api } from "@/@lib/api/interceptor";

export const getArticle = (id) =>
  api.get(`/articles?id=${id}`).then((res) => res.data);

export const getArticles = (limit, page) => {
  return api
    .get(`/articles?limit=${limit}&page=${page}`)
    .then((res) => res.data);
};
