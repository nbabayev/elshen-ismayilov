import { api } from "@/@lib/api/interceptor";

export const createSub = (email: string) =>
  api.post("/subscription", { email }).then((res) => res.data);

export const getSubscribers = ({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) =>
  api
    .get("/subscription", {
      params: { page, limit, search: search || undefined },
    })
    .then((res) => res.data);

export const deleteSubscriber = (id: number) =>
  api.delete(`/subscription/${id}`).then((res) => res.data);
