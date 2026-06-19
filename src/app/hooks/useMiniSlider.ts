import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMiniSliders,
  getMiniSliderById,
  createMiniSlider,
  updateMiniSlider,
  deleteMiniSlider,
} from "@/app/services/miniSlider.api";

// Hook to get all mini sliders
export const useMiniSliders = ({ page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["miniSliders", page, limit],
    queryFn: () => getMiniSliders(page, limit),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// Hook to get mini slider by ID
export const useMiniSliderById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["miniSlider", id],
    queryFn: () => getMiniSliderById(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: enabled && !!id,
  });
};

// Hook to create mini slider
export const useCreateMiniSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMiniSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["miniSliders"] });
    },
  });
};

// Hook to update mini slider
export const useUpdateMiniSlider = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: string; formData: any }>({
    mutationFn: ({ id, formData }) => updateMiniSlider(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["miniSliders"] });
    },
  });
};

// Hook to delete mini slider
export const useDeleteMiniSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMiniSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["miniSliders"] });
    },
  });
};
