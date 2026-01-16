"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useMiniSliders } from "@/app/hooks/useMiniSlider";
import LinkRenderer from "@/app/components/atoms/LinkRenderer";
import { useState } from "react";

export default function MiniSlider() {
  const { data: slidesData, isLoading } = useMiniSliders();
  const slides = slidesData?.data || [];
  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
  });
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-[150px] h-[100px] bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  if (!slides.length) {
    return null;
  }

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        className="miniSlide"
        slidesPerView={slides.length > 6 ? 6.2 : slides.length}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.Id}>
            <div
              onClick={() =>
                setOpen({
                  link:
                    `https://www.youtube.com/embed/${
                      slide.Link?.split("shorts/")[1]
                    }?rel=0&iv_load_policy=3&loop=1` || "#",
                  isOpen: true,
                })
              }
              className="cursor-pointer"
            >
              <img
                src={slide.ImageUrl}
                alt={slide.Title || "Mini slider image"}
                loading="lazy"
                className="rounded"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {open.isOpen && <LinkRenderer open={open} setOpen={setOpen} />}
    </div>
  );
}
