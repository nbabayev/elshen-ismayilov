import { api } from "@/@lib/api/interceptor";

export const getBooks = (page = 1, limit = 10) =>
  api.get(`/books?page=${page}&limit=${limit}`).then((res) => res.data);

export const getBookBySlug = (slug: string) =>
  api.get(`/books/${slug}`).then((res) => res.data);

export const createBook = (data: any) =>
  api.post("/books", data).then((res) => res.data);

export const updateBook = (id: string, data: any) =>
  api.patch(`/books/${id}`, data).then((res) => res.data);

export const deleteBook = (id: number) =>
  api.delete(`/books/${id}`).then((res) => res.data);
