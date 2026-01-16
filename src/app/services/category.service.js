import { api } from "@/@lib/api/interceptor";

export const getCategory = (type) =>
  api.get(`/categories`, { params: { type } }).then((res) => res.data);

export const getCategories = (getHidden = false) =>
  api.get(`/categories`, { params: { getHidden } }).then((res) => res.data);

export const getCategoryById = (id) =>
  api.get(`/categories/${id}`).then((res) => res.data);

export const createCategory = (data) =>
  api.post("/categories", data).then((res) => res.data);

export const updateCategory = (id, data) =>
  api.patch(`/categories/${id}`, data).then((res) => res.data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`).then((res) => res.data);
