"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";

const LinkRenderer = ({ open, setOpen, slides }) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [activeIndex, setActiveIndex] = useState(open.selectedIndex || 0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const playersRef = useRef({});

  useEffect(() => {
    setMounted(true);

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Sol kənar swipe ipucunu bir neçə saniyə göstər, sonra yumşaq gizlət
  useEffect(() => {
    if (!isMobile) return undefined;
    const timer = setTimeout(() => setShowSwipeHint(false), 4500);
    return () => clearTimeout(timer);
  }, [isMobile]);

  useEffect(() => {
    if (!mounted) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mounted]);

  if (!mounted) return null;

  const handleClose = () => {
    Object.values(playersRef.current).forEach((player) => {
      if (player && typeof player.pauseVideo === "function") {
        player.pauseVideo();
      }
    });
    setOpen((prev) => ({ ...prev, isOpen: false }));
  };

  const initYouTubePlayer = (iframeId, slideId, index) => {
    if (playersRef.current[slideId]) return;

    if (window.YT && window.YT.Player) {
      playersRef.current[slideId] = new window.YT.Player(iframeId, {
        events: {
          onReady: (event) => {
            if (index === activeIndex) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    } else {
      setTimeout(() => initYouTubePlayer(iframeId, slideId, index), 200);
    }
  };

  const handleSlideChange = (swiper) => {
    const nextIndex = swiper.activeIndex;
    setActiveIndex(nextIndex);

    (slides || []).forEach((s, idx) => {
      const player = playersRef.current[s.Id];
      if (player && typeof player.pauseVideo === "function") {
        if (idx === nextIndex) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      }
    });
  };

  // 📱 MOBİL
  // YouTube düymələri işləsin deyə iframe interactive-dir.
  // Scroll üçün sol kənarda swipe zonası var (Shorts like/share sağdadır).
  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 bg-black z-50 flex flex-col h-[100dvh] w-screen overflow-hidden select-none">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-3 z-50 bg-black/50 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-all shadow-lg"
          aria-label="Bağla"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <div className="h-full w-full">
          <Swiper
            modules={[Mousewheel]}
            direction="vertical"
            slidesPerView={1}
            initialSlide={open.selectedIndex || 0}
            mousewheel={true}
            resistanceRatio={0}
            threshold={5}
            noSwiping={true}
            noSwipingClass="yt-no-swipe"
            onSlideChange={handleSlideChange}
            className="h-full w-full"
          >
            {(slides || []).map((s, index) => {
              const iframeId = `yt-player-${s.Id}`;
              const embedUrl = `${s.embedLink}&controls=1&enablejsapi=1&rel=0&playsinline=1&modestbranding=1`;

              return (
                <SwiperSlide
                  key={s.Id}
                  className="w-full h-full bg-black relative"
                >
                  {/* YouTube — native like / share / ses / ⋮ işləyir */}
                  <div className="yt-no-swipe absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full max-w-[100vw] aspect-[9/16] max-h-[100dvh]">
                      <iframe
                        id={iframeId}
                        className="absolute inset-0 w-full h-full"
                        src={embedUrl}
                        title={s.Title || "Video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                        allowFullScreen
                        onLoad={() =>
                          initYouTubePlayer(iframeId, s.Id, index)
                        }
                      />
                    </div>
                  </div>

                  {/* Sol kənar — vertical swipe zonası (görünən strip) */}
                  <div
                    className="absolute left-0 top-0 bottom-0 z-30 w-16 bg-gradient-to-r from-black/55 via-black/25 to-transparent"
                    aria-hidden
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* İstifadəçi ipucu: soldan sürüşdür */}
        <div
          className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 pl-1.5 transition-opacity duration-700 ${
            showSwipeHint ? "opacity-100" : "opacity-50"
          }`}
        >
          <div className="flex flex-col items-center gap-1 text-white drop-shadow-lg animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
            <div className="w-1.5 h-20 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.45)]" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          {showSwipeHint && (
            <span className="mt-1 max-w-[4.5rem] text-center text-[10px] leading-tight font-semibold text-white/95 bg-black/55 border border-white/20 rounded-lg px-1.5 py-1 backdrop-blur-sm">
              Soldan sürüşdür
            </span>
          )}
        </div>
      </div>,
      document.body
    );
  }

  // 💻 DESKTOP
  return createPortal(
    <div
      className="fixed inset-0 bg-[#00000073] bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg overflow-hidden shadow-lg w-[90%] max-w-[420px] sm:max-w-[560px] md:max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[9/16] md:aspect-video max-h-[90vh]">
          <iframe
            className="w-full h-full"
            src={open.link}
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LinkRenderer;
