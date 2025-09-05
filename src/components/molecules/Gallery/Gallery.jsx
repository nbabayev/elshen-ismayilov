"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Lightbox-u SSR-dən ayırmaq
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import {
  Captions,
  Fullscreen,
  Slideshow,
  Thumbnails,
  Video,
  Zoom,
} from "yet-another-react-lightbox/plugins";

export default function GalleryWithThumbnails() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentSlides, setCurrentSlides] = useState([]);

  const slides = [
    {
      src: "/images/gallery1-1.jpg",
      title: "Qobustan giriş",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
    {
      src: "/images/gallery1-2.jpg",
      title: "Qayaüstü rəsmlər",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
    {
      src: "/images/gallery1-3.jpg",
      title: "Muzey eksponatları",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
    {
      src: "/images/gallery1-4.jpg",
      title: "Qrup şəkli",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
  ];
  const slides2 = [
    {
      src: "/images/gallery2-3.jpg",
      title: "Qobustan giriş",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
    {
      src: "/images/gallery2-2.jpg",
      title: "Qayaüstü rəsmlər",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
    {
      src: "/images/gallery2-1.jpg",
      title: "Muzey eksponatları",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
    {
      src: "/images/gallery2-4.jpg",
      title: "Qrup şəkli",
      description: "Azərbaycanın qədim qayaüstü rəsmləri",
    },
  ];

  const openGallery = (slides, startIndex = 0) => {
    setCurrentSlides(slides);
    setIndex(startIndex);
    setOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-2">
        <img
          src={slides[0].src}
          alt={slides[0].title}
          className="cursor-pointer rounded-md object-cover h-39 w-full"
          onClick={() => openGallery(slides, 0)}
        />
        <img
          src={slides2[0].src}
          alt={slides2[0].title}
          className="cursor-pointer rounded-md object-cover h-39 w-full"
          onClick={() => openGallery(slides2, 0)}
        />
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={currentSlides}
        plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
        zoom={{
          maxZoomPixelRatio: 1.5,
          zoomInMultiplier: 2,
          doubleTapDelay: 200,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 2000,
        }}
        // carousel={{
        //   imageFit: "cover", // contain, cover, fill, inside, outside
        //   imageStyle: { objectFit: "fill" }, // şəkli məcburi dartır
        // }}
        // captions={{
        //   position: "top",
        //   showToggle: true,
        //   descriptionTextAlign: "center",
        // }}
        slideshow={{ delay: 2000 }}
        thumbnails={{
          position: "bottom",
          width: 100,
          height: 70,
        }}
      />
    </div>
  );
}
