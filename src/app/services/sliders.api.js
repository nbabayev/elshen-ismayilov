import { api } from "@/@lib/api/interceptor";

export const getSliders = () => api.get(`/sliders`).then((res) => res.data);
