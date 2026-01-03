import { useQuery, useMutation } from "@tanstack/react-query";
import { getCategory } from "@/app/services/category.service";

export const useCategory = (type) => {
  return useQuery({
    queryKey: ["category", type],
    queryFn: () => getCategory(type),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
