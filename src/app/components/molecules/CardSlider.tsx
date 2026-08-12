"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, FreeMode } from "swiper/modules";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import LessonCard from "@/app/components/molecules/LessonCard/LessonCard";
import VideoCard from "@/app/components/molecules/VideoCard/VideoCard";
import { useState } from "react";

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
  setOpen: React.Dispatch<React.SetStateAction<OpenState>>;
}) {
  let Component = type === "0" ? LessonCard : VideoCard;
  const isLesson = type === "0";
  const [ready, setReady] = useState(false);
  return (
    // <div className="flex gap-5 overflow-x-auto">
    //   {data?.map((v, i) => (
    //     <div key={i} className="w-[270px] md:w-[380px] shrink-0">
    //       <Component data={v?.video} setOpen={setOpen} index={i} />
    //     </div>
    //   ))}
    // </div>
    <div
      className={`relative ${
        type === "0"
          ? "transform md:-translate-y-[150px] -translate-y-[60px] z-[2] min-h-[320px] md:min-h-[420px]"
          : "min-h-[280px]"
      }`}
    >
      <div
        className={`transition-opacity duration-200 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <Swiper
          modules={[A11y, Autoplay, FreeMode]}
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
          onInit={() => requestAnimationFrame(() => setReady(true))}
          // onInit={() => setReady(true)}
        >
          {data?.map((v: any, i: number) => (
            <SwiperSlide
              key={i}
              className={`!w-[270px] md:!w-[380px]
                ${
                  isLesson
                    ? "!h-[280px] md:!h-[360px]"
                    : "!h-[260px] md:!h-[320px]"
                }
              `}
            >
              {/* <Link href={`${v?.selectionId}`} key={v?.selectionId}> */}
              <Component
                key={v.selectionId}
                data={v?.video}
                setOpen={setOpen}
                index={i}
              />
              {/* </Link> */}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {!ready && (
        <div className="absolute inset-0 flex gap-5 overflow-hidden pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`shrink-0 rounded-xl bg-gray-400 animate-pulse ${
                isLesson
                  ? "w-[270px] md:w-[380px] h-[250px] md:h-[305px]"
                  : "w-[270px] md:w-[380px] h-[250px] md:h-[305px]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
