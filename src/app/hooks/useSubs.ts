import { createSub } from "@/app/services/subs.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateSub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => createSub(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subs"] });
    },
  });
};
