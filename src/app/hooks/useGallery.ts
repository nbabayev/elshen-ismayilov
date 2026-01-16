import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} from "@/app/services/gallery.api";

interface UseGalleriesParams {
  page?: number;
  limit?: number;
  type?: "image" | "video";
  enabled?: boolean;
}

export const useGalleries = ({
  page = 1,
  limit = 10,
  type,
  enabled = true,
}: UseGalleriesParams = {}) => {
  return useQuery({
    queryKey: ["galleries", page, limit, type],
    queryFn: () => getGalleries(page, limit, type),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
  });
};

export const useGalleryById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["gallery", id],
    queryFn: () => getGalleryById(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: enabled && !!id,
  });
};

export const useCreateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateGallery(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};
