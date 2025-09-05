import { api } from "@/@lib/api/interceptor";

export const getCategory = (type) =>
  api.get(`/catrgories/?type=${type}`).then((res) => res.data);
