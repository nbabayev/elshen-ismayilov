"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  A11y,
  Autoplay,
  Mousewheel,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useState } from "react";
import SocialLinks from "@/app/components/shared/SocialLinks";
import OptimizedImage from "@/app/components/atoms/OptimizedImage";

function cloudinarySrc(src, transform) {
  if (
    !src ||
    !src.includes("res.cloudinary.com") ||
    !src.includes("/upload/")
  ) {
    return src;
  }
  return src.replace("/upload/", `/upload/${transform}/`);
}

function SlideFooter({ slide }) {
  const overlayText = slide?.Title?.trim() || "";
  const showSignature = Boolean(slide?.Signature);
  const buttonClass = `inline-block rounded bg-[#C88445] px-5 py-2.5 font-lexend text-sm text-white ${
    overlayText || showSignature ? "mt-8" : ""
  }`;

  return (
    <div className="relative h-[450px] overflow-hidden bg-[#003a3c] text-white md:hidden">
      <div
        aria-hidden
        className="pointer-events-none h-[45%] absolute inset-0 bg-[url('/images/lesson-pattern.svg')]   bg-center bg-no-repeat scale-y-[-1]"
      />
      <div className="relative z-[1] mx-auto h-full max-w-[1250px] px-6 pt-10 pb-[120px]">
        {overlayText ? (
          <p className="max-w-[920px] font-playfair text-[26px] leading-[1.35]">
            {overlayText}
          </p>
        ) : null}
        {showSignature ? (
          <div className={overlayText ? "mt-8" : ""}>
            <p className="font-playfair text-xl leading-tight">
              Elşən İsmayılov
            </p>
            <p className="mt-1 font-lexend text-sm text-white/80">
              İslamşünas-Teoloq
            </p>
          </div>
        ) : null}
        {slide?.Link ? (
          <a
            href={slide.Link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClass} transition-opacity hover:opacity-90`}
          >
            Daha ətraflı
          </a>
        ) : (
          <span className={buttonClass}>Daha ətraflı</span>
        )}
      </div>
    </div>
  );
}

export default function Slider({ data, loading }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // useEffect(() => {
  //   // Pagination düyməsini yaratmaq məntiqin
  //   const paginationEl = document.querySelector(".swiper-pagination");
  //   if (paginationEl && !paginationEl.querySelector(".etrafli-btn")) {
  //     const btn = document.createElement("a");
  //     btn.className =
  //       "etrafli-btn absolute bottom-5 bg-[#ad6e33] text-white px-3 py-1 rounded hover:bg-gray-800 z-50";
  //     btn.innerHTML = "<span>Ətraflı</span>";
  //     btn.target = "_blank";
  //     paginationEl.appendChild(btn);
  //   }
  // }, [data]);
  const paginationRef = useRef(null);

  return (
    <>
      <div className="relative min-h-[442px] md:min-h-[626px]">
        {/* CSS ilə gizlə: JS mediaQuery ilk render-də false olur → flicker olurdu */}
        <div
          className={`hidden md:block absolute top-50 right-10 z-9 transition-all duration-500 ease-in-out
    ${
      !loading
        ? "opacity-100 visible translate-x-0"
        : "opacity-0 invisible translate-x-10"
    }`}
        >
          <SocialLinks />
        </div>
        {loading ? (
          <div className="space-y-3">
            <div className="h-[442px] md:h-[626px] w-full bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay, Mousewheel]}
            slidesPerView={1}
            observeParents={true}
            observer={true}
            speed={2000}
            loop={true}
            autoHeight
            className="mainSlide"
            mousewheel={{
              forceToAxis: true,
            }}
            pagination={{
              clickable: true,
              el: ".custom-pagination", // öz div-imizə bağlayırıq
            }}
            // onBeforeInit={(swiper) => {
            //   // el hələ null olduğu üçün, swiper init olmazdan əvvəl təyin edirik
            //   swiper.params.pagination.el = paginationRef.current;
            // }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {data?.map((slide, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <a
                  href={slide.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block"
                >
                  <div className="relative w-full h-[442px] md:h-[626px]">
                    {slide.isVideo ? (
                      <OptimizedImage
                        src={slide.Image}
                        alt={slide.Title || "Slayder"}
                        fill
                        type="slider"
                        style={{ objectFit: "cover" }}
                        priority={index < 2}
                        fetchPriority="high"
                      />
                    ) : (
                      <picture className="absolute inset-0 block h-full w-full">
                        {slide.MobileImage ? (
                          <source
                            media="(max-width: 767px)"
                            srcSet={cloudinarySrc(
                              slide.MobileImage,
                              "w_800,q_auto,f_auto"
                            )}
                          />
                        ) : null}
                        <img
                          src={cloudinarySrc(slide.Image, "w_1600,q_80,f_auto")}
                          alt={slide.Title || "Slayder"}
                          className="h-full w-full object-cover"
                          fetchPriority={index < 2 ? "high" : "auto"}
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </picture>
                    )}
                    {/* <Image
                  src={slide.Image}
                  alt="Gallery"
                  fill // Şəklin konteynerə sığması üçün
                  sizes="100vw" // Mobil üçün kiçik ölçülü şəkil tələb edir
                  style={{ objectFit: "cover" }}
                  priority={index < 2} // İlk 1-2 şəklin (LCP) dərhal yüklənməsi üçün
                /> */}
                    {/* <img
                  src={slide.Image}
                  alt=""
                  loading="lazy"
                  className="w-full h-[260px] sm:h-[360px] md:h-[626px] object-cover object-center"
                /> */}
                  </div>
                </a>
                <SlideFooter slide={slide} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="absolute top-100 left-1/2 z-9 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="custom-pagination swiper-pagination !static" />
          {data?.[activeIndex] ? (
            <a
              href={data[activeIndex].Link}
              target="_blank"
              rel="noopener noreferrer"
              className="etrafli-btn hidden rounded bg-[#ad6e33] px-3 py-1 text-white hover:bg-gray-800 md:inline-block"
            >
              Daha ətraflı
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
