import { useQuery } from "@tanstack/react-query";
import { getSliders } from "@/app/services/sliders.api";

export const useSliders = () => {
  return useQuery({
    queryKey: ["sliders"],
    queryFn: () => getSliders(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
