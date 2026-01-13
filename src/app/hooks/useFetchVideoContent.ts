import { useSelectedVideos, useVideos } from "@/app/hooks/useVideos";

export const useFetchVideoContent = () => {
  const type0 = useSelectedVideos({ type: 0, page: 1 });
  const type1 = useSelectedVideos({ type: 1, page: 1 });
  const type2 = useSelectedVideos({ type: 2, page: 1 });
  const type3 = useSelectedVideos({ type: 3, page: 1 });

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
