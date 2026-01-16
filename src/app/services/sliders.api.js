import { api } from "@/@lib/api/interceptor";

export const getSliders = (page = 1, limit = 10) =>
  api.get(`/sliders?page=${page}&limit=${limit}`).then((res) => res.data);

export const getSliderById = (id) =>
  api.get(`/sliders/${id}`).then((res) => res.data);

export const createSlider = (formData) =>
  api
    .post("/sliders", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const updateSlider = (id, formData) =>
  api
    .patch(`/sliders/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const deleteSlider = (id) =>
  api.delete(`/sliders/${id}`).then((res) => res.data);
