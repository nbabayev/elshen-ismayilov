import { api } from "@/@lib/api/interceptor";

// Get all mini sliders
export const getMiniSliders = (page = 1, limit = 10) =>
  api.get(`/mini-sliders?page=${page}&limit=${limit}`).then((res) => res.data);

// Get mini slider by ID
export const getMiniSliderById = (id) =>
  api.get(`/mini-sliders/${id}`).then((res) => res.data);

// Create mini slider
export const createMiniSlider = (formData) =>
  api.post("/mini-sliders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);

// Update mini slider
export const updateMiniSlider = (id, formData) =>
  api.patch(`/mini-sliders/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);

// Delete mini slider
export const deleteMiniSlider = (id) =>
  api.delete(`/mini-sliders/${id}`).then((res) => res.data);
