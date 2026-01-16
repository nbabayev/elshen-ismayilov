import { api } from "@/@lib/api/interceptor";

export const getBooks = (page = 1, limit = 10) =>
  api.get(`/books?page=${page}&limit=${limit}`).then((res) => res.data);

export const getBookById = (id) =>
  api.get(`/books/${id}`).then((res) => res.data);

export const createBook = (data) =>
  api.post("/books", data).then((res) => res.data);

export const updateBook = (id, data) =>
  api.patch(`/books/${id}`, data).then((res) => res.data);

export const deleteBook = (id) =>
  api.delete(`/books/${id}`).then((res) => res.data);
