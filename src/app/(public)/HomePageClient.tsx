"use client";

import { useState, useEffect } from "react";
import Section from "@/app/components/molecules/Section/Section";
import SectionHeader from "@/app/components/atoms/SectionHeader/SectionHeader";
import Articles from "@/app/components/organisms/HomeArticles/Articles";
import Subscription from "@/app/components/molecules/Subscription/Subscription";
import MiniSlider from "@/app/components/atoms/MiniSlider";
import Slider from "@/app/components/shared/Slider";
import VideoGrid from "@/app/components/molecules/VideoGrid";
import SectionTotal from "@/app/components/atoms/SectionTotal";

// TanStack Query hook-larını burada istifadə edə bilərik,
// amma ilkin datanı serverdən `initialData` olaraq alırıq.
// Bu, həm SSR-dən yararlanmağa, həm də client-side caching/refetching imkanlarını saxlamağa şərait yaradır.
import { useQuery } from "@tanstack/react-query";
// PROBLEM: Bu funksiyalar server-side kod (Sequelize, 'fs' modulu) istifadə edir.
// Onları birbaşa Client Component-də çağırmaq "Module not found: fs" xətasına səbəb olur.
// HƏLL: `queryFn` üçün client-side-da işləyən API sorğusu edən funksiyalar yaradılmalıdır.
// Müvəqqəti həll olaraq, initialData istifadə edildiyi üçün `queryFn`-i saxta bir funksiya ilə əvəz edirik.
// import { getSliders, getArticles, getVideoContent } from "@/@lib/data-fetchers";

// Props type-larını təyin edirik
type HomePageClientProps = {
  initialSliders: any;
  initialArticles: any;
  initialLessons: any;
  initialSermons: any;
  initialTrainings: any;
  initialSpeeches: any;
};

export default function HomePageClient({
  initialSliders,
  initialArticles,
  initialLessons,
  initialSermons,
  initialTrainings,
  initialSpeeches,
}: HomePageClientProps) {
  // Hydration xətalarının qarşısını almaq üçün state
  const [isClient, setIsClient] = useState(false);

  // Komponent client-də tam yükləndikdən sonra bu state-i true edirik.
  // Bu, yalnız client-də işləyən Swiper kimi kitabxanaların
  // server renderi ilə fərqlilik yaratmasının qarşısını alır.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // `initialData` sayəsində səhifə ilk yüklənəndə loading state olmayacaq,
  // çünki data artıq serverdə çəkilib.
  // Amma TanStack Query arxa planda datanı təzələyə və cache-ləyə bilər.
  const { data: sliders, isLoading: sliderLoading } = useQuery({
    queryKey: ["sliders"],
    queryFn: async () => initialSliders(), // TODO: Client-side fetcher yaradılmalıdır
    initialData: initialSliders,
    staleTime: 1000 * 60 * 5, // 5 dəqiqə
  });

  const { data: articles, isLoading: isArticleLoad } = useQuery({
    queryKey: ["articles", { limit: 4, page: 1 }],
    queryFn: async () => initialArticles, // TODO: Client-side fetcher yaradılmalıdır
    initialData: initialArticles,
    staleTime: 1000 * 60 * 5, // 5 dəqiqə
  });

  // Videolar üçün də eyni "initialData" məntiqini tətbiq edirik.
  // Bu, həm SSR sürətini, həm də client-side data təzələmə imkanlarını birləşdirir.
  const { data: lessons } = useQuery({
    queryKey: ["videos", { type: 0 }],
    queryFn: async () => initialLessons, // TODO: Client-side fetcher yaradılmalıdır
    initialData: initialLessons,
    staleTime: 1000 * 60 * 5,
  });

  const { data: sermons } = useQuery({
    queryKey: ["videos", { type: 1 }],
    queryFn: async () => initialSermons, // TODO: Client-side fetcher yaradılmalıdır
    initialData: initialSermons,
    staleTime: 1000 * 60 * 5,
  });

  const { data: trainings } = useQuery({
    queryKey: ["videos", { type: 3 }],
    queryFn: async () => initialTrainings, // TODO: Client-side fetcher yaradılmalıdır
    initialData: initialTrainings,
    staleTime: 1000 * 60 * 5,
  });

  const { data: speeches } = useQuery({
    queryKey: ["videos", { type: 2 }],
    queryFn: async () => initialSpeeches, // TODO: Client-side fetcher yaradılmalıdır
    initialData: initialSpeeches,
    staleTime: 1000 * 60 * 5,
  });

  // Videolar üçün də eyni məntiqi tətbiq etmək olar.
  // Sadəlik üçün birbaşa props-dan gələn datanı istifadə edirik.
  const sections = [
    {
      label: "Dərslər",
      icon: "/icons/section-book.png",
      videos: lessons?.data,
      pattern: "lesson-section-pattern",
      type: "0",
      total: lessons?.total,
      link: "lessons",
    },
    {
      label: "Moizələr",
      icon: "/icons/section-sermons.png",
      videos: sermons?.data,
      total: sermons?.total,
      link: "sermons",
    },
    {
      label: "Təlimlər",
      icon: "/icons/section-training.png",
      videos: trainings?.data,
      total: trainings?.total,
      link: "trainings",
    },
    {
      label: "Verilişlər",
      icon: "/icons/section-speech.png",
      videos: speeches?.data,
      total: speeches?.total,
      link: "speeches",
    },
  ];

  return (
    <div>
      {/* Yalnız client-də tam yükləndikdən sonra Swiper-i render edirik */}
      {isClient && <Slider data={sliders} loading={sliderLoading} />}

      <div className="relative -translate-y-30 z-[2] md:h-[260px]">
        <div className="max-w-[1250px] mx-auto ps-6 sm:px-4 md:px-6 lg:px-8">
          {/* MiniSlider də Swiper istifadə etdiyi üçün eyni məntiqi tətbiq edirik */}
          {isClient && <MiniSlider />}
        </div>
      </div>
      <>
        {sections.map((section, idx) => (
          <Section
            key={idx}
            patternClass={section.pattern || null}
            sectionHeader={
              <SectionHeader
                label={section.label}
                icon={section.icon}
                isLoading={false} // Data artıq mövcuddur
                TotalComponent={
                  <SectionTotal
                    total={section.total}
                    icon="/icons/play-circle.svg"
                  />
                }
                link={section.link}
                isPriority={section.label === "Dərslər"}
              />
            }
            content={<VideoGrid videos={section.videos} type={section.type} />}
          />
        ))}
      </>
      <Newsletter />

      <Section
        patternClass={null}
        sectionHeader={
          <SectionHeader
            label="Məqalələr"
            icon="/icons/pen.png"
            link="articles"
            TotalComponent={
              <SectionTotal
                total={articles?.total}
                icon="/icons/article-icon.svg"
              />
            }
          />
        }
        content={<Articles data={articles?.data} />}
      />
    </div>
  );
}

export function Newsletter() {
  return (
    <div className="flex justify-center items-center newsletter-section-pattern mb-15">
      <div className="max-w-[1180px] md:px-6 px-6 sm:px-4 lg:px-8 py-8">
        <div
          className="grid md:grid-cols-[1fr_1fr] grid-cols-[1fr] gap-5 pb-26"
          // style={{
          //   display: "grid",
          //   gridTemplateColumns: "repeat(auto-fill, minmax(260px, 49%))",
          //   gap: "20px",
          // }}
        >
          <div className="text-white mt-10 max-sm:text-center order-2 md:order-1">
            <div className="text-2xl md:text-4xl leading-[120%] font-playfair">
              Allaha tərəf qaçın!
            </div>
            <div
              className={`leading-[148%] font-lexend mt-4 text-base md:text-3xl`}
            >
              Zariyat 51/50
            </div>
            <div className="mt-10">
              <Subscription titleFont="text-sm" center="" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img src="/images/newsletter-img.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
