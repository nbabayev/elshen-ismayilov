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

  const playersRef = useRef({});
  const [playingState, setPlayingState] = useState({});

  // Custom Pop-up State-ləri
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");

  // YouTube Iframe API-ni yükləyirik
  useEffect(() => {
    setMounted(true);

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Scroll bloklanması
  useEffect(() => {
    if (mounted) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
    return undefined;
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

  // YouTube pleyerini başladırıq
  const initYouTubePlayer = (iframeId, slideId, index) => {
    if (playersRef.current[slideId]) return;

    if (window.YT && window.YT.Player) {
      playersRef.current[slideId] = new window.YT.Player(iframeId, {
        events: {
          onReady: (event) => {
            if (index === activeIndex) {
              event.target.playVideo();
              setPlayingState((prev) => ({ ...prev, [slideId]: true }));
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
            if (event.data === window.YT.PlayerState.PLAYING) {
              setPlayingState((prev) => ({ ...prev, [slideId]: true }));
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setPlayingState((prev) => ({ ...prev, [slideId]: false }));
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
          setPlayingState((prev) => ({ ...prev, [s.Id]: true }));
        } else {
          player.pauseVideo();
          setPlayingState((prev) => ({ ...prev, [s.Id]: false }));
        }
      }
    });
  };

  // Ekrana klikləyəndə Play/Pause funksiyası
  const togglePlayPause = (slideId) => {
    const player = playersRef.current[slideId];
    if (player && typeof player.pauseVideo === "function") {
      const isPlaying = playingState[slideId];
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const copyToClipboard = (text) => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard.writeText(text).then(() => alert("Link kopyalandı!"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Link kopyalandı!");
    }
  };

  // 📱 MOBİL REJİM
  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 bg-black z-50 flex flex-col h-screen w-screen overflow-hidden select-none touch-none">
        {/* 🔙 GERİ DÜYMƏSİ */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-14 left-4 z-50 bg-black/40 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-all shadow-lg"
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

        <div className="h-full w-full" onClick={(e) => e.stopPropagation()}>
          <Swiper
            modules={[Mousewheel]}
            direction="vertical"
            slidesPerView={1}
            initialSlide={open.selectedIndex || 0}
            mousewheel={true}
            resistanceRatio={0}
            onSlideChange={handleSlideChange}
            className="h-full w-full"
          >
            {(slides || []).map((s, index) => {
              const iframeId = `yt-player-${s.Id}`;
              // Native YouTube elementlərini sıfırlamaq üçün parametrlər
              const embedUrl = `${s.embedLink}&controls=0&enablejsapi=1&rel=0&iv_load_policy=3&modestbranding=1&showinfo=0`;
              const isPaused = !playingState[s.Id];

              return (
                <SwiperSlide
                  key={s.Id}
                  className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden"
                >
                  {/* 🔒 TAM EKRAN ŞƏFFAF TOUCH LAYER */}
                  <div
                    className="absolute inset-0 z-30 bg-transparent cursor-pointer flex items-center justify-center"
                    onClick={() => togglePlayPause(s.Id)}
                  >
                    {/* 🔥 YALNIZ VİDEO PAUSE OLANDA ORTADA ÇIXAN SHARE DÜYMƏSİ */}
                    {isPaused && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Arxadakı play/pause hadisəsini dayandırır
                          const videoId = s.embedLink
                            .split("embed/")[1]
                            ?.split("?")[0];
                          if (videoId) {
                            setCurrentShareUrl(`https://youtu.be/${videoId}`);
                            setIsShareOpen(true);
                          } else {
                            alert("Link tapılmadı.");
                          }
                        }}
                        className="z-40 flex flex-col items-center gap-2 bg-black/75 backdrop-blur-lg border border-white/20 text-white px-6 py-4 rounded-2xl shadow-2xl scale-100 active:scale-90 transition-all duration-200 animate-in fade-in zoom-in-95"
                      >
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 text-blue-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-bold tracking-wide">
                          Videonu Paylaş
                        </span>
                      </button>
                    )}

                    {/* SOL AŞAĞIDAKI VİDEO BAŞLIĞI */}
                    {s.Title && (
                      <div className="absolute bottom-8 left-4 right-20 text-white text-sm font-semibold drop-shadow-md pointer-events-none text-left line-clamp-2 leading-relaxed">
                        {s.Title}
                      </div>
                    )}
                  </div>

                  {/* 📺 Orijinal YouTube Video Iframe */}
                  <div className="w-full h-[106vh] absolute top-0 left-0 z-10 pointer-events-none overflow-hidden">
                    <iframe
                      id={iframeId}
                      className="w-full h-full object-cover scale-[1.07]" // Skala ilə alt zolağı ekranın kənarlarına sıxışdırırıq
                      src={embedUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                      onLoad={() => initYouTubePlayer(iframeId, s.Id, index)}
                    ></iframe>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* 🛠️ CUSTOM YARIM POP-UP (BOTTOM SHEET) */}
        {isShareOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-55 flex items-end justify-center animate-in fade-in duration-200"
            onClick={() => setIsShareOpen(false)}
          >
            <div
              className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-5 shadow-2xl transform translate-y-0 transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto -mt-2 mb-1"></div>
              <h3 className="text-gray-900 text-lg font-extrabold tracking-tight">
                Videonu Paylaş
              </h3>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <input
                  type="text"
                  readOnly
                  value={currentShareUrl}
                  className="bg-transparent text-sm text-blue-600 font-medium flex-1 outline-none truncate"
                />
                <button
                  onClick={() => copyToClipboard(currentShareUrl)}
                  className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold active:scale-95 transition-all shadow-sm"
                >
                  Kopyala
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 my-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    currentShareUrl
                  )}`}
                  target="_blank"
                  className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl font-bold border border-green-100 shadow-sm">
                    W
                  </div>
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    currentShareUrl
                  )}`}
                  target="_blank"
                  className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl font-bold border border-blue-100 shadow-sm">
                    T
                  </div>
                  <span>Telegram</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    currentShareUrl
                  )}`}
                  target="_blank"
                  className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold border border-indigo-100 shadow-sm">
                    F
                  </div>
                  <span>Facebook</span>
                </a>
                <a
                  href={`mailto:?body=${encodeURIComponent(currentShareUrl)}`}
                  className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl font-bold border border-red-100 shadow-sm">
                    @
                  </div>
                  <span>Email</span>
                </a>
              </div>

              <button
                onClick={() => setIsShareOpen(false)}
                className="w-full bg-gray-100 text-gray-800 py-3.5 rounded-xl font-bold active:scale-95 transition-all text-sm mt-1 border border-gray-200"
              >
                Bağla
              </button>
            </div>
          </div>
        )}
      </div>,
      document.body
    );
  }

  // 💻 DESKTOP REJİMİ
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
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LinkRenderer;
