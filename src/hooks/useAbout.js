import { useQuery, useMutation } from "@tanstack/react-query";
import { getAbout, updateAbout } from "@/services/about.service";

export const useAbout = () => {
  return useQuery({ queryKey: ["about"], queryFn: getAbout });
};

export const useUpdateAbout = () => {
  return useMutation({ mutationFn: updateAbout });
};
