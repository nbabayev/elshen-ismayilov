import { useQuery } from "@tanstack/react-query";
import { getSVideo, getVideos } from "@/app/services/video.service";
import { BaseParams, TabContentType } from "@/app/shared";

// export const useVideo = ({ id, limit, page }) => {
//   return useQuery({
//     queryKey: ["videos", limit, page, id],
//     queryFn: () => getVideo(limit, page, id),
//     staleTime: 1000 * 60 * 2,
//     enabled: !!id,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });
// };

export const useVideos = ({
  limit = 9,
  page = 1,
  type,
  categoryIds = [],
  enabled,
}: TabContentType) => {
  return useQuery({
    queryKey: ["videos", limit, page, type, categoryIds],
    queryFn: () => getVideos(limit, page, type, categoryIds),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
  });
};

export const useSelectedVideos = ({ type = 0, page = 1 }: BaseParams) => {
  return useQuery({
    queryKey: ["svideos", type, page],
    queryFn: () => getSVideo(type, page),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
