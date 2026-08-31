"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import LinkRenderer from "@/app/components/atoms/LinkRenderer";
import OptimizedImage from "@/app/components/atoms/OptimizedImage";
import PlayIcon from "@/app/components/molecules/PlayIcon";

const getYouTubeEmbedUrl = (link) => {
  // ... mövcud funksiyan eyni qalsın
};

export default function MiniSlider({ data, loading }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
    selectedIndex: 0,
  });

  const slides = (data || []).map((slide) => ({
    ...slide,
    embedLink: getYouTubeEmbedUrl(slide.Link),
  }));

  // data yoxdursa + loading bitibsə
  if (!loading && !slides.length) {
    return null;
  }

  const showSkeleton = loading || !ready;

  return (
    <div className="relative min-h-[208px] md:min-h-[260px]">
      {slides.length > 0 && (
        <div
          className={`transition-opacity duration-200 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <Swiper
            modules={[Navigation, Pagination, Mousewheel]}
            spaceBetween={12}
            className="miniSlide"
            slidesPerView="auto"
            breakpoints={{
              768: { spaceBetween: 20 },
            }}
            mousewheel={{
              forceToAxis: true, // yalnız horizontal hərəkəti tutur, vertical scroll-a mane olmur
            }}
            onSwiper={() => requestAnimationFrame(() => setReady(true))}
          >
            {slides.map((slide, index) => (
              <SwiperSlide
                key={slide.Id}
                className="mini-card-beat relative !w-[144px] md:!w-[180px] rounded"
              >
                <div
                  onClick={() =>
                    setOpen({
                      link: slide.embedLink,
                      isOpen: true,
                      selectedIndex: index,
                    })
                  }
                  className="cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded w-[144px] h-[208px] md:w-[180px] md:h-[260px]">
                    <PlayIcon
                      className="bottom-3 left-3 w-7 h-7"
                      width={8}
                      height={8}
                    />
                    <OptimizedImage
                      src={slide.ImageUrl}
                      alt="Card image"
                      fill
                      style={{ objectFit: "cover" }}
                      priority={index < 2}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {showSkeleton && (
        <div className="absolute inset-0 flex gap-3 md:gap-5 overflow-hidden pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[144px] h-[208px] md:w-[180px] md:h-[260px] rounded bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {open.isOpen && (
        <LinkRenderer open={open} setOpen={setOpen} slides={slides} />
      )}
    </div>
  );
}
