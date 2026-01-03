import { useVideos } from "@/app/hooks/useVideos";

export const useFetchVideoContent = () => {
  const type0 = useVideos({ type: 0, limit: 3, page: 1 });
  const type1 = useVideos({ type: 1, limit: 4, page: 1 });
  const type2 = useVideos({ type: 2, limit: 4, page: 1 });
  const type3 = useVideos({ type: 3, limit: 4, page: 1 });

  const isLoading =
    type0.isLoading || type1.isLoading || type2.isLoading || type3.isLoading;
  const isError =
    type0.isError || type1.isError || type2.isError || type3.isError;

  return {
    lessons: type0.data,
    sermons: type1.data,
    trainings: type2.data,
    speeches: type3.data,
    isLoading,
    isError,
  };
};
