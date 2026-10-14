"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, FreeMode, Mousewheel } from "swiper/modules";
import Link from "next/link";
import LessonCard from "@/app/components/molecules/LessonCard/LessonCard";
import VideoCard from "@/app/components/molecules/VideoCard";
import { useState } from "react";
import { ArticleCard } from "@/app/components/molecules/ArticleCard/ArticleCard";

type OpenState = {
  link: string;
  isOpen: boolean;
};

export default function Slider({
  data = [],
  type,
  setOpen,
}: {
  data: any[];
  type?: string;
  setOpen?: React.Dispatch<React.SetStateAction<OpenState>>;
}) {
  const Component = type === "0" ? LessonCard : VideoCard;
  const isLesson = type === "0";
  const isArticle = type === "4";
  const [ready, setReady] = useState(false);

  const slideClassName = isArticle
    ? "!w-[268px] !h-auto"
    : `!w-[270px] md:!w-[380px] ${
        isLesson ? "!h-[280px] md:!h-[360px]" : "!h-[260px] md:!h-[320px]"
      }`;

  const skeletonClassName = isArticle
    ? "w-[268px] h-[380px]"
    : "w-[270px] md:w-[380px] h-[250px] md:h-[305px]";

  return (
    <div
      className={`relative ${
        isLesson
          ? "transform md:-translate-y-[150px] -translate-y-[60px] z-[2] min-h-[320px] md:min-h-[420px]"
          : isArticle
          ? "min-h-[380px]"
          : "min-h-[280px]"
      }`}
    >
      <div
        className={`transition-opacity duration-200 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <Swiper
          modules={[A11y, Autoplay, FreeMode, Mousewheel]}
          grabCursor
          touchEventsTarget="container"
          threshold={5}
          freeMode={{
            enabled: true,
            momentumRatio: 0.5,
            momentumVelocityRatio: 0.5,
          }}
          slidesPerView="auto"
          // navigation
          spaceBetween={20}
          // autoplay={{ delay: 3000 }}
          speed={300}
          loop={false}
          className="cardSlide"
          mousewheel={{
            forceToAxis: true, // yalnız horizontal hərəkəti tutur, vertical scroll-a mane olmur
          }}
          onInit={() => requestAnimationFrame(() => setReady(true))}
          // onInit={() => setReady(true)}
        >
          {data?.map((item: any, i: number) => {
            const itemData = isArticle
              ? item?.article ?? item
              : item?.video ?? item;

            return (
              <SwiperSlide key={itemData?.Id ?? i} className={slideClassName}>
                {isArticle ? (
                  <Link href={`/articles/${itemData.Slug}`} className="block">
                    <ArticleCard
                      data={itemData}
                      highlighted={false}
                      stack={true}
                    />
                  </Link>
                ) : (
                  <Component data={itemData} setOpen={setOpen} index={i} />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {!ready && (
        <div className="absolute inset-0 flex gap-5 overflow-hidden pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`shrink-0 rounded-xl bg-gray-400 animate-pulse ${skeletonClassName}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
