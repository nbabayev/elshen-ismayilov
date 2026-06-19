import { api } from "@/@lib/api/interceptor";

export const getVideo = (limit, page, id) =>
  api
    .get(`/videos?categoryId=${id}&limit=${limit}&page=${page}`)
    .then((res) => res.data);

export const getSVideo = (type, page, limit) =>
  api
    .get(`/videos/selected?type=${type}&page=${page}&limit=${limit}`)
    .then((res) => res.data);

export const getVideos = (
  limit,
  page,
  type,
  categoryIds,
  search,
  isAdmin = false,
  selectedOnly = false
) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));
  params.set("type", String(type));

  if (search && search.trim()) {
    params.set("search", search.trim());
  }

  if (categoryIds?.length) {
    categoryIds.forEach((id) => params.append("categoryIds", String(id)));
  }
  if (isAdmin) {
    if (selectedOnly) {
      params.set("selectedOnly", "true");
    }
  }

  const url = isAdmin
    ? `/videos/admin?${params.toString()}`
    : `/videos?${params.toString()}`;
  return api.get(url).then((res) => res.data);
};

export const getVideoById = (id) =>
  api.get(`/videos/${id}`).then((res) => res.data);

export const createVideo = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === "CategoryIds" && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  return api.post(`/videos`, formData).then((res) => res.data);
};

export const updateVideo = (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === "CategoryIds" && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  return api.patch(`/videos/${id}`, formData).then((res) => res.data);
};

export const deleteVideo = (id) =>
  api.delete(`/videos/${id}`).then((res) => res.data);

export const toggleVideoSelection = (videoId) =>
  api.post(`/videos/toggle`, { videoId }).then((res) => res.data);
