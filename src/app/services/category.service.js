import { api } from "@/@lib/api/interceptor";

export const getCategory = (type) =>
  api.get(`/categories`, { params: { type } }).then((res) => res.data);
