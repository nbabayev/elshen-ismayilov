import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/app/services/settings.service";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
