"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, FreeMode } from "swiper/modules";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import LessonCard from "@/app/components/molecules/LessonCard/LessonCard";
import VideoCard from "@/app/components/molecules/VideoCard/VideoCard";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  let slidePerView = type === "0" ? (isDesktop ? 3 : 1.2) : isDesktop ? 4 : 1.2;
  let Component = type === "0" ? LessonCard : VideoCard;
  return (
    <div
      className={`${
        type === "0" &&
        "transform md:-translate-y-[150px] -translate-y-[60px] z-[2]"
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
        speed={2000}
        loop={true}
        className="mainSlide"
      >
        {data?.map((v: any, i: number) => (
          <SwiperSlide key={i} className="!w-[270px] md:!w-[380px]">
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
  );
}
