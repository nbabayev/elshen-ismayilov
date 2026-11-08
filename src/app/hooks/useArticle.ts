import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleSelection,
  moveArticleOrder,
  toggleArticleVisibility,
} from "@/app/services/article.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TabContentType } from "@/app/shared";

export const useArticles = ({
  limit = 9,
  page = 1,
  categoryIds = [],
  enabled,
  search,
  selectedOnly = false,
  includeHidden = false,
}: TabContentType & { search?: string; includeHidden?: boolean }) => {
  return useQuery({
    queryKey: [
      "articles",
      limit,
      page,
      categoryIds,
      search,
      selectedOnly,
      includeHidden,
    ],
    queryFn: () =>
      getArticles({
        limit,
        page,
        categoryIds,
        search,
        selectedOnly,
        includeHidden,
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
    retry: false,
    retryOnMount: false,
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
    mutationFn: ({ slug, data }: { slug: string; data: any }) =>
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

export const useMoveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      direction,
    }: {
      id: number;
      direction: "up" | "down";
    }) => moveArticleOrder(id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

export const useToggleArticleVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleArticleVisibility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });
};

export const useToggleArticleSelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: number) => toggleArticleSelection(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};
