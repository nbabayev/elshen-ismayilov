"use client";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import SocialLinks from "@/app/components/shared/SocialLinks";

export default function Slider({ data }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    const paginationEl = document.querySelector(".swiper-pagination");

    if (paginationEl && !paginationEl.querySelector(".etrafli-btn")) {
      const btn = document.createElement("a");
      btn.className =
        "etrafli-btn absolute bottom-5 bg-[#ad6e33] text-white px-3 py-1 rounded hover:bg-gray-800";
      btn.innerHTML = "<span>Ətraflı</span>";
      btn.target = "_blank";
      paginationEl.appendChild(btn);
    }
  }, [data, swiperRef]);

  return (
    <div>
      <div className="relative">
        <div className="absolute  top-50 right-10 z-10  ">
          <SocialLinks />
        </div>
      </div>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={1}
        // navigation
        // autoplay={{ delay: 3000 }}
        speed={2000}
        onSlideChange={(swiper) => {
          const btn = document.querySelector(".etrafli-btn");
          const realIndex = swiper.realIndex;

          if (btn && data?.[realIndex]) {
            btn.href = data[realIndex].Link;
          }
        }}
        loop={true}
        className="mainSlide"
        pagination={{
          clickable: true,
          renderCustom: (swiper, current, total) => {
            let bullets = "";
            for (let i = 1; i <= total; i++) {
              bullets += `<span class="${
                i === current ? "swiper-pagination-bullet-active" : ""
              } swiper-pagination-bullet"></span>`;
            }
            return bullets;
          },
        }}
      >
        {data?.map((slide) => (
          <SwiperSlide>
            <a
              href={slide.Link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
            >
              <img
                src={slide.Image}
                alt=""
                loading="lazy"
                className="w-full h-[626px] object-cover object-top"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
