import { getArticle, getArticles } from "@/app/services/article.api";
import { useQuery } from "@tanstack/react-query";
import { TabContentType } from "@/app/shared";

export const useArticles = ({
  limit = 9,
  page = 1,
  enabled,
}: TabContentType) => {
  return useQuery({
    queryKey: ["articles", limit, page],
    queryFn: () => getArticles(limit, page),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
  });
};

// export const useArticle = ({ id }: string) => {
//   return useQuery({
//     queryKey: ["articles", id],
//     queryFn: () => getArticle(id),
//     staleTime: 1000 * 60 * 2,
//     enabled: !!id,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });
// };
