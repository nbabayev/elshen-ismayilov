import { api } from "@/@lib/api/interceptor";

export const getAbout = () => api.get("/about").then((res) => res.data);
export const updateAbout = (data) =>
  api.put("/about", data).then((res) => res.data);
