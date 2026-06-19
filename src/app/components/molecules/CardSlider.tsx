"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import SocialLinks from "@/app/components/shared/SocialLinks";
import { useSliders } from "@/app/hooks/useSlider";
import { useArticles } from "@/app/hooks/useArticle";
import Link from "next/link";
import { ArticleCard } from "@/app/components/molecules/ArticleCard/ArticleCard";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import LessonCard from "@/app/components/molecules/LessonCard/LessonCard";
import VideoCard from "@/app/components/molecules/VideoCard/VideoCard";
type OpenState = {
  link: string;
  isOpen: boolean;
};

export default function Slider({
  data = [],
  type,
  setOpen,
}: {
  data: any[];
  type?: string;
  setOpen: React.Dispatch<React.SetStateAction<OpenState>>;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // const [slides, setSlides] = useState([
  //   {
  //     image: "/images/main-slide1.jpg",
  //     title: "Slide 1",
  //     link: "#",
  //   },
  //   {
  //     image: "/images/main-slide2.jpg",
  //     title: "Slide 1",
  //     link: "#",
  //   },
  //   {
  //     image: "/images/main-slide1.jpg",
  //     title: "Slide 1",
  //     link: "#",
  //   },
  // ]);

  // useEffect(() => {
  //   async function fetchSlides() {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/videos"); // backend endpoint
  //       const data = await res.json();
  //       setSlides(data);
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching slides:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchSlides();
  // }, []);
  // if (loading) return <p>Loading...</p>;

  let slidePerView = type === "0" ? (isDesktop ? 3 : 1.2) : isDesktop ? 4 : 1.2;
  let Component = type === "0" ? LessonCard : VideoCard;
  return (
    <div
      className={`${
        type === "0" &&
        "transform md:-translate-y-[150px] -translate-y-[60px] z-[2]"
      }`}
    >
      <Swiper
        modules={[A11y, Autoplay]}
        slidesPerView={slidePerView}
        // navigation
        spaceBetween={20}
        // autoplay={{ delay: 3000 }}
        speed={2000}
        loop={true}
        className="mainSlide"
        // pagination={{ clickable: isDesktop }}
      >
        {data?.map((v: any, i: number) => (
          <SwiperSlide key={i}>
            {/* <Link href={`${v?.selectionId}`} key={v?.selectionId}> */}
            <Component key={v.selectionId} data={v?.video} setOpen={setOpen} />
            {/* </Link> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
