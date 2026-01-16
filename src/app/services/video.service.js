import { api } from "@/@lib/api/interceptor";

export const getVideo = (limit, page, id) =>
  api
    .get(`/videos?categoryId=${id}&limit=${limit}&page=${page}`)
    .then((res) => res.data);

export const getSVideo = (type, page) =>
  api.get(`/videos/selected?type=${type}&page=${page}`).then((res) => res.data);

export const getVideos = (limit, page, type, categoryIds) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));
  params.set("type", String(type));

  if (categoryIds?.length) {
    categoryIds.forEach((id) => params.append("categoryIds", String(id)));
  }
  return api.get(`/videos?${params.toString()}`).then((res) => res.data);
};

export const getVideoById = (id) =>
  api.get(`/videos/${id}`).then((res) => res.data);

export const updateVideo = (id, data) =>
  api.put(`/videos/${id}`, data).then((res) => res.data);

export const deleteVideo = (id) =>
  api.delete(`/videos/${id}`).then((res) => res.data);
