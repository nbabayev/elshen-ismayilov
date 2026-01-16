"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import { useGalleries } from "@/app/hooks/useGallery";
import { getGalleryById } from "@/app/services/gallery.api";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

import {
  Captions,
  Fullscreen,
  Slideshow,
  Thumbnails,
  Zoom,
} from "yet-another-react-lightbox/plugins";

type TabType = "image" | "video";

interface GalleryItem {
  id: number;
  title: string;
  thumbImg: string;
  viewDate: string;
  imageCount?: number;
  videoCount?: number;
}

interface SlideImage {
  src: string;
  title?: string;
  description?: string;
}

interface SlideYoutube {
  type: "youtube";
  src: string;
  thumbnail: string;
  embedUrl: string;
  title?: string;
  description?: string;
}

type Slide = SlideImage | SlideYoutube;

// Helper function to convert YouTube URL to embed URL
const getYoutubeEmbedUrl = (url: string): string => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  return url;
};

// Get YouTube thumbnail
const getYoutubeThumbnail = (url: string): string => {
  const embedUrl = getYoutubeEmbedUrl(url);
  const videoId = embedUrl.split("/embed/")[1];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("image");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentSlides, setCurrentSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVideoGallery, setIsVideoGallery] = useState(false);

  const { data, isLoading, error } = useGalleries({
    page: currentPage,
    limit: 12,
    type: activeTab,
  });

  const openGallery = async (galleryId: number) => {
    setLoading(true);
    try {
      const response = await getGalleryById(galleryId);
      const gallery = response.data;

      if (activeTab === "image" && gallery.images) {
        const slides: SlideImage[] = gallery.images.map((img: any) => ({
          src: img.imageUrl,
          title: gallery.title,
          description: "",
        }));
        setCurrentSlides(slides);
        setIsVideoGallery(false);
      } else if (activeTab === "video" && gallery.videos) {
        const slides: SlideYoutube[] = gallery.videos.map((vid: any) => {
          const thumbUrl = getYoutubeThumbnail(vid.videoUrl);
          return {
            type: "youtube" as const,
            src: thumbUrl,
            thumbnail: thumbUrl,
            embedUrl: getYoutubeEmbedUrl(vid.videoUrl),
            title: vid.title || gallery.title,
            description: "",
          };
        });
        setCurrentSlides(slides);
        setIsVideoGallery(true);
      }

      setLightboxIndex(0);
      setLightboxOpen(true);
    } catch (error) {
      console.error("Qalereya yüklənmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const galleries: GalleryItem[] = data?.data || [];

  return (
    <div className="py-4">
      <Breadcrumb />

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => {
              setActiveTab("image");
              setCurrentPage(1);
            }}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === "image"
                ? "text-[#C88445] border-b-2 border-[#C88445] bg-white"
                : "text-gray-500 hover:text-gray-700 bg-gray-50"
            }`}
          >
            Şəkillər
          </button>
          <button
            onClick={() => {
              setActiveTab("video");
              setCurrentPage(1);
            }}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === "video"
                ? "text-[#C88445] border-b-2 border-[#C88445] bg-white"
                : "text-gray-500 hover:text-gray-700 bg-gray-50"
            }`}
          >
            Videolar
          </button>
        </div>
      </div>

      {/* Loading State */}
      {(isLoading || loading) && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C88445]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20 text-red-500">
          Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
              onClick={() => openGallery(gallery.id)}
            >
              {/* Thumbnail Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={gallery.thumbImg || "/images/placeholder.jpg"}
                  alt={gallery.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Play Icon for Videos */}
              {activeTab === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-black/70 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">
                  {gallery.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {formatDate(gallery.viewDate)}
                </p>
                <p className="text-white/70 text-xs mt-1">
                  {activeTab === "image"
                    ? `${gallery.imageCount || 0} şəkil`
                    : `${gallery.videoCount || 0} video`}
                </p>
              </div>

              {/* Item Count Badge */}
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {activeTab === "image"
                  ? `${gallery.imageCount || 0}`
                  : `${gallery.videoCount || 0}`}
                {activeTab === "image" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 inline ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 inline ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && galleries.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          {activeTab === "image"
            ? "Heç bir şəkil qalereyası tapılmadı."
            : "Heç bir video qalereyası tapılmadı."}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Əvvəlki
          </button>
          <span className="px-4 py-2 text-gray-600">
            {currentPage} / {data.pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, data.pagination.totalPages)
              )
            }
            disabled={currentPage === data.pagination.totalPages}
            className="px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Növbəti
          </button>
        </div>
      )}

      {/* Lightbox for both Images and Videos */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentSlides}
        plugins={
          isVideoGallery
            ? [Thumbnails]
            : [Captions, Fullscreen, Slideshow, Thumbnails, Zoom]
        }
        zoom={
          isVideoGallery
            ? undefined
            : {
                maxZoomPixelRatio: 1.5,
                zoomInMultiplier: 2,
                doubleTapDelay: 200,
                doubleClickDelay: 300,
                keyboardMoveDistance: 50,
                wheelZoomDistanceFactor: 2000,
              }
        }
        slideshow={isVideoGallery ? undefined : { delay: 2000 }}
        carousel={{ finite: true }}
        thumbnails={{
          position: "bottom",
          width: 100,
          height: 70,
        }}
        render={{
          slide: isVideoGallery
            ? ({ slide }) => {
                const videoSlide = slide as SlideYoutube;
                return (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-5xl aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={videoSlide.embedUrl}
                        title={videoSlide.title || "Video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </div>
                );
              }
            : undefined,
          thumbnail: isVideoGallery
            ? ({ slide }) => {
                const videoSlide = slide as SlideYoutube;
                return (
                  <img
                    src={videoSlide.thumbnail}
                    alt={videoSlide.title || "Video thumbnail"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                );
              }
            : undefined,
        }}
      />
    </div>
  );
}
