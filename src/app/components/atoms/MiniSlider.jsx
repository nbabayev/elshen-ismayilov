"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useMiniSliders } from "@/app/hooks/useMiniSlider";
import LinkRenderer from "@/app/components/atoms/LinkRenderer";
import { useState } from "react";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import OptimizedImage from "@/app/components/atoms/OptimizedImage";

const getYouTubeEmbedUrl = (link) => {
  if (!link) return "#";

  const cleanLink = link.trim();
  const shortPattern =
    /(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&?\/\n]+)/;
  const match = cleanLink.match(shortPattern);

  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&iv_load_policy=3&loop=1`;
  }

  try {
    const url = new URL(cleanLink);
    const videoId = url.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&iv_load_policy=3&loop=1`;
    }
  } catch (error) {
    // ignore invalid URL and fallback to raw link
  }

  return cleanLink;
};

export default function MiniSlider() {
  const { data: slidesData, isLoading } = useMiniSliders();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const slides = (slidesData?.data || []).map((slide) => ({
    ...slide,
    embedLink: getYouTubeEmbedUrl(slide.Link),
  }));
  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
    selectedIndex: 0,
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
  let slidesPerView = isDesktop && slides.length > 6 ? 6.2 : 2.8;
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={12}
        className="miniSlide"
        slidesPerView={"auto"}
        breakpoints={{
          768: {
            spaceBetween: 20,
          },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.Id} className="!w-[144px] md:!w-[180px]">
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
                <OptimizedImage
                  src={slide.ImageUrl}
                  alt="Card image"
                  fill
                  style={{ objectFit: "cover" }}
                  priority={index < 2} // İlk 1-2 şəklin (LCP) dərhal yüklənməsi üçün
                />
              </div>
              {/* <img
                src={slide.ImageUrl}
                alt={slide.Title || "Mini slider image"}
                loading="lazy"
                className="rounded w-[144px] md:w-[180px] md:h-[260px] h-[208px] object-cover"
              /> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {open.isOpen && (
        <LinkRenderer open={open} setOpen={setOpen} slides={slides} />
      )}
    </div>
  );
}
