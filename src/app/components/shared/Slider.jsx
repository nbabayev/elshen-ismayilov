"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import SocialLinks from "@/app/components/shared/SocialLinks";
import { useMediaQuery } from "@/app/utils/useMediaQuery";

export default function Slider({ data, loading }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  useEffect(() => {
    // Pagination düyməsini yaratmaq məntiqin
    const paginationEl = document.querySelector(".swiper-pagination");
    if (paginationEl && !paginationEl.querySelector(".etrafli-btn")) {
      const btn = document.createElement("a");
      btn.className =
        "etrafli-btn absolute bottom-5 bg-[#ad6e33] text-white px-3 py-1 rounded hover:bg-gray-800 z-50";
      btn.innerHTML = "<span>Ətraflı</span>";
      btn.target = "_blank";
      paginationEl.appendChild(btn);
    }
  }, [data]);

  return (
    <div className="relative">
      {/* SOSİAL LİNKLƏRİN QABI: 
         isSwiperReady false olduğu müddətcə opacity-0 olacaq (görünməyəcək).
         transition-opacity ilə çox hamar şəkildə peyda olacaq.
      */}
      {!isMobile && (
        <div
          className={`absolute top-50 right-10 z-20 transition-all duration-500 ease-in-out 
    ${
      !loading
        ? "opacity-100 visible translate-x-0"
        : "opacity-0 invisible translate-x-10"
    }`}
        >
          <SocialLinks />
        </div>
      )}{" "}
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={1}
        speed={2000}
        loop={true}
        className="mainSlide"
        onSlideChange={(swiper) => {
          const btn = document.querySelector(".etrafli-btn");
          const realIndex = swiper.realIndex;
          if (btn && data?.[realIndex]) {
            btn.href = data[realIndex].Link;
          }
        }}
        pagination={{
          clickable: true,
        }}
      >
        {data?.map((slide, index) => (
          <SwiperSlide key={index}>
            <a
              href={slide.Link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
            >
              <div className="relative w-full h-[260px] sm:h-[360px] md:h-[626px]">
                <img
                  src={slide.Image}
                  alt=""
                  loading="lazy"
                  className="w-full h-[260px] sm:h-[360px] md:h-[626px] object-cover object-center"
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
