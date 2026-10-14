import { api } from "@/@lib/api/interceptor";

export const getBooks = (page = 1, limit = 10) =>
  api.get(`/books?page=${page}&limit=${limit}`).then((res) => res.data);

export const getBookBySlug = (slug: string) =>
  api.get(`/books/${slug}`).then((res) => res.data);

const toBookFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (key === "Image" && value instanceof File) {
      formData.append("Image", value);
      return;
    }

    if (key === "Pdf" && value instanceof File) {
      formData.append("Pdf", value);
      return;
    }

    if (key === "NotifyUsers") {
      formData.append("NotifyUsers", value ? "true" : "false");
      return;
    }

    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
      return;
    }

    if (!(value instanceof File)) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

const hasUploadFile = (data: Record<string, any>) =>
  data?.Image instanceof File || data?.Pdf instanceof File;

/** File varsa həmişə multipart; yoxdursa JSON (edit-də ImageUrl/PdfUrl saxlanır) */
export const createBook = (data: any) => {
  const useMultipart =
    hasUploadFile(data) || typeof data?.NotifyUsers === "boolean";
  const payload = useMultipart ? toBookFormData(data) : data;
  return api.post("/books", payload).then((res) => res.data);
};

export const updateBook = (id: string, data: any) => {
  const useMultipart = hasUploadFile(data) || Boolean(data?.ImageUrl || data?.PdfUrl);
  const payload = useMultipart ? toBookFormData(data) : data;
  return api.patch(`/books/${id}`, payload).then((res) => res.data);
};

export const deleteBook = (id: number) =>
  api.delete(`/books/${id}`).then((res) => res.data);
