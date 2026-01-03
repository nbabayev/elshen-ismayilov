import { api } from "@/@lib/api/interceptor";

export const getSettings = () => api.get(`/settings`).then((res) => res.data);
