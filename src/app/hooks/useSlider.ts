import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} from "@/app/services/sliders.api";

export const useSliders = ({ page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["sliders", page, limit],
    queryFn: () => getSliders(page, limit),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useSliderById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["slider", id],
    queryFn: () => getSliderById(id),
    // staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: enabled && !!id,
  });
};

export const useCreateSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSlider,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["sliders"] });
      queryClient.refetchQueries({ queryKey: ["sliders"] });
    },
  });
};

export const useUpdateSlider = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: string; formData: any }>({
    mutationFn: ({ id, formData }) => updateSlider(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
    },
  });
};

export const useDeleteSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
    },
  });
};
