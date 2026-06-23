import {
  getArticle,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/app/services/article.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TabContentType } from "@/app/shared";

export const useArticles = ({
  limit = 9,
  page = 1,
  categoryIds = [],
  enabled,
}: TabContentType) => {
  return useQuery({
    queryKey: ["articles", limit, page, categoryIds],
    queryFn: () => getArticles(limit, page, categoryIds),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
  });
};

export const useArticleById = (
  id: number | string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: enabled && !!id,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: number | string; data: any }) =>
      updateArticle(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};
