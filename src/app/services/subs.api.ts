import { api } from "@/@lib/api/interceptor";

export const createSub = (email: string) =>
  api.post("/subscription", { email }).then((res) => res.data);
