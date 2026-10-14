import {
  createSub,
  deleteSubscriber,
  getSubscribers,
} from "@/app/services/subs.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSubscriptions = ({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) =>
  useQuery({
    queryKey: ["subs", page, limit, search],
    queryFn: () => getSubscribers({ page, limit, search }),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

export const useCreateSub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => createSub(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subs"] });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subs"] });
    },
  });
};
