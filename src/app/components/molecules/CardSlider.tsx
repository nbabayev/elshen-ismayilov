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

export default function Slider() {
  const [slides, setSlides] = useState([
    {
      image: "/images/main-slide1.jpg",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/main-slide2.jpg",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/main-slide1.jpg",
      title: "Slide 1",
      link: "#",
    },
  ]);
  const { data: sliders, isLoading } = useArticles({
    limit: 9,
    page: 1,
  });

  console.log(sliders);
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
  console.log(sliders);
  return (
    <div>
      <div className="relative">
        {/* <div className="absolute  top-50 right-10 z-10  ">
          <SocialLinks />
        </div> */}
      </div>
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={4}
        // navigation
        spaceBetween={20}
        // autoplay={{ delay: 3000 }}
        speed={2000}
        loop={true}
        className="mainSlide"
        pagination={{ clickable: true }}
      >
        {sliders?.data.map((slide: any) => (
          <SwiperSlide className="pb-12">
            <Link href={`articles/${slide?.Id}`}>
              <ArticleCard data={slide} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
