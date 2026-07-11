import { api } from "@/@lib/api/interceptor";

export const getGalleries = (
  page: number = 1,
  limit: number = 10,
  type?: "image" | "video"
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (type) {
    params.append("type", type);
  }
  return api.get(`/gallery?${params.toString()}`).then((res) => res.data);
};

export const getGalleryById = (id: number) => {
  return api.get(`/gallery/${id}`).then((res) => res.data);
};

export const createGallery = (data: FormData) => {
  return api.post("/gallery", data).then((res) => res.data);
};

export const updateGallery = (id: number, data: FormData) => {
  return api.put(`/gallery/${id}`, data).then((res) => res.data);
};

export const deleteGallery = (id: number) => {
  return api.delete(`/gallery/${id}`).then((res) => res.data);
};

export const getGalleryImages = (id: number) => {
  return api.get(`/gallery/${id}`).then((res) => res.data);
};

export const getGalleryVideos = (id: number) => {
  return api.get(`/gallery/${id}`).then((res) => res.data);
};
