import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSVideo,
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleVideoSelection,
  moveVideoOrder,
  toggleVideoVisibility,
} from "@/app/services/video.api";
import { BaseParams, TabContentType } from "@/app/shared";

export const useVideos = ({
  limit = 9,
  page = 1,
  type,
  categoryIds = [],
  enabled,
  search,
  selectedOnly = false,
  includeHidden = false,
}: TabContentType & { search?: string; includeHidden?: boolean }) => {
  return useQuery({
    queryKey: [
      "videos",
      limit,
      page,
      type,
      categoryIds,
      search,
      selectedOnly,
      includeHidden,
    ],
    queryFn: () =>
      getVideos({
        limit,
        page,
        type,
        categoryIds,
        search,
        selectedOnly,
        includeHidden,
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
  });
};

export const useSelectedVideos = ({ type = 0 }: BaseParams) => {
  return useQuery({
    queryKey: ["svideos", type],
    queryFn: () => getSVideo(type),
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

export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
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

export const useMoveVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      direction,
    }: {
      id: number;
      direction: "up" | "down";
    }) => moveVideoOrder(id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["svideos"] });
    },
  });
};

export const useToggleVideoVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleVideoVisibility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["svideos"] });
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });
};

export const useToggleVideoSelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: number) => toggleVideoSelection(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["svideos"] });
    },
  });
};
