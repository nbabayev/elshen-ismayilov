import { api } from "@/@lib/api/interceptor";

export const getSettings = () => api.get(`/settings`).then((res) => res.data);

export const updateSettings = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return api.put(`/settings`, formData).then((res) => res.data);
};
