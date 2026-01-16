import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} from "@/app/services/video.service";
import { BaseParams, TabContentType } from "@/app/shared";

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

export const useVideoById = (id: number | string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => getVideoById(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: enabled && !!id,
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      updateVideo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
