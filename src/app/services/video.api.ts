import { api } from "@/@lib/api/interceptor";

type GetVideosParams = {
  limit?: number;
  page?: number;
  type?: number;
  categoryIds?: number[];
  search?: string;
  selectedOnly?: boolean; // Ana səhifə üçün bu parametri əlavə edirik
};

// videos for content page
export const getVideos = (payload: GetVideosParams) => {
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
          params.append(key, JSON.stringify(value));
        }
      } else {
        params.append(key, String(value));
      }
    }
  });
  console.log(params.toString(), "params");
  return api.get(`/videos`, { params }).then((res) => res.data);
};

// api for home page
export const getSVideo = (type: number) =>
  api.get(`/videos/selected?type=${type}`).then((res) => res.data);

export const getVideoById = (id: number | string) =>
  api.get(`/videos/${id}`).then((res) => res.data);

export const createVideo = (data: any) => {
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

export const updateVideo = (id: number | string, data: any) => {
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

export const deleteVideo = (id: number) =>
  api.delete(`/videos/${id}`).then((res) => res.data);

export const toggleVideoSelection = (videoId: number) =>
  api.post(`/videos/toggle`, { videoId }).then((res) => res.data);
